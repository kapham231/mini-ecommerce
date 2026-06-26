/**
 * Socket.IO WebSocket Module Index
 *
 * Exports all Socket.IO related utilities and services.
 */

export { SocketIOGateway, initializeSocketIO, getSocketIOGateway } from "./socketio.gateway";
export { EventRegistry, EventHandler } from "./event.registry";
export { SocketAuthMiddleware } from "./middleware/socket.auth";
export {
    RealTimeNotificationService,
    initializeRealTimeNotificationService,
    getRealTimeNotificationService,
    RealtimeNotificationPayload,
    AdminNotificationPayload,
} from "./realtime.notification.service";
export {
    notificationSubscribeHandler,
    notificationUnsubscribeHandler,
} from "./handlers/notification.handler";
