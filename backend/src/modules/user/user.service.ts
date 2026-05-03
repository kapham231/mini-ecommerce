/**
 * User Module Service
 * 
 * Core business logic for users.
 * Note: Services are completely isolated and only communicate with Prisma.
 * If other modules need user data, they use the public methods here.
 */
import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { NotFoundError, ConflictError } from "../../shared/types/error";
import { UserQuery, CreateUserRequest, UpdateUserRequest, UserDTO } from "./user.types";
import { PaginatedResponse } from "../../common/types/pagination";
import bcrypt from "bcrypt";

export class UserService {
    /**
     * Get all users with pagination
     */
    async getUsers(query: UserQuery): Promise<PaginatedResponse<UserDTO>> {
        const { search, role, isActive, page, limit, sortBy, order } = query;

        const where: Prisma.UserWhereInput = {
            deletedAt: null, // Only get non-deleted users
        };

        // Search by name or email
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { email: { contains: search } },
            ];
        }

        // Filter by role
        if (role) {
            where.role = role;
        }

        // Filter by active status
        if (isActive !== undefined) {
            where.isActive = isActive;
        }

        const total = await prisma.user.count({ where });

        const users = await prisma.user.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                [sortBy]: order,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                avatar: true,
                isActive: true,
                isVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                addresses: {
                    where: { isDefault: true },
                    take: 1
                }
            },
        });

        return {
            data: users as unknown as UserDTO[],
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
    * Get single user
    */
    async getUserById(id: string): Promise<UserDTO> {
        const user = await prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                avatar: true,
                isActive: true,
                isVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                addresses: true,
            },
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        return user as UserDTO;
    }

    /**
     * Create a new user
     */
    async createUser(data: CreateUserRequest): Promise<UserDTO> {

        // Check email unique
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new ConflictError("Email already exists");
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || "USER",
                phone: data.phone || null,
                avatar: data.avatar || null,
                cart: {
                    create: {} // Auto create cart
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                avatar: true,
                isActive: true,
                isVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user as unknown as UserDTO;
    }

    /**
    * Update user
    */
    async updateUser(id: string, data: UpdateUserRequest): Promise<UserDTO> {

        const user = await prisma.user.findFirst({ 
            where: { id, deletedAt: null } 
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        const updateData: Prisma.UserUpdateInput = {};

        // Update email (check unique)
        if (data.email && data.email !== user.email) {
            const existing = await prisma.user.findUnique({
                where: { email: data.email },
            });

            if (existing) {
                throw new ConflictError("Email already exists");
            }

            updateData.email = data.email;
        }

        if (data.name) updateData.name = data.name;

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            updateData.password = hashedPassword;
        }

        if (data.role) updateData.role = data.role;
        if (data.phone !== undefined) updateData.phone = data.phone;
        if (data.avatar !== undefined) updateData.avatar = data.avatar;
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        if (data.isVerified !== undefined) updateData.isVerified = data.isVerified;

        updateData.updatedAt = new Date();

        const updated = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                phone: true,
                avatar: true,
                isActive: true,
                isVerified: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
                addresses: true,
            },
        });

        return updated as UserDTO;
    }

    /**
    * Delete user (hard delete)
    */
    async deleteUser(id: string): Promise<void> {
        const user = await prisma.user.findFirst({ 
            where: { id, deletedAt: null } 
        });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Soft delete
        await prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    }
}