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
import {
    getAccessTokenCookieOptions,
    getClearAuthCookieOptions,
    getRefreshTokenCookieOptions,
} from "../../shared/utils/cookies";

function setAuthCookies(
    res: Response,
    tokens: { token: string; refreshToken: string }
) {
    res.cookie("token", tokens.token, getAccessTokenCookieOptions());
    res.cookie("refreshToken", tokens.refreshToken, getRefreshTokenCookieOptions());
}

function clearAuthCookies(res: Response) {
    const options = getClearAuthCookieOptions();
    res.clearCookie("token", options);
    res.clearCookie("refreshToken", options);
}

export class AuthController {
    constructor(private authService: AuthService) {}

    register = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as RegisterRequest;
        const result = await this.authService.register(
            data,
            req.ip,
            req.get("user-agent") || undefined
        );

        setAuthCookies(res, result);

        res.status(201).json({
            success: true,
            data: {
                user: result.user,
            },
        });
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as LoginRequest;
        const result = await this.authService.login(
            data,
            req.ip,
            req.get("user-agent") || undefined
        );

        setAuthCookies(res, result);

        res.status(200).json({
            success: true,
            data: {
                user: result.user,
            },
        });
    });

    me = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as Request & { user?: { id: string } }).user?.id;
        const user = await this.authService.getUserById(userId!);

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        const refreshToken = req.cookies?.refreshToken as string | undefined;
        await this.authService.logout(refreshToken);
        clearAuthCookies(res);

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    });

    socialCallback = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as { id: string; role: string } | undefined;

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

        setAuthCookies(res, { token, refreshToken });

        res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/success`);
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const tokenFromCookie = req.cookies?.refreshToken as string | undefined;
        const tokenFromBody = req.body?.refreshToken as string | undefined;
        const refreshToken = tokenFromCookie || tokenFromBody;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        const result = await this.authService.refreshToken(refreshToken);

        setAuthCookies(res, result);

        res.status(200).json({
            success: true,
            data: {
                user: result.user,
            },
        });
    });
}
