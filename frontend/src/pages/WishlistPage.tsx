import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'
import { ProductCard } from '~/components/products/ProductCard'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { resolveProductsByIds } from '~/lib/productLookup'

export function WishlistPage() {
  const productIds = useAppSelector((s) => s.wishlist.productIds)

  const products = useMemo(() => resolveProductsByIds(productIds), [productIds])

  return (
    <div className='min-h-screen bg-shop-blue'>
      <SiteHeader />

      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6'>
        <div className='mb-7 flex items-end justify-between gap-3'>
          <div>
            <h1 className='text-2xl font-extrabold text-shop-ink sm:text-3xl'>Danh sách yêu thích</h1>
            <p className='mt-1 text-sm text-shop-ink/65'>{products.length} sản phẩm đã lưu</p>
          </div>
          <Link to='/products' className='text-sm font-semibold text-kid-green hover:underline'>
            + Khám phá thêm
          </Link>
        </div>

        {products.length === 0 ? (
          <section className='rounded-2xl bg-white p-8 text-center shadow-sm'>
            <h2 className='text-xl font-bold text-shop-ink'>Chưa có sản phẩm yêu thích</h2>
            <p className='mt-2 text-sm text-shop-ink/65'>
              Bấm biểu tượng trái tim trên sản phẩm để lưu vào danh sách này.
            </p>
            <Link
              to='/products'
              className='mt-5 inline-flex rounded-xl bg-kid-green px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-95'
            >
              Xem sản phẩm
            </Link>
          </section>
        ) : (
          <div className='grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4'>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
