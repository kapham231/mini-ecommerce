import { Link } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'

export function ProfilePage() {
  const user = useAppSelector((s) => s.auth.user)

  return (
    <div className='min-h-screen bg-shop-blue'>
      <SiteHeader />
      <main className='mx-auto max-w-4xl px-4 py-10 sm:px-6'>
        <section className='rounded-2xl bg-white p-6 shadow-sm sm:p-8'>
          <h1 className='text-2xl font-extrabold text-shop-ink sm:text-3xl'>Trang cá nhân</h1>
          <p className='mt-2 text-sm text-shop-ink/65'>Quản lý thông tin tài khoản của bạn.</p>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            <div className='rounded-xl border border-shop-ink/10 bg-slate-50 p-4'>
              <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/45'>Họ tên</p>
              <p className='mt-1 font-semibold text-shop-ink'>{user?.name ?? 'Chưa cập nhật'}</p>
            </div>
            <div className='rounded-xl border border-shop-ink/10 bg-slate-50 p-4'>
              <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/45'>Email</p>
              <p className='mt-1 font-semibold text-shop-ink'>{user?.email ?? 'Chưa có email'}</p>
            </div>
            <div className='rounded-xl border border-shop-ink/10 bg-slate-50 p-4'>
              <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/45'>Vai trò</p>
              <p className='mt-1 font-semibold text-shop-ink'>{user?.role ?? 'USER'}</p>
            </div>
          </div>

          <div className='mt-6'>
            <Link
              to='/products'
              className='inline-flex min-h-10 items-center justify-center rounded-xl bg-kid-green px-5 py-2 text-sm font-bold text-white transition hover:brightness-95'
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
