import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { shopProducts } from '~/data/shopCatalog'
import { logout } from '~/features/auth/authSlice'
import { clearCart } from '~/features/cart/cartSlice'
import { clearAuthStorage } from '~/lib/authStorage'
import { formatVndFromDecimal } from '~/lib/formatPrice'

const ink = '#1e293b'

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden>
      <circle cx='11' cy='11' r='7' stroke='currentColor' strokeWidth='2' />
      <path d='M20 20l-4.3-4.3' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  )
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden>
      <path
        d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function IconCart({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden>
      <path
        d='M6 6h15l-1.5 9h-12L4.5 3H2M6 6 4.5 3M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

const navLinkClass =
  'shrink-0 rounded-lg px-1 py-1 text-[13px] font-semibold text-neutral-800/85 transition hover:bg-shop-blue/40 hover:text-neutral-900 sm:text-sm'

export function SiteHeader() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector((s) => s.cart.items.reduce((sum, item) => sum + item.quantity, 0))
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const searchResults = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return []
    return shopProducts.filter((p) => p.name.toLowerCase().includes(keyword) || p.slug.toLowerCase().includes(keyword)).slice(0, 6)
  }, [searchTerm])

  function handleLogout() {
    clearAuthStorage()
    dispatch(logout())
    dispatch(clearCart())
    navigate('/')
  }

  function handlePickProduct(slug: string) {
    setIsSearchOpen(false)
    setSearchTerm('')
    navigate(`/products/${encodeURIComponent(slug)}`)
  }

  return (
    <header className='sticky top-0 z-50 border-b border-shop-ink/8 bg-white font-sans antialiased shadow-sm'>
      <div className='border-b border-shop-ink/6 bg-kid-mint'>
        <div className='mx-auto text-white flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-[11px] text-neutral-700 sm:justify-between sm:px-6 sm:text-xs'>
          <span>Miễn phí vận chuyển đơn từ 500.000 ₫</span>
          <span className='hidden text-white sm:inline'>Hotline: 1900 636 787 · 8:00 – 21:00</span>
        </div>
      </div>

      <div className='mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-3.5'>
        <Link
          to='/'
          className='group flex shrink-0 items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-shop-teal/50 sm:gap-2.5'
        >
          <img src='/mascot/mascot_3.svg' alt='' className='h-9 w-auto sm:h-10' />
          <img src='/logos/logo.png' alt='Kidozone' className='h-8 w-auto sm:h-9' />
        </Link>

        <nav
          className='flex min-w-0 items-center justify-center gap-x-2 overflow-x-auto whitespace-nowrap py-1 sm:gap-x-5 md:gap-x-7'
          aria-label='Điều hướng chính'
        >
          <Link to='/' className={navLinkClass}>
            Trang chủ
          </Link>
          <Link to='/categories' className={navLinkClass}>
            Danh mục
          </Link>
          <Link to='/products' className={navLinkClass}>
            Sản phẩm
          </Link>
          <Link to='/news' className={navLinkClass}>
            Tin tức
          </Link>
          <Link to='/blog/articles' className={navLinkClass}>
            Bài viết
          </Link>
          <Link to='/contact' className={navLinkClass}>
            Liên hệ
          </Link>
        </nav>

        <div className='flex shrink-0 items-center justify-end gap-0.5 sm:gap-1.5'>
          <button
            type='button'
            onClick={() => setIsSearchOpen(true)}
            className='inline-flex h-9 w-9 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-shop-blue/55 hover:text-neutral-900 sm:h-10 sm:w-10'
            aria-label='Tìm kiếm'
          >
            <IconSearch className='h-5 w-5' />
          </button>
          <Link
            to={isAuthenticated ? '/profile' : '/login'}
            className='inline-flex h-9 w-9 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-shop-blue/55 hover:text-neutral-900 sm:h-10 sm:w-10'
            aria-label='Tài khoản'
          >
            <IconUser className='h-5 w-5' />
          </Link>
          <Link
            to='/cart'
            className='relative inline-flex h-9 w-9 items-center justify-center rounded-xl text-neutral-700 transition hover:bg-shop-blue/55 hover:text-neutral-900 sm:h-10 sm:w-10'
            aria-label='Giỏ hàng'
          >
            <IconCart className='h-5 w-5' />
            {cartCount > 0 && (
              <span className='absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-kid-green px-1 text-[11px] font-bold leading-none text-white'>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <button
                type='button'
                onClick={handleLogout}
                className='ml-0.5 hidden min-h-9 items-center justify-center rounded-2xl border-2 border-shop-ink/10 bg-white px-3 py-2 text-xs font-bold shadow-sm transition hover:border-shop-teal/50 hover:bg-slate-100 sm:inline-flex sm:px-3.5 sm:text-sm'
                style={{ color: ink }}
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='ml-0.5 hidden min-h-9 items-center justify-center rounded-2xl bg-kid-green px-3 py-2 text-xs font-bold text-white shadow-sm ring-shop-ink/10 transition hover:brightness-95 sm:inline-flex sm:px-4 sm:text-sm'
              >
                Đăng nhập
              </Link>
              <Link
                to='/register'
                style={{ color: ink }}
                className='hidden min-h-9 items-center justify-center rounded-2xl border-2 border-shop-ink/10 bg-white px-3 py-2 text-xs font-bold shadow-sm transition hover:border-shop-teal/50 hover:bg-slate-100 sm:inline-flex sm:px-3.5 sm:text-sm'
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
      {isSearchOpen && (
        <div
          className='fixed inset-0 z-[70] bg-black/30 px-4 py-16 sm:px-6'
          onClick={() => setIsSearchOpen(false)}
          role='presentation'
        >
          <div
            className='mx-auto w-full max-w-xl rounded-2xl border border-shop-ink/10 bg-white p-4 shadow-xl sm:p-5'
            onClick={(e) => e.stopPropagation()}
            role='dialog'
            aria-modal='true'
            aria-label='Tìm kiếm sản phẩm'
          >
            <div className='flex items-center gap-2'>
              <IconSearch className='h-5 w-5 text-shop-ink/60' />
              <input
                autoFocus
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Tìm sản phẩm theo tên...'
                className='w-full rounded-lg border border-shop-ink/10 px-3 py-2 text-sm text-shop-ink outline-none focus:ring-2 focus:ring-kid-mint'
              />
              <button
                type='button'
                onClick={() => setIsSearchOpen(false)}
                className='rounded-lg px-2 py-1 text-sm font-semibold text-shop-ink/60 transition hover:bg-slate-100 hover:text-shop-ink'
              >
                Đóng
              </button>
            </div>

            <div className='mt-4 max-h-80 overflow-y-auto'>
              {searchTerm.trim().length === 0 ? (
                <p className='text-sm text-shop-ink/60'>Nhập từ khóa để tìm sản phẩm.</p>
              ) : searchResults.length === 0 ? (
                <p className='text-sm text-shop-ink/60'>Không tìm thấy sản phẩm phù hợp.</p>
              ) : (
                <ul className='space-y-2'>
                  {searchResults.map((product) => (
                    <li key={product.id}>
                      <button
                        type='button'
                        onClick={() => handlePickProduct(product.slug)}
                        className='flex w-full items-center gap-3 rounded-xl border border-shop-ink/10 px-3 py-2 text-left transition hover:bg-shop-blue/45'
                      >
                        <img
                          src={product.imageUrl ?? '/products/image1.png'}
                          alt=''
                          className='h-12 w-12 rounded-lg object-cover'
                          aria-hidden
                        />
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-sm font-semibold text-shop-ink'>{product.name}</p>
                          <p className='text-xs text-kid-green'>{formatVndFromDecimal(product.price)}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
