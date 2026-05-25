import { axiosInstance } from '~/lib/axios'
import type { ApiEnvelope, CategoryApi, CreateCategoryBody, UpdateCategoryBody } from './types'

/**
 * GET /api/categories
 */
export async function getCategories(): Promise<CategoryApi[]> {
  const response = await axiosInstance.get<ApiEnvelope<CategoryApi[]>>('/categories')
  return response.data.data
}

/**
 * GET /api/categories/:id
 */
export async function getCategoryById(id: string): Promise<CategoryApi> {
  const response = await axiosInstance.get<ApiEnvelope<CategoryApi>>(`/categories/${id}`)
  return response.data.data
}

/**
 * POST /api/categories
 */
export async function createCategory(body: CreateCategoryBody): Promise<CategoryApi> {
  const response = await axiosInstance.post<ApiEnvelope<CategoryApi>>('/categories', body)
  return response.data.data
}

/**
 * PUT /api/categories/:id
 */
export async function updateCategory(id: string, body: UpdateCategoryBody): Promise<CategoryApi> {
  const response = await axiosInstance.put<ApiEnvelope<CategoryApi>>(`/categories/${id}`, body)
  return response.data.data
}

/**
 * DELETE /api/categories/:id
 */
export async function deleteCategory(id: string): Promise<void> {
  await axiosInstance.delete(`/categories/${id}`)
}
