import { Link } from 'react-router-dom'
import { useAppDispatch } from '~/app/hooks'
import { addItem } from '~/features/cart/cartSlice'
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
    <span className='absolute right-3 top-3 z-10 inline-flex h-8 w-14 items-center justify-center text-[10px] font-extrabold text-white drop-shadow-sm'>
      <img src='/icons/discount-cloud-green.svg' alt='' aria-hidden className='absolute inset-0 h-full w-full' />
      <span className='relative'>-{discount}%</span>
    </span>
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
    <article className='flex h-full flex-col overflow-hidden rounded-2xl border border-shop-ink/10 bg-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(0,0,0,0.06)]'>
      <div className='flex flex-1 flex-col'>
        <Link
          to={detailPath}
          className='group relative flex aspect-square items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-kid-mint focus-visible:ring-offset-2'
        >
          {showBestSellerBadge && (
            <span
              className='absolute text-[#2E7D32] left-3 top-3 z-10 rounded-full bg-shop-tan px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-shop-ink shadow-sm'
              style={{ backgroundColor: '#E8F5E9' }}
            >
              Bán chạy
            </span>
          )}
          {discount !== null && discount > 0 && <CloudDiscountBadge discount={discount} />}
          <img
            src={product.imageUrl ?? '/products/image1.png'}
            alt={product.name}
            className='h-full w-full rounded-xl object-contain p-5 transition duration-300 group-hover:scale-[1.02]'
            loading='lazy'
          />
        </Link>
        <div className='flex flex-1 flex-col px-5 pb-5 pt-3.5'>
          <div className='flex items-start justify-between gap-2 text-[10px] text-shop-ink/45'>
            {!showBestSellerBadge && <span className='truncate font-semibold uppercase'>{brand}</span>}
            <span className='shrink-0 whitespace-nowrap'>Mã: {sku}</span>
          </div>

          <Link
            to={detailPath}
            className='mt-2.5 font-sans text-lg font-extrabold leading-snug text-shop-ink line-clamp-2 hover:text-shop-teal'
          >
            {product.name}
          </Link>

          {showRating && typeof ratingVal === 'number' && (
            <div className='mt-1'>
              <StarRow rating={ratingVal} />
            </div>
          )}

          <div className='mt-1.5 flex items-end justify-start gap-2'>
            <span className='text-lg font-extrabold' style={{ color: DETAIL_GREEN }}>
              {formatVndFromDecimal(product.price)}
            </span>
          </div>

          {original && (
            <div className='mt-1 flex items-center justify-start gap-2'>
              <span className='text-xs text-shop-ink/55 line-through'>
                {formatVndFromDecimal(original)}
              </span>
            </div>
          )}

          <div className='mt-4 flex items-stretch gap-2'>
            <button
              type='button'
              onClick={() =>
                dispatch(
                  addItem({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl ?? '/products/image1.png',
                    unitPrice: product.price,
                    quantity: 1
                  })
                )
              }
              className='min-h-11 flex-1 rounded-xl px-3 text-sm font-bold text-white transition hover:brightness-95 active:brightness-90'
              style={{ backgroundColor: CTA_GREEN }}
            >
              Thêm vào giỏ hàng
            </button>
            <button
              type='button'
              aria-label='Yêu thích'
              className='flex w-11 shrink-0 items-center justify-end rounded-xl transition hover:bg-slate-50'
            >
              <img src='/icons/heart-outline-green.svg' alt='' aria-hidden className='h-[30px] w-auto' />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
