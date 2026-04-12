import { Link } from 'react-router-dom'

export function SiteFooter() {
  return (
    <footer id='site-footer' className='border-t border-shop-ink/10 bg-white'>
      <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-5'>
          <div className='lg:col-span-2'>
            <p className='font-sans text-2xl font-extrabold text-shop-ink'>Kidozone</p>
            <p className='mt-2 max-w-sm text-sm leading-relaxed text-shop-ink/65'>
              Thú bông và đồ chơi an toàn — màu pastel dịu mắt, giao diện mua sắm đơn giản cho cả gia đình.
            </p>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/45'>Cửa hàng</p>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <Link to='/' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to='/#categories' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Danh mục
                </Link>
              </li>
              <li>
                <Link to='/products' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Sản phẩm
                </Link>
              </li>
              <li>
                <a href='#featured' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Nổi bật
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/45'>Hỗ trợ</p>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <a href='#site-footer' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href='#site-footer' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Đổi trả
                </a>
              </li>
              <li>
                <a href='#site-footer' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Theo dõi đơn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/45'>Tài khoản</p>
            <ul className='mt-3 space-y-2 text-sm'>
              <li>
                <Link to='/login' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link to='/register' className='text-shop-ink/65 transition hover:text-shop-ink'>
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className='mt-12 flex flex-col items-center justify-between gap-4 border-t border-shop-ink/10 pt-8 sm:flex-row'>
          <div className='flex items-center gap-2'>
            <img src='/mascot/mascot_3.svg' alt='' className='h-8 w-auto opacity-90' />
            <span className='font-sans text-lg font-bold text-shop-ink'>Kidozone</span>
          </div>
          <p className='text-center text-sm text-shop-ink/50 sm:text-right'>
            © {new Date().getFullYear()} Kidozone. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  )
}
