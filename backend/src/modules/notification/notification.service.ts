/**
 * Notification Module Service
 *
 * Core business logic cho thông báo.
 * Service này hoàn toàn isolated, chỉ giao tiếp với Prisma.
 *
 * Các method chính:
 * - getNotifications: Lấy danh sách thông báo (phân trang, filter)
 * - getUnreadCount: Đếm số thông báo chưa đọc
 * - markAsRead: Đánh dấu đã đọc 1 thông báo
 * - markAllAsRead: Đánh dấu tất cả đã đọc
 * - createNotification: Tạo thông báo mới (dùng nội bộ bởi module khác)
 * - deleteNotification: Xóa thông báo (hard delete)
 */

import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { NotFoundError } from "../../shared/types/error";
import {
    NotificationDTO,
    UnreadCountDTO,
    NotificationQuery,
    CreateNotificationInput,
} from "./notification.types";
import { PaginatedResponse } from "../../common/types/pagination";

// ============================================
// Mapper: Prisma model → DTO
// ============================================

/**
 * Chuyển đổi Prisma Notification model sang NotificationDTO.
 * Đảm bảo response shape nhất quán và loại bỏ fields không cần thiết.
 */
function mapToNotificationDTO(notification: any): NotificationDTO {
    return {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        referenceId: notification.referenceId || undefined,
        referenceType: notification.referenceType || undefined,
        isRead: notification.isRead,
        readAt: notification.readAt || undefined,
        createdAt: notification.createdAt,
    };
}

// ============================================
// Service Class
// ============================================

export class NotificationService {
    /**
     * Lấy danh sách thông báo của user với phân trang và filter.
     *
     * @param userId - ID người nhận thông báo
     * @param query  - Query params: page, limit, type, isRead
     * @returns Danh sách thông báo đã phân trang
     *
     * Filter hỗ trợ:
     * - type: Lọc theo NotificationType (VD: chỉ lấy ORDER_STATUS)
     * - isRead: Lọc theo trạng thái đọc (true/false)
     */
    async getNotifications(
        userId: string,
        query: NotificationQuery
    ): Promise<PaginatedResponse<NotificationDTO>> {
        const { page, limit, type, isRead } = query;

        // Build where clause với các filter tùy chọn
        const where: Prisma.NotificationWhereInput = {
            userId,
            ...(type !== undefined && { type }),
            ...(isRead !== undefined && { isRead }),
        };

        // Đếm tổng để tính phân trang
        const total = await prisma.notification.count({ where });

        // Lấy danh sách thông báo, sắp xếp mới nhất lên đầu
        const notifications = await prisma.notification.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            data: notifications.map(mapToNotificationDTO),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Đếm số thông báo chưa đọc của user.
     * Dùng cho badge count trên UI (VD: icon chuông có số đỏ).
     *
     * @param userId - ID người nhận
     * @returns Object chứa count
     */
    async getUnreadCount(userId: string): Promise<UnreadCountDTO> {
        const count = await prisma.notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        return { count };
    }

    /**
     * Đánh dấu 1 thông báo đã đọc.
     * Chỉ user sở hữu thông báo mới có quyền đánh dấu.
     *
     * @param userId         - ID người nhận (dùng để verify ownership)
     * @param notificationId - ID thông báo cần đánh dấu
     * @returns Thông báo đã cập nhật
     * @throws NotFoundError nếu không tìm thấy hoặc không thuộc user
     */
    async markAsRead(
        userId: string,
        notificationId: string
    ): Promise<NotificationDTO> {
        // Tìm thông báo và verify ownership
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId, // Đảm bảo thông báo thuộc về user này
            },
        });

        if (!notification) {
            throw new NotFoundError("Notification not found");
        }

        // Nếu đã đọc rồi, trả về luôn (idempotent)
        if (notification.isRead) {
            return mapToNotificationDTO(notification);
        }

        // Cập nhật trạng thái đọc
        const updated = await prisma.notification.update({
            where: { id: notificationId },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return mapToNotificationDTO(updated);
    }

    /**
     * Đánh dấu tất cả thông báo chưa đọc của user thành đã đọc.
     * Thường dùng khi user click "Mark all as read".
     *
     * @param userId - ID người nhận
     * @returns Số lượng thông báo đã được cập nhật
     */
    async markAllAsRead(userId: string): Promise<{ updatedCount: number }> {
        const result = await prisma.notification.updateMany({
            where: {
                userId,
                isRead: false,
            },
            data: {
                isRead: true,
                readAt: new Date(),
            },
        });

        return { updatedCount: result.count };
    }

    /**
     * Tạo thông báo mới.
     *
     * Đây là method INTERNAL, được gọi bởi các module khác.
     * VD:
     * - Order module gọi khi đơn hàng thay đổi trạng thái
     * - Vendor module gọi khi vendor gửi yêu cầu cho admin
     * - Product module gọi khi vendor tạo sản phẩm mới (thông báo cho follower)
     *
     * @param data - Dữ liệu thông báo cần tạo
     * @returns Thông báo vừa tạo
     */
    async createNotification(
        data: CreateNotificationInput
    ): Promise<NotificationDTO> {
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                title: data.title,
                message: data.message,
                referenceId: data.referenceId,
                referenceType: data.referenceType,
            },
        });

        return mapToNotificationDTO(notification);
    }

    /**
     * Xóa thông báo (hard delete).
     * Chỉ user sở hữu thông báo mới có quyền xóa.
     *
     * @param userId         - ID người nhận (verify ownership)
     * @param notificationId - ID thông báo cần xóa
     * @throws NotFoundError nếu không tìm thấy hoặc không thuộc user
     */
    async deleteNotification(
        userId: string,
        notificationId: string
    ): Promise<void> {
        // Tìm và verify ownership
        const notification = await prisma.notification.findFirst({
            where: {
                id: notificationId,
                userId,
            },
        });

        if (!notification) {
            throw new NotFoundError("Notification not found");
        }

        await prisma.notification.delete({
            where: { id: notificationId },
        });
    }
}
