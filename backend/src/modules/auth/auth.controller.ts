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
        const result = await this.authService.register(data);

        // Set token in cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
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
        const result = await this.authService.login(data);

        // Set token in cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000,
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
