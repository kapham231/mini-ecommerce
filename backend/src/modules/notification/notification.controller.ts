/**
 * Notification Module Controller
 *
 * Xử lý HTTP request và delegate sang NotificationService.
 * Controller KHÔNG chứa business logic hay database query trực tiếp.
 *
 * Endpoints:
 * - GET    /                → getNotifications  (danh sách + phân trang)
 * - GET    /unread-count    → getUnreadCount    (badge count)
 * - PATCH  /:id/read        → markAsRead        (đánh dấu 1 cái đã đọc)
 * - PATCH  /read-all        → markAllAsRead     (đánh dấu tất cả đã đọc)
 * - DELETE /:id             → deleteNotification (xóa thông báo)
 */

import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { NotificationQuery } from "./notification.types";

export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    /**
     * GET /notifications
     * Lấy danh sách thông báo của user hiện tại.
     * Hỗ trợ phân trang và filter theo type, isRead.
     */
    getNotifications = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const query = req.query as unknown as NotificationQuery;
        const result = await this.notificationService.getNotifications(
            userId,
            query
        );

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    });

    /**
     * GET /notifications/unread-count
     * Lấy số lượng thông báo chưa đọc.
     * Dùng cho badge count trên UI (icon chuông).
     */
    getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await this.notificationService.getUnreadCount(userId);

        res.status(200).json({
            success: true,
            data: result,
        });
    });

    /**
     * PATCH /notifications/:id/read
     * Đánh dấu 1 thông báo đã đọc.
     * Idempotent: gọi nhiều lần không ảnh hưởng.
     */
    markAsRead = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = req.params as { id: string };
        const notification = await this.notificationService.markAsRead(
            userId,
            id
        );

        res.status(200).json({
            success: true,
            data: notification,
        });
    });

    /**
     * PATCH /notifications/read-all
     * Đánh dấu tất cả thông báo chưa đọc thành đã đọc.
     */
    markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const result = await this.notificationService.markAllAsRead(userId);

        res.status(200).json({
            success: true,
            data: result,
        });
    });

    /**
     * DELETE /notifications/:id
     * Xóa 1 thông báo (hard delete).
     * Chỉ user sở hữu mới có quyền xóa.
     */
    deleteNotification = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = req.params as { id: string };
        await this.notificationService.deleteNotification(userId, id);

        res.status(200).json({
            success: true,
            message: "Notification deleted",
        });
    });
}
