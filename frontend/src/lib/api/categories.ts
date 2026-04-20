import { axiosInstance } from '~/lib/axios'
import type { CategoryApi, CreateCategoryBody, UpdateCategoryBody } from './types'

/**
 * GET /api/categories
 */
export async function getCategories(): Promise<CategoryApi[]> {
  const { data } = await axiosInstance.get<CategoryApi[]>('/categories')
  return data
}

/**
 * GET /api/categories/:id
 */
export async function getCategoryById(id: number | string): Promise<CategoryApi> {
  const { data } = await axiosInstance.get<CategoryApi>(`/categories/${id}`)
  return data
}

/**
 * POST /api/categories
 */
export async function createCategory(body: CreateCategoryBody): Promise<CategoryApi> {
  const { data } = await axiosInstance.post<CategoryApi>('/categories', body)
  return data
}

/**
 * PUT /api/categories/:id
 */
export async function updateCategory(
  id: number | string,
  body: UpdateCategoryBody
): Promise<CategoryApi> {
  const { data } = await axiosInstance.put<CategoryApi>(`/categories/${id}`, body)
  return data
}

/**
 * DELETE /api/categories/:id
 */
export async function deleteCategory(id: number | string): Promise<void> {
  await axiosInstance.delete(`/categories/${id}`)
}
