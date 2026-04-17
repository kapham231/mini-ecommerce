/**
 * Product Module Types
 */

import { z } from "zod";

// Query schemas
export const productQuerySchema = z.object({
    search: z.string().optional(),
    minPrice: z.string().optional().transform((v) => v ? parseFloat(v) : undefined),
    maxPrice: z.string().optional().transform((v) => v ? parseFloat(v) : undefined),
    categoryId: z.string().optional(),
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("10").transform(Number),
    sortBy: z.string().optional().default("createdAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Body schemas
export const createProductSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters"),
    description: z.string().optional(),
    price: z.number().positive("Price must be positive"),
    categoryId: z.string().uuid("Invalid category ID"),
    stock: z.number().int().min(0, "Stock must be positive"),
});

export const updateProductSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    categoryId: z.string().uuid().optional(),
    stock: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
});

// Param schemas
export const productIdParamSchema = z.object({
    id: z.string().uuid("Invalid product ID"),
});

// TypeScript types
export type ProductQuery = z.infer<typeof productQuerySchema>;
export type CreateProductRequest = z.infer<typeof createProductSchema>;
export type UpdateProductRequest = z.infer<typeof updateProductSchema>;

export interface ProductDTO {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    categoryId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}
