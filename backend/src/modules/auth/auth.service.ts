/**
 * Auth Module Service
 * 
 * Core business logic for authentication.
 * Services should ONLY use Prisma client and NOT access other modules directly.
 * Cross-module communication happens at the controller level OR through dependency injection.
 */

import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma/client";
import {
    ConflictError,
    ValidationError,
    UnauthorizedError
} from "../../shared/types/error";
import { RegisterRequest, LoginRequest, AuthResponse } from "./auth.types";
import {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../shared/utils/jwt";

export class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
        const { name, email, password } = data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictError("Email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                cart: {
                    create: {} // Auto create cart for new user
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
            },
        });

        // Generate access token
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        const refreshToken = await this.createRefreshSession(user.id);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
            refreshToken,
        };
    }

    /**
     * Login a user
     */
    async login(data: LoginRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
        const { email, password } = data;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.deletedAt) {
            throw new UnauthorizedError("Invalid credentials");
        }

        if (!user.isActive) {
            throw new UnauthorizedError("Account is disabled");
        }

        // Compare passwords (if exists, social users might not have password)
        if (!user.password) {
            throw new UnauthorizedError("This account uses social login. Please sign in with Google/Facebook.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid credentials");
        }

        // Update last login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate access token
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        const refreshToken = await this.createRefreshSession(user.id, ipAddress, userAgent);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
            refreshToken,
        };
    }

    /**
     * Create a refresh session record
     */
    async createRefreshSession(userId: string, ipAddress?: string, userAgent?: string): Promise<string> {
        const refreshToken = generateRefreshToken({ userId });
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await prisma.session.create({
            data: {
                userId,
                refreshToken,
                ipAddress: ipAddress || null,
                userAgent: userAgent || null,
                expiresAt,
            },
        });

        return refreshToken;
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        if (!refreshToken) {
            throw new UnauthorizedError("Refresh token is missing");
        }

        verifyRefreshToken(refreshToken);

        const session = await prisma.session.findUnique({
            where: { refreshToken },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        isActive: true,
                        deletedAt: true,
                    },
                },
            },
        });

        if (!session || session.expiresAt < new Date()) {
            throw new UnauthorizedError("Refresh token is invalid or expired");
        }

        const user = session.user;
        if (!user || user.deletedAt || !user.isActive) {
            throw new UnauthorizedError("User session is invalid");
        }

        const token = generateToken({ id: user.id, role: user.role });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
            refreshToken,
        };
    }

    /**
     * Revoke refresh session and clear auth state
     */
    async logout(refreshToken?: string): Promise<void> {
        if (!refreshToken) {
            return;
        }

        await prisma.session.deleteMany({
            where: { refreshToken },
        });
    }

    /**
     * Get user by ID (useful for other modules)
     */
    async getUserById(id: string) {
        const user = await prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                isActive: true,
            },
        });

        if (!user) {
            throw new ValidationError("User not found");
        }

        return user;
    }

    /**
     * Handle social login (Google/Facebook)
     * Finds or creates a user based on provider information
     */
    async upsertSocialUser(data: {
        email: string;
        name: string;
        avatar?: string;
        provider: string;
        providerAccountId: string;
        access_token?: string;
        refresh_token?: string;
    }) {
        const { email, name, avatar, provider, providerAccountId, access_token, refresh_token } = data;

        // 1. Try to resolve existing social account first
        const existingAccount = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
            include: { user: true },
        });

        if (existingAccount) {
            const user = existingAccount.user;
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });
            return user;
        }

        // 2. Check whether an account already exists with the same email.
        const userByEmail = await prisma.user.findUnique({
            where: { email },
            include: { accounts: true },
        });

        if (userByEmail) {
            // Prevent automatic linking if the email already exists with another login method.
            throw new ConflictError(
                "Email already registered. Please sign in with the existing method before linking social login."
            );
        }

        // 3. Create a new user with a linked social account.
        const user = await prisma.user.create({
            data: {
                email,
                name,
                avatar,
                isVerified: true,
                cart: {
                    create: {},
                },
                accounts: {
                    create: {
                        type: "oauth",
                        provider,
                        providerAccountId,
                        access_token,
                        refresh_token,
                    },
                },
            },
            include: { accounts: true },
        });

        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        return user;
    }
}
