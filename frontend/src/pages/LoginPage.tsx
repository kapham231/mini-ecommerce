import { LoginForm } from '~/features/auth/LoginForm'

export function LoginPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 py-12'>
      <LoginForm />
    </div>
  )
}
