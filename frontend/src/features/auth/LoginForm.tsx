import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { login as loginRequest } from '~/lib/api/auth'
import { saveUserToStorage } from '~/lib/authStorage'
import { useAppDispatch } from '~/app/hooks'
import { setCredentials } from '~/features/auth/authSlice'
import { setCartItems } from '~/features/cart/cartSlice'
import { setWishlistIds } from '~/features/wishlist/wishlistSlice'
import { readCartFromStorage } from '~/lib/cartStorage'
import { readWishlistFromStorage } from '~/lib/wishlistStorage'
import type { AuthResponse } from '~/types/auth'

function normalizeUser(user: AuthResponse['user']) {
  return {
    ...user,
    id: String(user.id)
  }
}

function getPostLoginPath(fromPath: string | undefined, role: AuthResponse['user']['role']) {
  if (!fromPath) return '/'

  if (fromPath.startsWith('/admin')) {
    return role === 'ADMIN' ? fromPath : '/'
  }

  return fromPath
}

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const data = await loginRequest({ email, password })
      const user = normalizeUser(data.user)
      const userCartItems = readCartFromStorage(user.id)
      const userWishlistIds = readWishlistFromStorage(user.id)
      dispatch(setCartItems(userCartItems))
      dispatch(setWishlistIds(userWishlistIds))
      dispatch(setCredentials({ user }))
      saveUserToStorage(user)

      const fromPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(getPostLoginPath(fromPath, user.role))
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message ?? err.message ?? 'Đăng nhập thất bại'
        setError(msg)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Đã xảy ra lỗi')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-shop-ink/10 bg-white p-6 shadow-sm'
    >
      <h1 className='text-center text-2xl font-extrabold text-shop-ink'>Đăng nhập</h1>

      {error && (
        <p
          className='rounded-md bg-red-50 px-3 py-2 text-sm text-red-700'
          role='alert'
        >
          {error}
        </p>
      )}

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Email
        <input
          type='email'
          name='email'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint'
        />
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Mật khẩu
        <input
          type='password'
          name='password'
          autoComplete='current-password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint'
        />
      </label>

      <button
        type='submit'
        disabled={isLoading}
        className='rounded-md bg-kid-green px-4 py-2 font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isLoading ? 'Đang xử lý…' : 'Đăng nhập'}
      </button>

      <p className='text-center text-sm text-shop-ink/80'>
        Chưa có tài khoản?{' '}
        <Link to='/register' className='font-medium text-shop-teal hover:underline dark:text-kid-mint'>
          Đăng ký
        </Link>
      </p>
    </form>
  )
}
