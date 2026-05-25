import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { addItem } from '~/features/cart/cartSlice'
import { toggleWishlistItem } from '~/features/wishlist/wishlistSlice'
import { formatVndFromDecimal } from '~/lib/formatPrice'
import type { ProductSummary } from '~/types/product'

const CTA_GREEN = '#43A047'
const DETAIL_GREEN = '#43A047'

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)))
  return (
    <div className='flex gap-0.5' aria-label={`Đánh giá ${full} trên 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < full ? 'text-shop-tan' : 'text-shop-ink/15'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  )
}

function CloudDiscountBadge({ discount }: { discount: number }) {
  return (
    <span className='absolute right-2 top-2 z-10 inline-flex h-7 w-12 items-center justify-center text-[9px] font-extrabold text-white drop-shadow-sm sm:right-3 sm:top-3 sm:h-8 sm:w-14 sm:text-[10px]'>
      <img src='/icons/discount-cloud-green.svg' alt='' aria-hidden className='absolute inset-0 h-full w-full' />
      <span className='relative'>-{discount}%</span>
    </span>
  )
}

function HeartIcon({ filled, className }: { filled?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill={filled ? 'currentColor' : 'none'}
      aria-hidden
    >
      <path
        d='M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.64 0-3.065.873-3.84 2.165L12 6.09l-.66-1.125A4.488 4.488 0 0 0 7.5 3.75C5.015 3.75 3 5.765 3 8.25c0 5.942 9 11.25 9 11.25s9-5.308 9-11.25Z'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function inferDiscountPercent(price: string, original: string | null | undefined): number | null {
  if (!original) return null
  const p = Number(price)
  const o = Number(original)
  if (!Number.isFinite(p) || !Number.isFinite(o) || o <= p) return null
  return Math.round((1 - p / o) * 100)
}

type ProductCardProps = {
  product: ProductSummary
  linkTo?: string
}

export function ProductCard({ product, linkTo }: ProductCardProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const isWishlisted = useAppSelector((s) => s.wishlist.productIds.includes(product.id))
  const detailPath = linkTo ?? `/products/${encodeURIComponent(product.slug)}`
  const brand = (product.brand ?? product.category.name).toUpperCase()
  const sku = product.sku ?? `SP-${product.id}`
  const original = product.originalPrice ?? null
  const discount =
    product.discountPercent ?? inferDiscountPercent(product.price, original)
  const ratingVal = product.rating
  const showRating = typeof ratingVal === 'number' && ratingVal > 0
  const showBestSellerBadge = brand === 'BÁN CHẠY' || brand === 'BAN CHAY' || brand === 'BEST SELLER'

  return (
    <article className='flex h-full flex-col overflow-hidden rounded-xl border border-shop-ink/10 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.06)] sm:rounded-2xl'>
      <div className='flex flex-1 flex-col'>
        <Link
          to={detailPath}
          className='group relative flex aspect-square items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-kid-mint focus-visible:ring-offset-2'
        >
          {showBestSellerBadge && (
            <span
              className='absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-shop-ink shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[10px]'
              style={{ backgroundColor: '#E8F5E9' }}
            >
              Bán chạy
            </span>
          )}
          {discount !== null && discount > 0 && <CloudDiscountBadge discount={discount} />}
          <img
            src={product.imageUrl ?? '/products/image1.png'}
            alt={product.name}
            className='h-full w-full rounded-none object-contain p-2 transition duration-300 group-hover:scale-[1.02] sm:rounded-xl sm:p-5'
            loading='lazy'
          />
        </Link>
        <div className='flex flex-1 flex-col px-2 pb-2.5 pt-2 sm:px-5 sm:pb-5 sm:pt-3.5'>
          <div className='flex items-start justify-between gap-1'>
            <div className='flex min-w-0 flex-1 flex-col gap-0.5 text-[9px] text-shop-ink/45 sm:flex-row sm:items-start sm:gap-2 sm:text-[10px]'>
              {!showBestSellerBadge && (
                <span className='truncate font-semibold uppercase sm:min-w-0'>{brand}</span>
              )}
              <span className='truncate font-medium sm:shrink-0 sm:whitespace-nowrap'>
                Mã: {sku}
              </span>
            </div>
            <button
              type='button'
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login')
                  return
                }
                dispatch(toggleWishlistItem(product.id))
              }}
              aria-label={isWishlisted ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'}
              aria-pressed={isWishlisted}
              className={`-mr-0.5 -mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-kid-green transition hover:bg-slate-50 sm:mr-0 sm:mt-0 sm:h-8 sm:w-8 ${
                isWishlisted ? 'bg-kid-green/10' : ''
              }`}
            >
              <HeartIcon filled={isWishlisted} className='h-5 w-5 sm:h-[22px] sm:w-[22px]' />
            </button>
          </div>

          <Link
            to={detailPath}
            className='mt-1.5 line-clamp-2 font-sans text-sm font-extrabold leading-snug text-shop-ink hover:text-shop-teal sm:mt-2.5 sm:text-lg'
          >
            {product.name}
          </Link>

          {showRating && typeof ratingVal === 'number' && (
            <div className='mt-0.5 sm:mt-1'>
              <StarRow rating={ratingVal} />
            </div>
          )}

          <div className='mt-1 flex items-end justify-start gap-2 sm:mt-1.5'>
            <span className='text-sm font-extrabold sm:text-lg' style={{ color: DETAIL_GREEN }}>
              {formatVndFromDecimal(product.price)}
            </span>
          </div>

          {original && (
            <div className='mt-0.5 flex items-center justify-start gap-2 sm:mt-1'>
              <span className='text-[10px] text-shop-ink/55 line-through sm:text-xs'>
                {formatVndFromDecimal(original)}
              </span>
            </div>
          )}

          <div className='mt-auto pt-2 sm:mt-4 sm:pt-0'>
            <button
              type='button'
              onClick={() => {
                if (!isAuthenticated) {
                  navigate('/login')
                  return
                }
                dispatch(
                  addItem({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl ?? '/products/image1.png',
                    unitPrice: product.price,
                    quantity: 1
                  })
                )
              }}
              className='flex min-h-9 w-full items-center justify-center rounded-lg px-1.5 text-[11px] font-bold leading-tight text-white transition hover:brightness-95 active:brightness-90 sm:min-h-11 sm:rounded-xl sm:px-3 sm:text-sm'
              style={{ backgroundColor: CTA_GREEN }}
            >
            Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
