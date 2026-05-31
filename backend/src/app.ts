/**
 * Main Application Setup
 * 
 * Initializes Express app with middleware and registers all module routes.
 * This is where modules are integrated into the main application.
 * 
 * Key Principles:
 * - All middleware is registered here
 * - All module routes are registered here
 * - Error handling middleware is always registered last
 * - Modules are completely isolated from each other
 */

import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import { errorMiddleware } from "./shared/middleware";
import { env } from "./shared/utils/env";
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./shared/docs/openapi";
import { registerRoutes } from "./shared/docs/register";
import passport from "passport";
import "./shared/config/passport"; // Load configuration

// Module route creators
import { createAuthRouter } from "./modules/auth/auth.routes";
import { createProductRouter } from "./modules/product/product.routes";
import { createCategoryRouter } from "./modules/category/category.routes";
import { createCartRouter } from "./modules/cart/cart.routes";
import { createOrderRouter } from "./modules/order/order.routes";
import { createUploadRouter } from "./modules/upload/upload.routes";
import { createAddressRouter } from "./modules/address/address.routes";
import { createUserRouter } from "./modules/user/user.routes";

dotenv.config();

/**
 * Create and configure Express app
 */
export function createApp(): Express {
    const app = express();

    // ============================================
    // Global Middleware
    // ============================================
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(passport.initialize());

    // ============================================
    // Basic Routes
    // ============================================
    app.get("/", (_req, res) => {
        res.json({
            message: "API is running",
            version: "1.0.0",
            architecture: "Modular Monolith",
        });
    });

    // ============================================
    // Module Routes
    // ============================================
    // Each module has its own router factory function
    // This keeps modules decoupled and easily testable

    app.use("/api/auth", createAuthRouter());
    app.use("/api/users", createUserRouter());
    app.use("/api/addresses", createAddressRouter());
    app.use("/api/products", createProductRouter());
    app.use("/api/categories", createCategoryRouter());
    app.use("/api/cart", createCartRouter());
    app.use("/api/orders", createOrderRouter());
    app.use("/api/uploads", createUploadRouter());

    // Health check endpoint
    app.get("/health", (_req, res) => {
        res.json({ status: "healthy", timestamp: new Date().toISOString() });
    });

    // ============================================
    // Swagger API Documentation
    // ============================================
    if (process.env.NODE_ENV !== 'production') {
        // Register all schemas and routes to OpenAPI registry
        registerRoutes();
        
        // Generate document
        const openAPIDocument = generateOpenAPIDocument();
        
        // Serve Swagger UI
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocument));
        
        // Expose raw JSON spec
        app.get('/api-docs.json', (_req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(openAPIDocument);
        });
    }

    // ============================================
    // 404 Handler
    // ============================================
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            message: "Route not found",
            statusCode: 404,
            timestamp: new Date().toISOString(),
        });
    });

    // ============================================
    // Error Handling Middleware (MUST BE LAST)
    // ============================================
    app.use(errorMiddleware);

    return app;
}

export default createApp;
