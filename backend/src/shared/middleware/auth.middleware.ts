import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../types/error";
import { verifyToken } from "../utils/jwt";

/**
 * Authentication Middleware
 * 
 * Verifies JWT token from cookies or Authorization header.
 * Attaches decoded user info to req.user.
 */
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Try getting token from cookies
        let token = req.cookies?.token;

        // Fallback to Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new UnauthorizedError("Authentication token is missing");
        }

        // Verify token
        const decoded = verifyToken(token);
        
        // Attach user info to request
        (req as any).user = decoded;
        
        next();
    } catch (error) {
        next(new UnauthorizedError("Invalid or expired token"));
    }
};

/**
 * Admin Role Middleware
 * 
 * Ensures the authenticated user has the ADMIN role.
 * MUST be placed after authMiddleware.
 */
export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (req as any).user;
    
    if (!user || user.role !== "ADMIN") {
        return next(new UnauthorizedError("Admin access required"));
    }
    
    next();
};
