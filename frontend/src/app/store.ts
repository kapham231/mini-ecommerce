import { configureStore } from '@reduxjs/toolkit'
import authReducer from '~/features/auth/authSlice'
import cartReducer, { type CartState } from '~/features/cart/cartSlice'
import type { AuthState } from '~/features/auth/authSlice'
import { readAuthFromStorage } from '~/lib/authStorage'
import { readCartFromStorage, saveCartToStorage } from '~/lib/cartStorage'

const preloaded = readAuthFromStorage()

const preloadedAuth: AuthState | undefined = preloaded
  ? {
      user: preloaded.user,
      accessToken: preloaded.accessToken,
      isAuthenticated: true
    }
  : undefined

const preloadedCart: CartState = {
  items: readCartFromStorage()
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer
  },
  preloadedState: {
    ...(preloadedAuth !== undefined ? { auth: preloadedAuth } : {}),
    cart: preloadedCart
  }
})

store.subscribe(() => {
  saveCartToStorage(store.getState().cart.items)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
