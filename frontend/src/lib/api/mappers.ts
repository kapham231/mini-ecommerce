import type { CategorySummary } from '~/types/category'
import type { ProductSummary } from '~/types/product'
import type { CategoryApi, ProductApi } from './types'

function parseNumericId(id: string, fieldName: string): number {
  const parsed = Number(id)
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid ${fieldName}: ${id}`)
  }
  return parsed
}

export function categoryApiToSummary(c: CategoryApi): CategorySummary {
  return {
    id: parseNumericId(c.id, 'category.id'),
    name: c.name,
    slug: c.slug
  }
}

/**
 * Map API product to UI card model. Optional UI fields (rating, discount) stay undefined unless added server-side.
 */
export function productApiToSummary(p: ProductApi): ProductSummary {
  const productId = parseNumericId(p.id, 'product.id')
  const categoryId = parseNumericId(p.categoryId, 'product.categoryId')
  const category: CategorySummary = p.category
    ? categoryApiToSummary(p.category)
    : { id: categoryId, name: '', slug: '' }

  const price = typeof p.price === 'string' ? p.price : String(p.price)

  return {
    id: productId,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price,
    stock: p.stock,
    imageUrl: p.imageUrl ?? null,
    categoryId,
    category
  }
}
