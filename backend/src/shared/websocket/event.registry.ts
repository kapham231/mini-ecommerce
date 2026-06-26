/**
 * Event Registry
 *
 * Registry pattern for managing Socket.IO event handlers.
 * Allows modules to register event handlers without tight coupling.
 *
 * Usage:
 * - Modules register handlers in their initialization
 * - Handlers are attached to each new socket connection
 * - Supports namespaces for organization (e.g., "notification", "chat")
 *
 * Example:
 * registry.register("notification", "send", notificationHandler);
 */

import { Socket, Server as SocketIOServer } from "socket.io";
import { logger } from "../utils/logger";

export type EventHandler = (socket: Socket, io: SocketIOServer, ...args: any[]) => void | Promise<void>;

interface EventHandlerEntry {
    namespace: string;
    event: string;
    handler: EventHandler;
}

export class EventRegistry {
    private handlers: Map<string, EventHandler> = new Map();

    /**
     * Register an event handler
     */
    public register(namespace: string, event: string, handler: EventHandler): void {
        const key = `${namespace}:${event}`;
        this.handlers.set(key, handler);
        logger.info(`Registered Socket.IO event handler: ${key}`);
    }

    /**
     * Get an event handler
     */
    public get(namespace: string, event: string): EventHandler | undefined {
        return this.handlers.get(`${namespace}:${event}`);
    }

    /**
     * Get all handlers for a namespace
     */
    public getNamespaceHandlers(namespace: string): EventHandler[] {
        const handlers: EventHandler[] = [];
        this.handlers.forEach((handler, key) => {
            if (key.startsWith(`${namespace}:`)) {
                handlers.push(handler);
            }
        });
        return handlers;
    }

    /**
     * Check if handler exists
     */
    public has(namespace: string, event: string): boolean {
        return this.handlers.has(`${namespace}:${event}`);
    }

    /**
     * Attach all registered handlers to a socket
     */
    public attachHandlers(socket: Socket, io: SocketIOServer): void {
        this.handlers.forEach((handler, key) => {
            const [namespace, event] = key.split(":");
            
            socket.on(event, async (...args) => {
                try {
                    await handler(socket, io, ...args);
                } catch (error) {
                    logger.error(`Error in Socket.IO event handler ${key}:`, error);
                    socket.emit("error", {
                        message: "An error occurred while processing your request",
                        code: "HANDLER_ERROR",
                    });
                }
            });
        });
    }

    /**
     * List all registered handlers (for debugging)
     */
    public listHandlers(): string[] {
        return Array.from(this.handlers.keys());
    }

    /**
     * Clear all handlers (useful for testing)
     */
    public clear(): void {
        this.handlers.clear();
    }
}

export default EventRegistry;
