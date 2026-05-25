import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { register as registerRequest } from '~/lib/api/auth'
import { saveAuthToStorage } from '~/lib/authStorage'
import { useAppDispatch } from '~/app/hooks'
import { setCredentials } from '~/features/auth/authSlice'
import { setCartItems } from '~/features/cart/cartSlice'
import { setWishlistIds } from '~/features/wishlist/wishlistSlice'
import { readCartFromStorage } from '~/lib/cartStorage'
import { readWishlistFromStorage } from '~/lib/wishlistStorage'
import type { AuthResponse } from '~/types/auth'

type RegisterFormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>
type RegisterTouched = Partial<Record<keyof RegisterFormValues, boolean>>

function normalizeUser(user: AuthResponse['user']) {
  return {
    ...user,
    id: String(user.id)
  }
}

function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/

  if (!values.name.trim()) {
    errors.name = 'Vui lòng nhập họ tên'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Họ tên phải có ít nhất 2 ký tự'
  }

  if (!values.email.trim()) {
    errors.email = 'Vui lòng nhập email'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Email không hợp lệ'
  }

  if (!values.password) {
    errors.password = 'Vui lòng nhập mật khẩu'
  } else if (!strongPasswordRegex.test(values.password)) {
    errors.password = 'Mật khẩu tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Vui lòng nhập lại mật khẩu'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Mật khẩu nhập lại chưa khớp'
  }

  return errors
}

export function RegisterForm() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<RegisterFormErrors>({})
  const [touched, setTouched] = useState<RegisterTouched>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function getValues(): RegisterFormValues {
    return { name, email, password, confirmPassword }
  }

  function validateField(field: keyof RegisterFormValues, nextValues: RegisterFormValues) {
    const nextErrors = validateRegisterForm(nextValues)
    setFieldErrors((prev) => ({ ...prev, [field]: nextErrors[field] }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setHasSubmitted(true)
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    const values = getValues()
    const errors = validateRegisterForm(values)
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }
    setIsLoading(true)
    try {
      const data = await registerRequest({ email, password, name })
      const user = normalizeUser(data.user)
      const userCartItems = readCartFromStorage(user.id)
      const userWishlistIds = readWishlistFromStorage(user.id)
      dispatch(setCartItems(userCartItems))
      dispatch(setWishlistIds(userWishlistIds))
      dispatch(setCredentials({ token: data.token, user }))
      saveAuthToStorage(data.token, user)
      navigate('/')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { message?: string })?.message ?? err.message ?? 'Đăng ký thất bại'
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
          onChange={(e) => {
            const nextName = e.target.value
            setName(nextName)
            if (hasSubmitted) {
              validateField('name', { ...getValues(), name: nextName })
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, name: true }))
            validateField('name', getValues())
          }}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
        {touched.name && fieldErrors.name && <span className='text-xs text-red-700'>{fieldErrors.name}</span>}
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Email
        <input
          type='email'
          name='email'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => {
            const nextEmail = e.target.value
            setEmail(nextEmail)
            if (hasSubmitted) {
              validateField('email', { ...getValues(), email: nextEmail })
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, email: true }))
            validateField('email', getValues())
          }}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
        {touched.email && fieldErrors.email && <span className='text-xs text-red-700'>{fieldErrors.email}</span>}
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Mật khẩu
        <input
          type='password'
          name='password'
          autoComplete='new-password'
          required
          minLength={8}
          value={password}
          onChange={(e) => {
            const nextPassword = e.target.value
            setPassword(nextPassword)
            if (hasSubmitted) {
              const nextValues = { ...getValues(), password: nextPassword }
              const nextErrors = validateRegisterForm(nextValues)
              setFieldErrors((prev) => ({
                ...prev,
                password: nextErrors.password,
                confirmPassword: nextErrors.confirmPassword
              }))
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, password: true }))
            validateField('password', getValues())
          }}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
        {touched.password && fieldErrors.password && <span className='text-xs text-red-700'>{fieldErrors.password}</span>}
      </label>

      <label className='flex flex-col gap-1 text-left text-sm font-medium text-shop-ink/80'>
        Nhập lại mật khẩu
        <input
          type='password'
          name='confirmPassword'
          autoComplete='new-password'
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => {
            const nextConfirmPassword = e.target.value
            setConfirmPassword(nextConfirmPassword)
            if (hasSubmitted) {
              validateField('confirmPassword', { ...getValues(), confirmPassword: nextConfirmPassword })
            }
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, confirmPassword: true }))
            validateField('confirmPassword', getValues())
          }}
          className='rounded-md border border-shop-ink/10 px-3 py-2 text-shop-ink outline-none ring-kid-mint focus:ring-2 focus:ring-shop-ink/10 focus:ring-offset-2 focus:ring-offset-white'
        />
        {touched.confirmPassword && fieldErrors.confirmPassword && (
          <span className='text-xs text-red-700'>{fieldErrors.confirmPassword}</span>
        )}
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
