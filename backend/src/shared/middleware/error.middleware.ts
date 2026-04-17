/**
 * Global Error Handling Middleware
 * 
 * Catches all errors and returns standardized error responses.
 */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/error";

export interface ErrorResponse {
    success: false;
    message: string;
    statusCode: number;
    details?: any;
    timestamp: string;
}

export const errorMiddleware = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Check if it's our custom AppError
    if (err instanceof AppError) {
        const errorResponse: ErrorResponse = {
            success: false,
            message: err.message,
            statusCode: err.statusCode,
            ...(err.details && { details: err.details }),
            timestamp: new Date().toISOString(),
        };

        return res.status(err.statusCode).json(errorResponse);
    }

    // Handle generic errors
    console.error("[Error]", err);

    const errorResponse: ErrorResponse = {
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
        statusCode: 500,
        timestamp: new Date().toISOString(),
    };

    return res.status(500).json(errorResponse);
};
