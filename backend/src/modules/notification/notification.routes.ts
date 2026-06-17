/**
 * Notification Module Routes
 *
 * Định nghĩa API endpoints cho module notification.
 * Tất cả routes đều yêu cầu authentication (authMiddleware).
 *
 * Routes:
 * ┌────────┬──────────────────────────┬───────────────────────────────────┐
 * │ Method │ Path                     │ Description                       │
 * ├────────┼──────────────────────────┼───────────────────────────────────┤
 * │ GET    │ /                        │ Danh sách thông báo (phân trang)  │
 * │ GET    │ /unread-count            │ Số thông báo chưa đọc             │
 * │ PATCH  │ /read-all                │ Đánh dấu tất cả đã đọc           │
 * │ PATCH  │ /:id/read                │ Đánh dấu 1 thông báo đã đọc      │
 * │ DELETE │ /:id                     │ Xóa 1 thông báo                  │
 * └────────┴──────────────────────────┴───────────────────────────────────┘
 *
 * Lưu ý thứ tự routes:
 * - /read-all phải TRƯỚC /:id/read để tránh Express parse "read-all" thành :id
 * - /unread-count phải TRƯỚC /:id để tránh Express parse "unread-count" thành :id
 */

import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";
import { validate } from "../../shared/middleware/validation.middleware";
import { authMiddleware } from "../../shared/middleware";
import {
    notificationQuerySchema,
    notificationIdParamSchema,
} from "./notification.types";

export function createNotificationRouter(): Router {
    const router = Router();

    // Khởi tạo service và controller
    const notificationService = new NotificationService();
    const notificationController = new NotificationController(
        notificationService
    );

    // Tất cả routes đều yêu cầu đăng nhập
    router.use(authMiddleware);

    // ============================================
    // Routes (thứ tự quan trọng!)
    // ============================================

    // GET / — Danh sách thông báo với phân trang + filter
    router.get(
        "/",
        validate({ query: notificationQuerySchema }),
        notificationController.getNotifications
    );

    // GET /unread-count — Số thông báo chưa đọc (đặt TRƯỚC /:id)
    router.get("/unread-count", notificationController.getUnreadCount);

    // PATCH /read-all — Đánh dấu tất cả đã đọc (đặt TRƯỚC /:id/read)
    router.patch("/read-all", notificationController.markAllAsRead);

    // PATCH /:id/read — Đánh dấu 1 thông báo đã đọc
    router.patch(
        "/:id/read",
        validate({ params: notificationIdParamSchema }),
        notificationController.markAsRead
    );

    // DELETE /:id — Xóa 1 thông báo
    router.delete(
        "/:id",
        validate({ params: notificationIdParamSchema }),
        notificationController.deleteNotification
    );

    return router;
}
