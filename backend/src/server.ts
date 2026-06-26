/**
 * Server Entry Point
 * 
 * Starts the Express server listening on the configured port.
 * Initializes Socket.IO for real-time communication.
 * Separated from app configuration for easier testing.
 */

import "dotenv/config";
import http from "http";
import { createApp } from "./app";
import {
    initializeSocketIO,
    initializeRealTimeNotificationService,
    notificationSubscribeHandler,
    notificationUnsubscribeHandler,
} from "./shared/websocket";
import { getSocketIOGateway } from "./shared/websocket/socketio.gateway";
import { logger } from "./shared/utils/logger";

const PORT = process.env.PORT || 5000;
const app = createApp();

// Create HTTP server for Socket.IO
const httpServer = http.createServer(app);

// Initialize Socket.IO
initializeSocketIO(httpServer);

// Initialize Real-Time Notification Service
initializeRealTimeNotificationService();

// Register event handlers
const gateway = getSocketIOGateway();
const registry = gateway.getEventRegistry();

// Register notification event handlers
registry.register("notification", "subscribe", notificationSubscribeHandler);
registry.register("notification", "unsubscribe", notificationUnsubscribeHandler);

// Start server
httpServer.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    logger.info(`Architecture: Modular Monolith`);
    logger.info(`Socket.IO initialized for real-time communication`);
});