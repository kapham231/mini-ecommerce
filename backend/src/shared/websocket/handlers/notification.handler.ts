/**
 * Notification Event Handlers
 *
 * Handles Socket.IO events for real-time notifications:
 * - Client listening for notifications
 * - Server broadcasting notifications to users/admins
 * - Connection status tracking
 *
 * Events:
 * - notification:subscribe - Client indicates they're ready to receive notifications
 * - notification:unsubscribe - Client indicates they don't want notifications
 * - notification:send (internal) - Internal event to broadcast to users
 */

import { Socket, Server as SocketIOServer } from "socket.io";
import { logger } from "../../utils/logger";

/**
 * Event: notification:subscribe
 * Client indicates they're ready to receive notifications
 */
export const notificationSubscribeHandler = async (
    socket: Socket,
    io: SocketIOServer
): Promise<void> => {
    const userId = socket.data.userId;
    const userRole = socket.data.userRole;

    socket.on("notification:subscribe", (data: { isActive?: boolean }) => {
        logger.info(`User ${userId} subscribed to notifications (Role: ${userRole})`);

        // Emit confirmation
        socket.emit("notification:subscribed", {
            success: true,
            message: "Successfully subscribed to notifications",
            userId,
            timestamp: new Date(),
        });
    });
};

/**
 * Event: notification:unsubscribe
 * Client indicates they don't want notifications
 */
export const notificationUnsubscribeHandler = async (
    socket: Socket,
    io: SocketIOServer
): Promise<void> => {
    const userId = socket.data.userId;

    socket.on("notification:unsubscribe", () => {
        logger.info(`User ${userId} unsubscribed from notifications`);

        socket.emit("notification:unsubscribed", {
            success: true,
            message: "Successfully unsubscribed from notifications",
            timestamp: new Date(),
        });
    });
};

export default {
    notificationSubscribeHandler,
    notificationUnsubscribeHandler,
};
