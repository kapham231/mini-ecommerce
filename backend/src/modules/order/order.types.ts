/**
 * Order Module Types
 */

import { z } from "zod";
import { OrderStatus } from "@prisma/client";

// Body schemas
export const checkoutSchema = z.object({
    address: z.string().min(10, "Address must be at least 10 characters"),
    phone: z.string().min(10, "Phone must be at least 10 characters"),
});

export const updateOrderStatusSchema = z.object({
    status: z.nativeEnum(OrderStatus, {
        errorMap: () => ({ message: "Invalid order status" }),
    }),
});

// Query schemas
export const orderQuerySchema = z.object({
    page: z.string().optional().default("1").transform(Number),
    limit: z.string().optional().default("10").transform(Number),
});

// Param schemas
export const orderIdParamSchema = z.object({
    id: z.string().uuid("Invalid order ID"),
});

// TypeScript types
export type CheckoutRequest = z.infer<typeof checkoutSchema>;
export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;
export type OrderQuery = z.infer<typeof orderQuerySchema>;

export interface OrderItemDTO {
    id: string;
    orderId: string;
    productId: string;
    name: string;
    imageUrl?: string;
    quantity: number;
    price: number;
}

export interface OrderDTO {
    id: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    address: string;
    phone: string;
    paidAt?: Date;
    shippedAt?: Date;
    completedAt?: Date;
    items: OrderItemDTO[];
    createdAt: Date;
    updatedAt: Date;
}