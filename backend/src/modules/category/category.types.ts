/**
 * Category Module Types
 */

import { z } from "zod";

// Body schemas
export const createCategorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
    description: z.string().optional(),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
});

// Param schemas
export const categoryIdParamSchema = z.object({
    id: z.string().uuid("Invalid category ID"),
});

// TypeScript types
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;

export interface CategoryDTO {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
