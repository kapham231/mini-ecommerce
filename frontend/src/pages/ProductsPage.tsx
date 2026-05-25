import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterShopProducts, shopCategories } from '~/data/shopCatalog'
import { ProductCard } from '~/components/products/ProductCard'
import { ProductSidebarFilters } from '~/components/products/ProductSidebarFilters'
import { SectionHeading } from '~/components/home/SectionHeading'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'

export function ProductsPage() {
  const [searchParams] = useSearchParams()
  const categorySlug = useMemo(() => {
    const raw = searchParams.get('category')
    return raw && raw.length > 0 ? raw : null
  }, [searchParams])

  const products = useMemo(() => filterShopProducts(categorySlug), [categorySlug])

  return (
    <div className='min-h-screen bg-gradient-to-b from-kid-mint-soft via-shop-blue to-shop-blue/70 font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12'>
        <SectionHeading
          theme='shop'
          eyebrow='Cửa hàng'
          title='Danh sách sản phẩm'
          description='Chọn danh mục ở cột bên trái để lọc — dữ liệu mẫu chỉ để xem giao diện.'
          tone='mint'
        />

        <div className='mt-10 grid gap-8 lg:grid-cols-[minmax(200px,240px)_1fr] lg:items-start'>
          <ProductSidebarFilters categories={shopCategories} activeSlug={categorySlug} />
          <div>
            {products.length === 0 ? (
              <p className='rounded-xl border border-shop-ink/10 bg-white px-4 py-8 text-center text-sm text-shop-ink/65'>
                Không có sản phẩm trong danh mục này.
              </p>
            ) : (
              <div className='grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3'>
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
