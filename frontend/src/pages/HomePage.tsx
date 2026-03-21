import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { logout } from '~/features/auth/authSlice'
import { clearAuthStorage } from '~/lib/authStorage'

export function HomePage() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((s) => s.auth)

  function handleLogout() {
    clearAuthStorage()
    dispatch(logout())
  }

  return (
    <div className='mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-12'>
      <header className='flex flex-wrap items-center justify-between gap-4'>
        <h1 className='text-2xl font-semibold text-gray-900 dark:text-gray-100'>Trang chủ</h1>
        <nav className='flex flex-wrap items-center gap-3 text-sm'>
          {isAuthenticated ? (
            <>
              <span className='text-gray-600 dark:text-gray-400'>
                Xin chào, <strong>{user?.name ?? user?.email}</strong>
              </span>
              <button
                type='button'
                onClick={handleLogout}
                className='rounded-md border border-gray-300 px-3 py-1.5 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800'
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='rounded-md bg-violet-600 px-3 py-1.5 font-medium text-white hover:bg-violet-700'
              >
                Đăng nhập
              </Link>
              <Link
                to='/register'
                className='rounded-md border border-violet-600 px-3 py-1.5 font-medium text-violet-700 hover:bg-violet-50 dark:border-violet-500 dark:text-violet-300 dark:hover:bg-gray-800'
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <p className='text-gray-700 dark:text-gray-300'>
          Đây là giao diện homepage chưa hoàn thiện cho trang web của mình.
        </p>
        {isAuthenticated && user && (
          <pre className='mt-4 overflow-auto rounded-md bg-gray-100 p-4 text-left text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200'>
            {JSON.stringify({ id: user.id, email: user.email, name: user.name }, null, 2)}
          </pre>
        )}
      </section>
    </div>
  )
}
