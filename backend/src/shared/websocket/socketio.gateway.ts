/**
 * Socket.IO Gateway
 *
 * Main entry point for Socket.IO server initialization and management.
 * Handles:
 * - Server instance creation with CORS and authentication
 * - Namespace registration (notifications, chat, etc.)
 * - Event handler registration
 * - Connection/disconnection lifecycle
 *
 * Scalability features:
 * - Supports clustering with Redis adapter
 * - Namespace-based organization for different features
 * - Event registry pattern for extensibility
 * - Authentication via JWT tokens
 */

import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { env } from "../utils/env";
import { logger } from "../utils/logger";
import { EventRegistry } from "./event.registry";
import { SocketAuthMiddleware } from "./middleware/socket.auth";

export interface SocketIOConfig {
    corsOrigin?: string | string[];
    maxHttpBufferSize?: number;
    transports?: ("websocket" | "polling")[];
    pingInterval?: number;
    pingTimeout?: number;
}

export class SocketIOGateway {
    private io: SocketIOServer | null = null;
    private eventRegistry: EventRegistry;
    private authMiddleware: SocketAuthMiddleware;

    constructor() {
        this.eventRegistry = new EventRegistry();
        this.authMiddleware = new SocketAuthMiddleware();
    }

    /**
     * Initialize Socket.IO server
     */
    public initialize(httpServer: HTTPServer, config?: SocketIOConfig): SocketIOServer {
        const defaultConfig: SocketIOConfig = {
            corsOrigin: env.FRONTEND_URL || ["http://localhost:3000", "http://localhost:5173"],
            maxHttpBufferSize: 1e6, // 1MB
            transports: ["websocket", "polling"],
            pingInterval: 25000,
            pingTimeout: 60000,
            ...config,
        };

        this.io = new SocketIOServer(httpServer, {
            cors: {
                origin: defaultConfig.corsOrigin,
                credentials: true,
                methods: ["GET", "POST"],
            },
            maxHttpBufferSize: defaultConfig.maxHttpBufferSize,
            transports: defaultConfig.transports,
            pingInterval: defaultConfig.pingInterval,
            pingTimeout: defaultConfig.pingTimeout,
        });

        // Global middleware for authentication
        this.io.use((socket, next) => this.authMiddleware.authenticate(socket, next));

        // Connection handler
        this.io.on("connection", (socket) => this.handleConnection(socket));

        logger.info("Socket.IO server initialized");
        return this.io;
    }

    /**
     * Handle new socket connection
     */
    private handleConnection(socket: Socket): void {
        const userId = socket.handshake.auth.userId;
        const userRole = socket.handshake.auth.userRole;

        logger.info(`Socket connected: ${socket.id} | User: ${userId} | Role: ${userRole}`);

        // Store user info on socket
        socket.data.userId = userId;
        socket.data.userRole = userRole;

        // Join user-specific room for private notifications
        socket.join(`user:${userId}`);

        // If admin, join admin room
        if (userRole === "ADMIN") {
            socket.join("admin");
        }

        // Register event handlers from registry
        if (this.io) {
            this.eventRegistry.attachHandlers(socket, this.io);
        }

        // Disconnect handler
        socket.on("disconnect", () => this.handleDisconnect(socket));
    }

    /**
     * Handle socket disconnection
     */
    private handleDisconnect(socket: Socket): void {
        const userId = socket.data.userId;
        logger.info(`Socket disconnected: ${socket.id} | User: ${userId}`);
    }

    /**
     * Get Socket.IO instance
     */
    public getIO(): SocketIOServer {
        if (!this.io) {
            throw new Error("Socket.IO server not initialized. Call initialize() first.");
        }
        return this.io;
    }

    /**
     * Get event registry
     */
    public getEventRegistry(): EventRegistry {
        return this.eventRegistry;
    }

    /**
     * Register event handlers
     * This allows modules to register their own event handlers
     */
    public registerEventHandler(namespace: string, event: string, handler: any): void {
        this.eventRegistry.register(namespace, event, handler);
    }

    /**
     * Broadcast to specific room
     */
    public broadcastToRoom(room: string, event: string, data: any): void {
        if (!this.io) {
            logger.warn("Socket.IO not initialized, cannot broadcast");
            return;
        }
        this.io.to(room).emit(event, data);
    }

    /**
     * Broadcast to specific user
     */
    public broadcastToUser(userId: string, event: string, data: any): void {
        this.broadcastToRoom(`user:${userId}`, event, data);
    }

    /**
     * Broadcast to all admins
     */
    public broadcastToAdmins(event: string, data: any): void {
        this.broadcastToRoom("admin", event, data);
    }

    /**
     * Get connected users count
     */
    public getConnectedUsersCount(): number {
        return this.io?.engine.clientsCount || 0;
    }

    /**
     * Get user sockets
     */
    public getUserSockets(userId: string): Socket[] {
        if (!this.io) return [];
        const sockets = this.io.sockets.sockets;
        const userSockets: Socket[] = [];
        sockets.forEach((socket) => {
            if (socket.data.userId === userId) {
                userSockets.push(socket);
            }
        });
        return userSockets;
    }

    /**
     * Graceful shutdown
     */
    public async shutdown(): Promise<void> {
        if (this.io) {
            await this.io.close();
            logger.info("Socket.IO server shut down gracefully");
        }
    }
}

// Singleton instance
let socketIOGateway: SocketIOGateway | null = null;

export function initializeSocketIO(httpServer: HTTPServer, config?: SocketIOConfig): SocketIOServer {
    if (!socketIOGateway) {
        socketIOGateway = new SocketIOGateway();
    }
    return socketIOGateway.initialize(httpServer, config);
}

export function getSocketIOGateway(): SocketIOGateway {
    if (!socketIOGateway) {
        throw new Error("Socket.IO Gateway not initialized. Call initializeSocketIO() first.");
    }
    return socketIOGateway;
}

export default SocketIOGateway;
