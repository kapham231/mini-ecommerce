import { RegisterForm } from '~/features/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950'>
      <RegisterForm />
    </div>
  )
}
