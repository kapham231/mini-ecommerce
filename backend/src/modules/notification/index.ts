/**
 * Notification Module
 *
 * Exports tất cả notification-related functionality.
 * Import từ đây thay vì import trực tiếp từ file con.
 *
 * Usage:
 *   import { NotificationService, createNotificationRouter } from "./modules/notification";
 */

export { NotificationService } from "./notification.service";
export { NotificationController } from "./notification.controller";
export { createNotificationRouter } from "./notification.routes";
export type * from "./notification.types";
