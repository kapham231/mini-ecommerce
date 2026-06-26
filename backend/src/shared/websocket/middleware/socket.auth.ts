/**
 * Socket.IO Authentication Middleware
 *
 * Verifies JWT tokens from socket handshake and attaches user info.
 * Token can be passed via:
 * 1. Query parameter: ?token=<jwt_token>
 * 2. Headers: Authorization: Bearer <jwt_token>
 *
 * On successful verification, attaches to socket.handshake.auth:
 * - userId: User ID from JWT payload
 * - userRole: User role from JWT payload
 * - email: User email from JWT payload
 */

import { Socket } from "socket.io";
import { verifyToken } from "../../utils/jwt";
import { logger } from "../../utils/logger";

interface AuthPayload {
    userId?: string;
    userRole?: string;
    email?: string;
}

export class SocketAuthMiddleware {
    /**
     * Authenticate socket connection
     */
    public authenticate(socket: Socket, next: (err?: Error) => void): void {
        try {
            // Get token from query or headers
            const token = socket.handshake.query.token as string || 
                         socket.handshake.headers.authorization?.replace("Bearer ", "");

            if (!token) {
                return next(new Error("Authentication token is required"));
            }

            // Verify JWT token
            const decoded = verifyToken(token) as any;

            if (!decoded || !decoded.id) {
                return next(new Error("Invalid or expired token"));
            }

            // Attach user info to socket handshake
            socket.handshake.auth = {
                userId: decoded.id,
                userRole: decoded.role || "USER",
                email: decoded.email,
            };

            next();
        } catch (error) {
            logger.error("Socket authentication error:", error);
            next(new Error("Authentication failed"));
        }
    }
}

export default SocketAuthMiddleware;
