import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'

export function AdminRoute() {
  const location = useLocation()
  const isBootstrapped = useAppSelector((s) => s.auth.isBootstrapped)
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const user = useAppSelector((s) => s.auth.user)

  if (!isBootstrapped) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-shop-blue px-4 text-sm text-shop-ink/60'>
        Đang xác thực quyền truy cập...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}
