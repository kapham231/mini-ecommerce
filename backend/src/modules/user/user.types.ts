/**
 * User Module Types
 */
import { z } from "zod";

export const roleEnum = z.enum(["USER", "ADMIN"]);

export const userQuerySchema = z.object({
    search: z.string().optional(), // name or email
    role: roleEnum.optional(),
    isActive: z.string().optional().transform(val => val === "true" ? true : val === "false" ? false : undefined),
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("10").transform(Number),
    sortBy: z.string().optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Body schemas
export const createUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    role: roleEnum.optional().default("USER"),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9]{9,11}$/.test(val), {
            message: "Invalid phone number",
        }),
    avatar: z.string().url("Invalid avatar URL").optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    role: roleEnum.optional(),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^[0-9]{9,11}$/.test(val), {
            message: "Invalid phone number",
        }),
    avatar: z.string().url().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
});

// Param schemas
export const userIdParamSchema = z.object({
    id: z.string().uuid("Invalid user ID"),
});

// TypeScript types
export type UserQuery = z.infer<typeof userQuerySchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;

export interface AddressDTO {
    id: string;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    isDefault: boolean;
}

export interface UserDTO {
    id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    avatar: string | null;
    phone: string | null;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    addresses?: AddressDTO[];
}

