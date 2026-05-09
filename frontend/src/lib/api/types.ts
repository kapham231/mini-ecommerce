/**
 * DTOs aligned with backend Prisma/JSON (Decimal → string).
 */

export type ApiEnvelope<T> = {
  success: boolean
  data: T
  message?: string
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  pages: number
}

export type PaginatedApiEnvelope<T> = ApiEnvelope<T> & {
  pagination: PaginationMeta
}

export type CategoryApi = {
  id: string
  name: string
  slug: string
  description?: string | null
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export type ProductApi = {
  id: string
  name: string
  slug: string
  description: string | null
  /** Backend currently returns number after Decimal mapping. */
  price: number
  stock: number
  imageUrl?: string | null
  isActive?: boolean
  categoryId: string
  category?: CategoryApi
  createdAt?: string
  updatedAt?: string
}

export type ProductQueryParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export type CreateCategoryBody = {
  name: string
  description?: string
}

export type UpdateCategoryBody = Partial<CreateCategoryBody>

export type CreateProductBody = {
  name: string
  description?: string
  price: number
  stock: number
  categoryId: string
  imageUrl?: string
}

export type UpdateProductBody = Partial<CreateProductBody>
