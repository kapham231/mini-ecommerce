import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { axiosInstance } from '~/lib/axios'
import { saveAuthToStorage } from '~/lib/authStorage'
import { useAppDispatch } from '~/app/hooks'
import { setCredentials } from '~/features/auth/authSlice'
import type { AuthResponse } from '~/types/auth'

function normalizeUser(user: AuthResponse['user']) {
  return {
    ...user,
    id: String(user.id)
  }
}

export function LoginForm() {
  const navigate = useNavigate()
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
      const { data } = await axiosInstance.post<AuthResponse>('/auth/login', {
        email,
        password
      })
      const user = normalizeUser(data.user)
      dispatch(setCredentials({ accessToken: data.accessToken, user }))
      saveAuthToStorage(data.accessToken, user)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message ?? err.message ?? 'Đăng nhập thất bại'
        setError(msg)
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
      className='mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900'
    >
      <h1 className='text-center text-2xl font-semibold text-gray-900 dark:text-gray-100'>Đăng nhập</h1>

      {error && (
        <p
          className='rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300'
          role='alert'
        >
          {error}
        </p>
      )}

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
        Email
        <input
          type='email'
          name='email'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-violet-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
        />
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-gray-700 dark:text-gray-300'>
        Mật khẩu
        <input
          type='password'
          name='password'
          autoComplete='current-password'
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='rounded-md border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-violet-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
        />
      </label>

      <button
        type='submit'
        disabled={isLoading}
        className='rounded-md bg-violet-600 px-4 py-2 font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isLoading ? 'Đang xử lý…' : 'Đăng nhập'}
      </button>

      <p className='text-center text-sm text-gray-600 dark:text-gray-400'>
        Chưa có tài khoản?{' '}
        <Link to='/register' className='font-medium text-violet-600 hover:underline dark:text-violet-400'>
          Đăng ký
        </Link>
      </p>
    </form>
  )
}
