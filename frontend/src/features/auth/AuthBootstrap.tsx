import { useEffect } from 'react'
import axios from 'axios'
import { useAppDispatch } from '~/app/hooks'
import { setBootstrapped, setCredentials, logout } from '~/features/auth/authSlice'
import { setCartItems } from '~/features/cart/cartSlice'
import { setWishlistIds } from '~/features/wishlist/wishlistSlice'
import { getMe } from '~/lib/api/auth'
import { clearAuthStorage, saveUserToStorage } from '~/lib/authStorage'
import { readCartFromStorage } from '~/lib/cartStorage'
import { readWishlistFromStorage } from '~/lib/wishlistStorage'

type AuthBootstrapProps = {
  children: React.ReactNode
}

export function AuthBootstrap({ children }: AuthBootstrapProps) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    let cancelled = false

    async function bootstrapAuth() {
      try {
        const data = await getMe()
        if (cancelled) return

        const user = {
          ...data.user,
          id: String(data.user.id)
        }

        dispatch(setCredentials({ user }))
        saveUserToStorage(user)
        dispatch(setCartItems(readCartFromStorage(user.id)))
        dispatch(setWishlistIds(readWishlistFromStorage(user.id)))
      } catch (error) {
        if (cancelled) return
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          clearAuthStorage()
          dispatch(logout())
        }
      } finally {
        if (!cancelled) {
          dispatch(setBootstrapped(true))
        }
      }
    }

    void bootstrapAuth()

    return () => {
      cancelled = true
    }
  }, [dispatch])

  return children
}
