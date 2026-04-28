import { axiosInstance } from '~/lib/axios'
import type {
  ApiEnvelope,
  CreateProductBody,
  PaginatedApiEnvelope,
  ProductApi,
  ProductQueryParams,
  PaginationMeta,
  UpdateProductBody
} from './types'

/**
 * GET /api/products
 */
export async function getProducts(
  params?: ProductQueryParams
): Promise<{ data: ProductApi[]; pagination: PaginationMeta }> {
  const response = await axiosInstance.get<PaginatedApiEnvelope<ProductApi[]>>('/products', { params })
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  }
}

/**
 * GET /api/products/:id
 */
export async function getProductById(id: string): Promise<ProductApi> {
  const response = await axiosInstance.get<ApiEnvelope<ProductApi>>(`/products/${id}`)
  return response.data.data
}

/**
 * POST /api/products
 */
export async function createProduct(body: CreateProductBody): Promise<ProductApi> {
  const response = await axiosInstance.post<ApiEnvelope<ProductApi>>('/products', body)
  return response.data.data
}

/**
 * PUT /api/products/:id
 */
export async function updateProduct(id: string, body: UpdateProductBody): Promise<ProductApi> {
  const response = await axiosInstance.put<ApiEnvelope<ProductApi>>(`/products/${id}`, body)
  return response.data.data
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(id: string): Promise<void> {
  await axiosInstance.delete(`/products/${id}`)
}
