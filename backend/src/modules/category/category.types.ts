/**
 * Category Module Types
 */

import { z } from "zod";

export const createCategorySchema = z.object({
    name: z.string().min(2, "Category name must be at least 2 characters"),
});

export const updateCategorySchema = z.object({
    name: z.string().min(2).optional(),
});

export const categoryIdParamSchema = z.object({
    id: z.string().uuid("Invalid category ID"),
});

export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;

export interface CategoryDTO {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}
