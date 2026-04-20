import { axiosInstance } from '~/lib/axios'
import type {
  CreateProductBody,
  ProductApi,
  ProductQueryParams,
  UpdateProductBody
} from './types'

/**
 * GET /api/products
 */
export async function getProducts(params?: ProductQueryParams): Promise<ProductApi[]> {
  const { data } = await axiosInstance.get<ProductApi[]>('/products', { params })
  return data
}

/**
 * GET /api/products/:id
 */
export async function getProductById(id: number | string): Promise<ProductApi> {
  const { data } = await axiosInstance.get<ProductApi>(`/products/${id}`)
  return data
}

/**
 * POST /api/products
 */
export async function createProduct(body: CreateProductBody): Promise<ProductApi> {
  const { data } = await axiosInstance.post<ProductApi>('/products', body)
  return data
}

/**
 * PUT /api/products/:id
 */
export async function updateProduct(
  id: number | string,
  body: UpdateProductBody
): Promise<ProductApi> {
  const { data } = await axiosInstance.put<ProductApi>(`/products/${id}`, body)
  return data
}

/**
 * DELETE /api/products/:id
 */
export async function deleteProduct(id: number | string): Promise<void> {
  await axiosInstance.delete(`/products/${id}`)
}
