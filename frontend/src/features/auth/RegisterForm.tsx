import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { axiosInstance } from '~/lib/axios'
import { saveAuthToStorage } from '~/lib/authStorage'
import { useAppDispatch } from '~/app/hooks'
import { setCredentials } from '~/features/auth/authSlice'
import type { AuthResponse, RegisterSuccessResponse } from '~/types/auth'

function isAuthResponse(data: RegisterSuccessResponse): data is AuthResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'accessToken' in data &&
    'user' in data &&
    typeof (data as AuthResponse).accessToken === 'string'
  )
}

function normalizeUser(user: AuthResponse['user']) {
  return {
    ...user,
    id: String(user.id)
  }
}

export function RegisterForm() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      const { data } = await axiosInstance.post<RegisterSuccessResponse>('/auth/register', {
        email,
        password,
        name
      })

      if (isAuthResponse(data)) {
        const user = normalizeUser(data.user)
        dispatch(setCredentials({ accessToken: data.accessToken, user }))
        saveAuthToStorage(data.accessToken, user)
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message ?? err.message ?? 'Đăng ký thất bại'
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
      className='mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-shop-ink/10 bg-white p-6 shadow-sm'
    >
      <h1 className='text-center text-2xl font-extrabold text-shop-ink'>Đăng ký</h1>

      {error && (
        <p
          className='rounded-md bg-red-50 px-3 py-2 text-sm text-red-700'
          role='alert'
        >
          {error}
        </p>
      )}

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Họ tên
        <input
          type='text'
          name='name'
          autoComplete='name'
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Email
        <input
          type='email'
          name='email'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Mật khẩu
        <input
          type='password'
          name='password'
          autoComplete='new-password'
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
      </label>

      <button
        type='submit'
        disabled={isLoading}
        className='rounded-md bg-kid-green px-4 py-2 font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isLoading ? 'Đang xử lý…' : 'Đăng ký'}
      </button>

      <p className='text-center text-sm text-shop-ink/80'>
        Đã có tài khoản?{' '}
        <Link to='/login' className='font-medium text-shop-teal hover:underline'>
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}
