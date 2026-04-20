import { Link } from 'react-router-dom'
import type { CategorySummary } from '~/types/category'

type ProductSidebarFiltersProps = {
  categories: CategorySummary[]
  activeSlug: string | null
}

export function ProductSidebarFilters({ categories, activeSlug }: ProductSidebarFiltersProps) {
  return (
    <aside className='rounded-[1.25rem] border border-shop-ink/10 bg-white p-4 shadow-shop-soft sm:p-5'>
      <h2 className='font-sans text-lg font-bold text-shop-ink'>Danh mục</h2>
      <p className='mt-1 text-xs text-shop-ink/55'>Lọc sản phẩm theo nhóm</p>
      <nav className='mt-4 flex flex-col gap-1' aria-label='Lọc theo danh mục'>
        <Link
          to='/products'
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
            activeSlug === null
              ? 'bg-shop-teal/25 text-shop-ink'
              : 'text-shop-ink/70 hover:bg-shop-mint/60 hover:text-shop-ink'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            to={`/products?category=${encodeURIComponent(c.slug)}`}
            className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
              activeSlug === c.slug
                ? 'bg-shop-teal/25 text-shop-ink'
                : 'text-shop-ink/70 hover:bg-shop-mint/60 hover:text-shop-ink'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
