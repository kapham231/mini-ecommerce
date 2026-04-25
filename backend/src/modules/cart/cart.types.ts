/**
 * Cart Module Types
 */

import { z } from "zod";

// Body schemas
export const addToCartSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const updateCartItemSchema = z.object({
    quantity: z.number().int().min(0, "Quantity must be non-negative"),
});

// Param schemas
export const productIdParamSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
});

// TypeScript types
export type AddToCartRequest = z.infer<typeof addToCartSchema>;
export type UpdateCartItemRequest = z.infer<typeof updateCartItemSchema>;

export interface CartItemDTO {
    id: string;
    productId: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl?: string;
        stock: number;
        isActive: boolean;
    };
}

export interface CartDTO {
    id: string;
    userId: string;
    items: CartItemDTO[];
    createdAt: Date;
    updatedAt: Date;
}