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
import { generateToken } from "../../shared/utils/jwt";

export class AuthService {
    /**
     * Register a new user
     */
    async register(data: RegisterRequest): Promise<AuthResponse> {
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

        // Generate token
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
    }

    /**
     * Login a user
     */
    async login(data: LoginRequest): Promise<AuthResponse> {
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

        // Generate token
        const token = generateToken({
            id: user.id,
            role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user;

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        };
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
}
