import { axiosInstance } from '~/lib/axios'
import type {
  ApiEnvelope,
  NotificationApi,
  NotificationQueryParams,
  PaginatedApiEnvelope,
  PaginationMeta,
} from './types'

/**
 * GET /api/notifications
 */
export async function getNotifications(
  params?: NotificationQueryParams
): Promise<{ data: NotificationApi[]; pagination: PaginationMeta }> {
  const response = await axiosInstance.get<PaginatedApiEnvelope<NotificationApi[]>>('/notifications', {
    params: {
      ...params,
      ...(params?.isRead !== undefined ? { isRead: String(params.isRead) } : {}),
    },
  })

  return {
    data: response.data.data,
    pagination: response.data.pagination,
  }
}

/**
 * GET /api/notifications/unread-count
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const response = await axiosInstance.get<ApiEnvelope<{ count: number }>>('/notifications/unread-count')
  return response.data.data.count
}

/**
 * PATCH /api/notifications/:id/read
 */
export async function markNotificationRead(id: string): Promise<NotificationApi> {
  const response = await axiosInstance.patch<ApiEnvelope<NotificationApi>>(`/notifications/${id}/read`)
  return response.data.data
}

/**
 * PATCH /api/notifications/read-all
 */
export async function markAllNotificationsRead(): Promise<{ updatedCount: number }> {
  const response = await axiosInstance.patch<ApiEnvelope<{ updatedCount: number }>>('/notifications/read-all')
  return response.data.data
}

/**
 * DELETE /api/notifications/:id
 */
export async function deleteNotification(id: string): Promise<void> {
  await axiosInstance.delete(`/notifications/${id}`)
}
