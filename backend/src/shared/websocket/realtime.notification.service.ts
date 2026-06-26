/**
 * Real-Time Notification Service
 *
 * Provides methods for modules to send real-time notifications via Socket.IO.
 * This service integrates with the existing NotificationService to:
 * 1. Save notification to database (via NotificationService)
 * 2. Emit Socket.IO event to connected clients
 *
 * Usage in other modules:
 * ```
 * const realtimeService = getRealTimeNotificationService();
 * await realtimeService.notifyUser(userId, {
 *     type: "VENDOR_REQUEST",
 *     title: "New vendor request",
 *     message: "...",
 * });
 * ```
 */

import { Server as SocketIOServer } from "socket.io";
import { getSocketIOGateway } from "../websocket/socketio.gateway";
import { prisma } from "../prisma/client";
import { NotificationType } from "@prisma/client";
import { logger } from "../utils/logger";

export interface RealtimeNotificationPayload {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    referenceId?: string;
    referenceType?: string;
}

export interface AdminNotificationPayload {
    type: NotificationType;
    title: string;
    message: string;
    referenceId?: string;
    referenceType?: string;
    vendorId?: string;
    data?: Record<string, any>;
}

export class RealTimeNotificationService {
    /**
     * Send notification to specific user (saved to DB + real-time)
     */
    public async notifyUser(payload: RealtimeNotificationPayload): Promise<void> {
        try {
            // Save to database
            const notification = await prisma.notification.create({
                data: {
                    userId: payload.userId,
                    type: payload.type,
                    title: payload.title,
                    message: payload.message,
                    referenceId: payload.referenceId,
                    referenceType: payload.referenceType,
                },
            });

            // Emit real-time event
            const gateway = getSocketIOGateway();
            gateway.broadcastToUser(payload.userId, "notification:received", {
                id: notification.id,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                referenceId: notification.referenceId,
                referenceType: notification.referenceType,
                createdAt: notification.createdAt,
            });

            logger.info(`Notification sent to user: ${payload.userId}`);
        } catch (error) {
            logger.error("Error sending user notification:", error);
            throw error;
        }
    }

    /**
     * Send notification to all admins (saved to DB for each admin + real-time)
     */
    public async notifyAdmins(payload: AdminNotificationPayload): Promise<void> {
        try {
            // Get all admin users
            const admins = await prisma.user.findMany({
                where: { role: "ADMIN" },
                select: { id: true },
            });

            if (admins.length === 0) {
                logger.warn("No admins found to notify");
                return;
            }

            // Create notification for each admin
            const notifications = await Promise.all(
                admins.map((admin) =>
                    prisma.notification.create({
                        data: {
                            userId: admin.id,
                            type: payload.type,
                            title: payload.title,
                            message: payload.message,
                            referenceId: payload.referenceId,
                            referenceType: payload.referenceType,
                        },
                    })
                )
            );

            // Emit real-time events to all admins
            const gateway = getSocketIOGateway();
            const notificationData = {
                type: payload.type,
                title: payload.title,
                message: payload.message,
                referenceId: payload.referenceId,
                referenceType: payload.referenceType,
                vendorId: payload.vendorId,
                data: payload.data,
                createdAt: new Date(),
            };

            gateway.broadcastToAdmins("notification:received", notificationData);

            logger.info(`Notification sent to ${admins.length} admins`);
        } catch (error) {
            logger.error("Error sending admin notifications:", error);
            throw error;
        }
    }

    /**
     * Send notification to specific user WITHOUT saving to DB
     * Useful for transient notifications (e.g., user online status)
     */
    public notifyUserRealtime(userId: string, event: string, data: any): void {
        try {
            const gateway = getSocketIOGateway();
            gateway.broadcastToUser(userId, event, data);
            logger.info(`Real-time event sent to user: ${userId} | Event: ${event}`);
        } catch (error) {
            logger.error("Error sending real-time notification:", error);
        }
    }

    /**
     * Send notification to all admins (real-time only, no DB save)
     */
    public notifyAdminsRealtime(event: string, data: any): void {
        try {
            const gateway = getSocketIOGateway();
            gateway.broadcastToAdmins(event, data);
            logger.info(`Real-time event sent to all admins | Event: ${event}`);
        } catch (error) {
            logger.error("Error sending admin real-time notification:", error);
        }
    }

    /**
     * Get connected status of a user
     */
    public getUserConnectionStatus(userId: string): {
        connected: boolean;
        socketCount: number;
    } {
        try {
            const gateway = getSocketIOGateway();
            const sockets = gateway.getUserSockets(userId);
            return {
                connected: sockets.length > 0,
                socketCount: sockets.length,
            };
        } catch (error) {
            logger.error("Error getting user connection status:", error);
            return { connected: false, socketCount: 0 };
        }
    }

    /**
     * Get total connected users count
     */
    public getConnectedUsersCount(): number {
        try {
            const gateway = getSocketIOGateway();
            return gateway.getConnectedUsersCount();
        } catch (error) {
            logger.error("Error getting connected users count:", error);
            return 0;
        }
    }
}

// Singleton instance
let realtimeNotificationService: RealTimeNotificationService | null = null;

export function initializeRealTimeNotificationService(): RealTimeNotificationService {
    if (!realtimeNotificationService) {
        realtimeNotificationService = new RealTimeNotificationService();
    }
    return realtimeNotificationService;
}

export function getRealTimeNotificationService(): RealTimeNotificationService {
    if (!realtimeNotificationService) {
        throw new Error("RealTimeNotificationService not initialized. Call initializeRealTimeNotificationService() first.");
    }
    return realtimeNotificationService;
}

export default RealTimeNotificationService;
