import type { CategorySummary } from '~/types/category'
import type { ProductSummary } from '~/types/product'
import type { CategoryApi, ProductApi } from './types'

export function categoryApiToSummary(c: CategoryApi): CategorySummary {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug
  }
}

/**
 * Map API product to UI card model. Optional UI fields (rating, discount) stay undefined unless added server-side.
 */
export function productApiToSummary(p: ProductApi): ProductSummary {
  const category: CategorySummary = p.category
    ? categoryApiToSummary(p.category)
    : { id: p.categoryId, name: '', slug: '' }

  const price = typeof p.price === 'string' ? p.price : String(p.price)

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price,
    stock: p.stock,
    imageUrl: p.imageUrl,
    categoryId: p.categoryId,
    category
  }
}
