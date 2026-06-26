/**
 * Notification Module Integration with Socket.IO
 *
 * This file demonstrates how to integrate the RealTimeNotificationService
 * with the existing NotificationService and NotificationController.
 *
 * To use this integration:
 * 1. Import getRealTimeNotificationService from websocket module
 * 2. Call the methods when creating notifications
 *
 * Example usage in modules:
 *
 * // In order.service.ts or any other module
 * import { getRealTimeNotificationService } from "../../shared/websocket";
 * import { NotificationType } from "@prisma/client";
 *
 * // When order status changes
 * const realtimeService = getRealTimeNotificationService();
 * await realtimeService.notifyUser({
 *     userId: order.userId,
 *     type: NotificationType.ORDER_STATUS,
 *     title: "Order Status Updated",
 *     message: `Your order #${order.id} has been ${order.status}`,
 *     referenceId: order.id,
 *     referenceType: "ORDER",
 * });
 *
 * // Notify admins about vendor requests
 * await realtimeService.notifyAdmins({
 *     type: NotificationType.VENDOR_REQUEST,
 *     title: "New Vendor Request",
 *     message: `Vendor ${vendor.name} sent a new request`,
 *     referenceId: vendor.id,
 *     referenceType: "VENDOR",
 *     vendorId: vendor.id,
 * });
 */

// Usage in any module service:
/*
import { getRealTimeNotificationService } from "../../shared/websocket";
import { NotificationType } from "@prisma/client";

export class SomeService {
    async doSomethingAndNotify() {
        // Do something...
        
        // Send notification to user
        const realtimeService = getRealTimeNotificationService();
        await realtimeService.notifyUser({
            userId: "user-id",
            type: NotificationType.NEW_PRODUCT,
            title: "New Product Available",
            message: "Check out our new product",
            referenceId: "product-id",
            referenceType: "PRODUCT",
        });
    }
}
*/

export default {};
