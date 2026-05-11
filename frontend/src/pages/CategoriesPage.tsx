import { Link } from 'react-router-dom'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { shopCategories, shopProducts } from '~/data/shopCatalog'

export function CategoriesPage() {
  return (
    <div className='min-h-screen bg-shop-blue font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12'>
        <section className='rounded-2xl bg-white p-6 shadow-sm sm:p-8'>
          <h1 className='text-2xl font-extrabold text-shop-ink sm:text-3xl'>Danh mục sản phẩm</h1>
          <p className='mt-2 text-sm text-shop-ink/65'>
            Chọn danh mục để xem nhanh các sản phẩm phù hợp theo nhu cầu của bé.
          </p>

          <div className='mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {shopCategories.map((category) => {
              const count = shopProducts.filter((p) => p.categoryId === category.id).length
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${encodeURIComponent(category.slug)}`}
                  className='rounded-2xl border border-shop-ink/10 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-shop-teal/45 hover:bg-white hover:shadow-sm'
                >
                  <p className='text-lg font-bold text-shop-ink'>{category.name}</p>
                  <p className='mt-1 text-sm text-shop-ink/60'>{count} sản phẩm</p>
                  <span className='mt-4 inline-flex text-sm font-semibold text-shop-teal'>Xem sản phẩm →</span>
                </Link>
              )
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
