import { Link } from 'react-router-dom'

export function SiteFooter() {
  const linkColumns = [
    {
      title: 'Về Kidozone',
      links: [
        { label: 'Câu chuyện thương hiệu', href: '#site-footer' },
        { label: 'Điều khoản sử dụng', href: '#site-footer' },
        { label: 'Chính sách bảo mật', href: '#site-footer' }
      ],
    },
    {
      title: 'Tài khoản',
      links: [
        { label: 'Đăng nhập', to: '/login' },
        { label: 'Đăng ký', to: '/register' },
        { label: 'Theo dõi đơn hàng', to: '/cart' },
        { label: 'Danh sách yêu thích', href: '#site-footer' },
      ],
    },
    {
      title: 'Khám phá',
      links: [
        { label: 'Tin tức', to: '/news' },
        { label: 'Bài viết', to: '/blog/articles' },
        { label: 'Sản phẩm', to: '/products' },
      ],
    },
    {
      title: 'Hỗ trợ',
      links: [
        { label: 'Tư vấn chọn quà', to: '/contact' },
        { label: 'Trung tâm trợ giúp', to: '/help-center' },
        { label: 'Vận chuyển', to: '/shipping' },
        { label: 'Đổi trả', to: '/returns' },
        { label: 'Liên hệ', to: '/contact' },
      ],
    },
  ]
  const socials = [
    { label: 'Facebook', href: '#site-footer', icon: '/icons/icons8-facebook-100.svg' },
    { label: 'Messenger', href: '#site-footer', icon: '/icons/icons8-facebook-messenger-100.svg' },
    { label: 'Instagram', href: '#site-footer', icon: '/icons/icons8-instagram-100.svg' },
    { label: 'TikTok', href: '#site-footer', icon: '/icons/icons8-tiktok-100.svg' },
    { label: 'X', href: '#site-footer', icon: '/icons/icons8-x-100.svg' },
    { label: 'YouTube', href: '#site-footer', icon: '/icons/icons8-youtube-100.svg' },
  ]

  return (
    <footer id='site-footer' className='border-t border-white/25 bg-kid-green text-white'>
      <div className='relative mx-auto max-w-6xl px-4 pb-6 pt-10 sm:px-6 sm:pt-12'>
        <img
          src='/mascot/mascot_outline.png'
          alt=''
          aria-hidden
          className='pointer-events-none absolute right-24 top-2 hidden h-64 w-auto object-contain opacity-95 lg:block'
        />

        <div className='grid gap-10 border-b border-white/30 pb-8 lg:grid-cols-[1fr_320px]'>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
            {linkColumns.map((column) => (
              <div
                key={column.title}
                className={column.title === 'Hỗ trợ' ? 'relative min-h-[11rem] pr-32 lg:min-h-0 lg:pr-0' : undefined}
              >
                <h3 className='text-xl font-extrabold leading-tight text-white'>{column.title}</h3>
                <ul className='mt-3 space-y-1.5'>
                  {column.links.map((item) => (
                    <li key={item.label}>
                      {item.to ? (
                        <Link to={item.to} className='text-sm text-white/90 transition hover:text-white'>
                          {item.label}
                        </Link>
                      ) : (
                        <a href={item.href ?? '#site-footer'} className='text-sm text-white/90 transition hover:text-white'>
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                {column.title === 'Hỗ trợ' ? (
                  <img
                    src='/mascot/mascot_outline.png'
                    alt=''
                    aria-hidden
                    className='pointer-events-none absolute -right-2 bottom-0 h-52 w-auto object-contain opacity-95 lg:hidden'
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className='pt-7'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
            <img src='/logos/logo_outline.png' alt='Kidozone' className='h-12 w-auto object-contain' />
            <div className='flex items-center gap-2 lg:gap-3'>
              <span className='text-lg font-extrabold tracking-tight text-white lg:text-3xl'>@kidozone</span>
              <div className='flex items-center gap-2 lg:gap-3'>
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white transition hover:brightness-95'
                    aria-label={item.label}
                  >
                    <img src={item.icon} alt='' className='h-5 w-5 object-contain' aria-hidden />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <p className='mt-5 border-t border-white/30 pt-4 text-center text-sm text-white/90'>
            © {new Date().getFullYear()} Kidozone. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  )
}
