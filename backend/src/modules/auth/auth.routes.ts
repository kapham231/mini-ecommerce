/**
 * Auth Module Routes
 * 
 * Defines API endpoints for the auth module.
 */

import { Router } from "express";
import passport from "passport";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { validate } from "../../shared/middleware/validation.middleware";
import { authMiddleware } from "../../shared/middleware";
import { authRateLimiter } from "../../shared/middleware/rate-limit.middleware";
import { registerSchema, loginSchema } from "./auth.types";

export function createAuthRouter(): Router {
    const router = Router();

    // Instantiate service and controller (DI pattern)
    const authService = new AuthService();
    const authController = new AuthController(authService);

    // ============================================
    // Local Auth
    // ============================================
    router.post(
        "/register",
        authRateLimiter,
        validate({ body: registerSchema }),
        authController.register
    );

    router.post(
        "/login",
        authRateLimiter,
        validate({ body: loginSchema }),
        authController.login
    );

    router.post(
        "/refresh",
        authController.refreshToken
    );

    router.get("/me", authMiddleware, authController.me);

    router.post("/logout", authController.logout);

    // ============================================
    // Social Auth (Google)
    // ============================================

    // 1. Khởi động quá trình đăng nhập Google
    router.get(
        "/google",
        passport.authenticate("google", { scope: ["profile", "email"], session: false })
    );

    // 2. Google gọi về sau khi user đăng nhập xong
    router.get(
        "/google/callback",
        passport.authenticate("google", { failureRedirect: "/login", session: false }),
        authController.socialCallback
    );

    // ============================================
    // Social Auth (Facebook)
    // ============================================
    // router.get(
    //     "/facebook",
    //     passport.authenticate("facebook", { scope: ["email", "public_profile"], session: false })
    // );

    // router.get(
    //     "/facebook/callback",
    //     passport.authenticate("facebook", { failureRedirect: "/login", session: false }),
    //     authController.socialCallback
    // );

    return router;
}

export default createAuthRouter();
