import type { CategorySummary } from './category'

export type ProductSummary = {
  id: number
  name: string
  slug: string
  description: string | null
  price: string
  stock: number
  imageUrl: string | null
  categoryId: number
  category: CategorySummary
  originalPrice?: string | null
  discountPercent?: number | null
  sku?: string | null
  brand?: string | null
  rating?: number | null
}

export type CreateProductPayload = {
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  categoryId: number
  imageUrl?: string
}
