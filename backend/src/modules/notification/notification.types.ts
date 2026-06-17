/**
 * Notification Module Types
 *
 * Định nghĩa schemas validation (Zod) và TypeScript types cho module notification.
 * Bao gồm:
 * - Schema validate cho body, query, params
 * - DTO cho response
 * - Type infer từ Zod schemas
 */

import { z } from "zod";
import { NotificationType } from "@prisma/client";

// ============================================
// Body Schemas
// ============================================

/**
 * Schema tạo thông báo mới.
 * Dùng nội bộ (internal) bởi các module khác khi cần tạo thông báo.
 * VD: Order module tạo thông báo khi đơn hàng thay đổi trạng thái.
 */
export const createNotificationSchema = z.object({
    userId: z.string().uuid("Invalid user ID"),
    type: z.nativeEnum(NotificationType, {
        errorMap: () => ({ message: "Invalid notification type" }),
    }),
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    message: z.string().min(1, "Message is required"),
    referenceId: z.string().uuid("Invalid reference ID").optional(),
    referenceType: z.string().max(50, "Reference type too long").optional(),
});

// ============================================
// Query Schemas
// ============================================

/**
 * Schema cho query params khi lấy danh sách thông báo.
 * Hỗ trợ phân trang + filter theo loại và trạng thái đọc.
 */
export const notificationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    type: z.nativeEnum(NotificationType).optional(),
    isRead: z
        .enum(["true", "false"])
        .optional()
        .transform((val) => (val === undefined ? undefined : val === "true")),
});

// ============================================
// Param Schemas
// ============================================

/**
 * Schema validate notification ID từ URL params.
 */
export const notificationIdParamSchema = z.object({
    id: z.string().uuid("Invalid notification ID"),
});

// ============================================
// TypeScript Types (infer từ Zod schemas)
// ============================================

export type CreateNotificationInput = z.infer<typeof createNotificationSchema>;
export type NotificationQuery = z.infer<typeof notificationQuerySchema>;

// ============================================
// DTO (Data Transfer Object) - Response shape
// ============================================

/**
 * DTO trả về cho client.
 * Đảm bảo shape nhất quán và không expose thông tin nhạy cảm.
 */
export interface NotificationDTO {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    referenceId?: string;
    referenceType?: string;
    isRead: boolean;
    readAt?: Date;
    createdAt: Date;
}

/**
 * DTO cho response đếm thông báo chưa đọc.
 */
export interface UnreadCountDTO {
    count: number;
}
