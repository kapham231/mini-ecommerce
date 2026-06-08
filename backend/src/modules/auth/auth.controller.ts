/**
 * Auth Module Controller
 * 
 * Handles HTTP requests and responses.
 * Controllers use services for business logic and should not contain database logic.
 */

import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { RegisterRequest, LoginRequest } from "./auth.types";

export class AuthController {
    constructor(private authService: AuthService) { }

    /**
     * Register endpoint
     */
    register = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as RegisterRequest;
        const result = await this.authService.register(
            data,
            req.ip,
            req.get("user-agent") || undefined
        );

        // Set access token cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
        });

        // Set refresh token cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
            },
        });
    });

    /**
     * Login endpoint
     */
    login = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as LoginRequest;
        const result = await this.authService.login(
            data,
            req.ip,
            req.get("user-agent") || undefined
        );

        // Set access token cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days (miliseconds)
        });

        // Set refresh token cookie
        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
            },
        });
    });

    /**
     * Social Login Callback handler
     * Passport will call this after successful authentication
     */
    socialCallback = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as any;

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=auth_failed`);
        }

        const { generateToken } = await import("../../shared/utils/jwt");
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        const refreshToken = await this.authService.createRefreshSession(
            user.id,
            req.ip,
            req.get("user-agent") || undefined
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/success`);
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const tokenFromCookie = req.cookies?.refreshToken as string | undefined;
        const tokenFromBody = req.body?.refreshToken as string | undefined;
        const refreshToken = tokenFromCookie || tokenFromBody;

        const result = await this.authService.refreshToken(refreshToken);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            data: {
                user: result.user,
                token: result.token,
            },
        });
    });
}
