/**
 * DTOs aligned with backend Prisma/JSON (Decimal → string).
 */

export type CategoryApi = {
  id: number
  name: string
  slug: string
  createdAt?: string
  updatedAt?: string
}

export type ProductApi = {
  id: number
  name: string
  slug: string
  description: string | null
  /** Serialized decimal, e.g. "129000.00" */
  price: string
  stock: number
  imageUrl: string | null
  isActive?: boolean
  categoryId: number
  category?: CategoryApi
  createdAt?: string
  updatedAt?: string
}

export type ProductQueryParams = {
  page?: number
  limit?: number
  search?: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export type CreateCategoryBody = {
  name: string
  slug: string
}

export type UpdateCategoryBody = Partial<CreateCategoryBody>

export type CreateProductBody = {
  name: string
  slug: string
  description?: string
  price: number
  stock: number
  categoryId: number
  imageUrl?: string
}

export type UpdateProductBody = Partial<CreateProductBody>
