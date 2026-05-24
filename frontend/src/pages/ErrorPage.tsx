import { useMemo } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'

export type ErrorLocationState = {
  statusCode?: number
  message?: string
}

type ErrorPageProps = {
  defaultStatusCode?: number
}

function getDefaultTitle(statusCode: number): string {
  switch (statusCode) {
    case 404:
      return 'Không tìm thấy trang'
    case 500:
      return 'Lỗi máy chủ'
    default:
      return 'Đã có lỗi xảy ra'
  }
}

function getDefaultDescription(statusCode: number): string {
  switch (statusCode) {
    case 404:
      return 'Đường dẫn không tồn tại hoặc nội dung đã bị gỡ. Hãy quay lại trang chủ hoặc xem sản phẩm.'
    case 500:
      return 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.'
    default:
      return 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại.'
  }
}

export function ErrorPage({ defaultStatusCode = 404 }: ErrorPageProps) {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const state = (location.state as ErrorLocationState | null) ?? {}

  const statusCode = useMemo(() => {
    if (typeof state.statusCode === 'number') return state.statusCode
    const codeFromQuery = Number(searchParams.get('code'))
    if (Number.isFinite(codeFromQuery) && codeFromQuery > 0) return codeFromQuery
    return defaultStatusCode
  }, [state.statusCode, searchParams, defaultStatusCode])

  const title = getDefaultTitle(statusCode)
  const description = state.message ?? getDefaultDescription(statusCode)

  return (
    <div className='min-h-screen bg-shop-blue'>
      <SiteHeader />

      <main className='mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20'>
        <section className='rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12'>
          <img
            src='/mascot/error.svg'
            alt=''
            aria-hidden
            className='mx-auto h-36 w-auto max-w-full object-contain sm:h-44'
          />
          <p className='mt-4 text-5xl font-extrabold text-kid-green sm:text-6xl' aria-hidden>
            {statusCode}
          </p>
          <h1 className='mt-3 text-2xl font-extrabold text-shop-ink sm:text-3xl'>{title}</h1>
          <p className='mx-auto mt-3 max-w-md text-sm text-shop-ink/70 sm:text-base'>{description}</p>
          <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row'>
            <Link
              to='/'
              className='inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-kid-green px-6 text-sm font-bold text-white transition hover:brightness-95 sm:w-auto'
            >
              Về trang chủ
            </Link>
            <Link
              to='/products'
              className='inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-shop-ink/15 bg-white px-6 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 sm:w-auto'
            >
              Xem sản phẩm
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
