import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '~/app/hooks'
import { getShopProductBySlug, shopProducts } from '~/data/shopCatalog'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { addItem } from '~/features/cart/cartSlice'
import { formatVndFromDecimal } from '~/lib/formatPrice'
import { ProductCard } from '~/components/products/ProductCard'

function calcDiscount(price: string, original?: string | null): number | null {
  if (!original) return null
  const p = Number(price)
  const o = Number(original)
  if (!Number.isFinite(p) || !Number.isFinite(o) || o <= p) return null
  return Math.round((1 - p / o) * 100)
}

export function ProductDetailPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const { slug } = useParams<{ slug: string }>()
  const product = useMemo(() => (slug ? getShopProductBySlug(slug) : undefined), [slug])
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  const galleryImages = useMemo(() => {
    if (!product) return []
    const fallback = '/products/image1.png'
    const imagePool = [
      product.imageUrl ?? fallback,
      '/products/image8.png',
      '/products/image9.png',
      '/products/image10.png',
    ]
    return imagePool
  }, [product])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return shopProducts.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
  }, [product])

  const discount = product?.discountPercent ?? calcDiscount(product?.price ?? '', product?.originalPrice)

  return (
    <div className='min-h-screen bg-shop-blue font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10'>
        <nav className='text-sm text-shop-ink/60'>
          <Link to='/products' className='font-semibold text-shop-teal hover:underline'>
            ← Sản phẩm
          </Link>
          {product && (
            <>
              <span className='mx-2'>/</span>
              <span className='text-shop-ink/80'>{product.name}</span>
            </>
          )}
        </nav>

        {!slug && (
          <p className='mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800' role='alert'>
            Thiếu mã sản phẩm trong URL.
          </p>
        )}

        {slug && !product && (
          <p className='mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900' role='alert'>
            Không có sản phẩm mẫu cho slug này.
          </p>
        )}

        {product && (
          <>
            <div className='mt-8 grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-start'>
              <div>
                <div className='overflow-hidden rounded-[1.5rem] border border-shop-ink/8 bg-white shadow-shop-soft'>
                  <div className='relative flex aspect-square items-center justify-center'>
                    {discount && discount > 0 && (
                      <span className='absolute h-14 w-14 flex items-center justify-center text-center text-base font-extrabold text-white left-4 top-4 rounded-full bg-kid-green'>
                        -{discount}%
                      </span>
                    )}
                    <img
                      src={galleryImages[activeImage]}
                      alt={product.name}
                      className='h-full w-full object-contain p-8'
                    />
                  </div>
                </div>
                <div className='mt-4 grid grid-cols-4 gap-3'>
                  {galleryImages.map((img, idx) => (
                    <button
                      key={`${img}-${idx}`}
                      type='button'
                      onClick={() => setActiveImage(idx)}
                      className={`overflow-hidden rounded-xl border bg-white p-1.5 transition ${
                        activeImage === idx
                          ? 'border-kid-green ring-2 ring-kid-mint'
                          : 'border-shop-ink/10 hover:border-shop-teal/45'
                      }`}
                      aria-label={`Xem ảnh ${idx + 1}`}
                    >
                      <img src={img} alt='' aria-hidden className='h-20 w-full object-contain' />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className='flex flex-wrap items-center gap-2'>
                  <p className='rounded-full bg-kid-mint-soft px-3 py-1 text-xs font-bold text-shop-deep'>
                    {product.category.name}
                  </p>
                  <p className='rounded-full border border-shop-ink/10 bg-white px-3 py-1 text-xs font-semibold text-shop-ink/70'>
                    SKU: {product.sku ?? `SP-${product.id}`}
                  </p>
                  {product.brand && (
                    <p className='rounded-full border border-shop-ink/10 bg-white px-3 py-1 text-xs font-semibold text-shop-ink/70'>
                      {product.brand}
                    </p>
                  )}
                </div>

                <h1 className='mt-3 font-sans text-3xl font-extrabold leading-tight text-shop-ink sm:text-4xl'>
                  {product.name}
                </h1>

                <div className='mt-4 flex items-end gap-3'>
                  <p className='text-3xl font-extrabold text-kid-green'>{formatVndFromDecimal(product.price)}</p>
                  {product.originalPrice && (
                    <p className='pb-1 text-base text-shop-ink/45 line-through'>
                      {formatVndFromDecimal(product.originalPrice)}
                    </p>
                  )}
                </div>

                <p className='mt-2 text-sm text-shop-ink/55'>
                  Còn <span className='font-semibold text-shop-ink'>{product.stock}</span> sản phẩm (mẫu)
                </p>

                {product.description && (
                  <div className='mt-6 rounded-2xl border border-shop-ink/8 bg-white/85 p-5'>
                    <h2 className='text-sm font-bold uppercase tracking-wide text-shop-ink/50'>Mô tả</h2>
                    <p className='mt-2 text-sm leading-relaxed text-shop-ink/80'>{product.description}</p>
                  </div>
                )}

                <div className='mt-5 rounded-2xl border border-shop-ink/8 bg-white p-4'>
                  <p className='text-xs font-bold uppercase tracking-wide text-shop-ink/50'>Số lượng</p>
                  <div className='mt-2 inline-flex items-center rounded-xl border border-shop-ink/10 bg-shop-blue'>
                    <button
                      type='button'
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className='h-10 w-10 text-lg font-bold text-shop-ink/80 transition hover:bg-white'
                      aria-label='Giảm số lượng'
                    >
                      -
                    </button>
                    <span className='inline-flex h-10 min-w-12 items-center justify-center text-sm font-bold text-shop-ink'>
                      {quantity}
                    </span>
                    <button
                      type='button'
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className='h-10 w-10 text-lg font-bold text-shop-ink/80 transition hover:bg-white'
                      aria-label='Tăng số lượng'
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                  <div className='rounded-xl border border-shop-ink/10 bg-white p-3'>
                    <p className='text-xs font-bold uppercase text-shop-ink/45'>Giao nhanh</p>
                    <p className='mt-1 text-sm text-shop-ink/80'>Nội thành 2h, tỉnh thành 2-4 ngày.</p>
                  </div>
                  <div className='rounded-xl border border-shop-ink/10 bg-white p-3'>
                    <p className='text-xs font-bold uppercase text-shop-ink/45'>Đổi trả</p>
                    <p className='mt-1 text-sm text-shop-ink/80'>Hỗ trợ 7 ngày nếu lỗi từ nhà sản xuất.</p>
                  </div>
                </div>

                <div className='mt-8 flex flex-wrap gap-3'>
                  <button
                    type='button'
                    onClick={() => {
                      if (!product) return
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
                          quantity
                        })
                      )
                    }}
                    className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-8 text-sm font-bold text-white shadow-md transition hover:brightness-95'
                  >
                    Thêm {quantity} vào giỏ
                  </button>
                  <Link
                    to='/products'
                    className='inline-flex min-h-11 items-center justify-center rounded-2xl border-2 border-shop-ink/15 bg-white px-6 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40'
                  >
                    Tiếp tục mua
                  </Link>
                </div>
              </div>
            </div>
            {relatedProducts.length > 0 && (
              <section className='mt-14'>
                <div className='mb-5 flex items-end justify-between gap-3'>
                  <div>
                    <p className='text-xs font-bold uppercase tracking-[0.16em] text-shop-ink/45'>Gợi ý thêm</p>
                    <h2 className='mt-1 text-2xl font-extrabold text-shop-ink'>Có thể bé sẽ thích</h2>
                  </div>
                  <Link to='/products' className='text-sm font-semibold text-shop-teal hover:underline'>
                    Xem tất cả
                  </Link>
                </div>
                <div className='grid grid-cols-2 gap-3 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4'>
                  {relatedProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
