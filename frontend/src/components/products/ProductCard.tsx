import { Link } from 'react-router-dom'
import { formatVndFromDecimal } from '~/lib/formatPrice'
import type { ProductSummary } from '~/types/product'

const ACCENT = '#A8DF8E'

function HeartOutlineIcon({ className }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className ?? ''}`}
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden
    >
      <path
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M21 8.25c0-2.485-2.015-4.5-4.5-4.5-1.64 0-3.065.873-3.84 2.165L12 6.09l-.66-1.125A4.488 4.488 0 0 0 7.5 3.75C5.015 3.75 3 5.765 3 8.25c0 5.942 9 11.25 9 11.25s9-5.308 9-11.25Z'
      />
    </svg>
  )
}

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(Math.min(5, Math.max(0, rating)))
  return (
    <div className='flex gap-0.5' aria-label={`Đánh giá ${full} trên 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < full ? 'text-amber-400' : 'text-shop-ink/15'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
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
  const detailPath = linkTo ?? `/products/${encodeURIComponent(product.slug)}`
  const brand = (product.brand ?? product.category.name).toUpperCase()
  const sku = product.sku ?? `SP-${product.id}`
  const original = product.originalPrice ?? null
  const discount =
    product.discountPercent ?? inferDiscountPercent(product.price, original)
  const ratingVal = product.rating
  const showRating = typeof ratingVal === 'number' && ratingVal > 0

  return (
    <article className='flex h-full flex-col overflow-hidden rounded-2xl border border-shop-ink/10 bg-white shadow-shop-soft transition hover:-translate-y-0.5 hover:shadow-lg'>
      <div className='flex flex-1 flex-col'>
        <Link
          to={detailPath}
          className='group relative flex aspect-square items-center justify-center bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-kid-mint focus-visible:ring-offset-2'
        >
          {discount !== null && discount > 0 && (
            <span
              className='absolute right-3 top-3 z-10 rounded-lg px-2 py-1 text-[11px] font-extrabold text-shop-ink shadow-sm'
              style={{ backgroundColor: ACCENT }}
            >
              -{discount}%
            </span>
          )}
          <img
            src={product.imageUrl ?? '/products/image1.png'}
            alt={product.name}
            className='h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.02]'
            loading='lazy'
          />
        </Link>
        <div className='flex flex-1 flex-col px-4 pb-4 pt-3'>
          <div className='flex items-start justify-between gap-2 text-[11px] text-shop-ink/45'>
            <span className='truncate font-semibold uppercase'>{brand}</span>
            <span className='shrink-0 whitespace-nowrap'>Mã: {sku}</span>
          </div>

          <Link
            to={detailPath}
            className='mt-2 font-sans text-[15px] font-semibold leading-snug text-shop-ink line-clamp-2 hover:text-shop-teal'
          >
            {product.name}
          </Link>

          {showRating && typeof ratingVal === 'number' && (
            <div className='mt-2'>
              <StarRow rating={ratingVal} />
            </div>
          )}

          <div className='mt-3 flex items-end justify-between gap-2'>
            <span className='text-base font-extrabold text-[#7ACD53]'>
              {formatVndFromDecimal(product.price)}
            </span>
            {original && (
              <span className='text-sm text-shop-ink/35 line-through'>
                {formatVndFromDecimal(original)}
              </span>
            )}
          </div>

          <div className='mt-4 flex items-stretch gap-2'>
            <button
              type='button'
              className='min-h-11 flex-1 rounded-xl px-3 text-sm font-bold text-shop-ink transition hover:brightness-95 active:brightness-90'
              style={{ backgroundColor: ACCENT }}
            >
              Thêm vào giỏ hàng
            </button>
            <button
              type='button'
              aria-label='Yêu thích'
              className='flex w-11 shrink-0 items-center justify-center rounded-xl border-2 bg-white text-shop-ink transition hover:bg-slate-50'
              style={{ borderColor: ACCENT, color: ACCENT }}
            >
              <HeartOutlineIcon className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
