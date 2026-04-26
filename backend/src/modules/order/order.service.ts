/**
 * Order Module Service
 *
 * Core business logic for order operations.
 * Note: Services are completely isolated and only communicate with Prisma.
 */

import { Prisma, OrderStatus } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import {
    NotFoundError,
    ValidationError,
} from "../../shared/types/error";
import { OrderDTO, OrderItemDTO, OrderQuery } from "./order.types";
import { PaginatedResponse } from "../../common/types/pagination";

/**
 * Map Prisma order item to OrderItemDTO
 */
function mapToOrderItemDTO(orderItem: any): OrderItemDTO {
    return {
        id: orderItem.id,
        orderId: orderItem.orderId,
        productId: orderItem.productId,
        name: orderItem.name,
        imageUrl: orderItem.imageUrl || undefined,
        quantity: orderItem.quantity,
        price: orderItem.price.toNumber(),
    };
}

/**
 * Map Prisma order to OrderDTO
 */
function mapToOrderDTO(order: any): OrderDTO {
    return {
        id: order.id,
        userId: order.userId,
        totalAmount: order.totalAmount.toNumber(),
        status: order.status,
        address: order.address,
        phone: order.phone,
        paidAt: order.paidAt || undefined,
        shippedAt: order.shippedAt || undefined,
        completedAt: order.completedAt || undefined,
        items: order.items.map(mapToOrderItemDTO),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
}

export class OrderService {
    /**
     * Get paginated orders for user
     */
    async getOrders(userId: string, query: OrderQuery): Promise<PaginatedResponse<OrderDTO>> {
        const { page, limit } = query;

        const where: Prisma.OrderWhereInput = {
            userId,
        };

        // Get total count
        const total = await prisma.order.count({ where });

        // Fetch paginated orders
        const orders = await prisma.order.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: true,
            },
        });

        return {
            data: orders.map(mapToOrderDTO),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get single order by ID (ensure it belongs to user)
     */
    async getOrderById(userId: string, orderId: string): Promise<OrderDTO> {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId, // Ensure order belongs to user
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            throw new NotFoundError("Order not found");
        }

        return mapToOrderDTO(order);
    }

    /**
     * Checkout - Create order from cart
     * This is a critical operation that must be atomic
     */
    async checkout(userId: string, address: string, phone: string): Promise<OrderDTO> {
        return await prisma.$transaction(async (tx) => {
            // 1. Get user's cart with items and product data
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (!cart || cart.items.length === 0) {
                throw new ValidationError("Cart is empty");
            }

            // 2. Validate all cart items
            let totalAmount = 0;
            const orderItems: any[] = [];

            for (const cartItem of cart.items) {
                const product = cartItem.product;

                // Check product exists
                if (!product) {
                    throw new ValidationError(`Product ${cartItem.productId} not found`);
                }

                // Check product is active
                if (!product.isActive) {
                    throw new ValidationError(`Product ${product.name} is not available`);
                }

                // Check stock
                if (product.stock < cartItem.quantity) {
                    throw new ValidationError(
                        `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`
                    );
                }

                // Calculate item total
                const itemTotal = product.price.toNumber() * cartItem.quantity;
                totalAmount += itemTotal;

                // Prepare order item with snapshot
                orderItems.push({
                    productId: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    quantity: cartItem.quantity,
                    price: product.price,
                });
            }

            // 3. Create order
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    address,
                    phone,
                    items: {
                        create: orderItems,
                    },
                },
                include: {
                    items: true,
                },
            });

            // 4. Update product stock
            for (const cartItem of cart.items) {
                await tx.product.update({
                    where: { id: cartItem.productId },
                    data: {
                        stock: {
                            decrement: cartItem.quantity,
                        },
                    },
                });
            }

            // 5. Clear cart
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });

            return mapToOrderDTO(order);
        });
    }

    /**
     * Update order status (admin operation)
     */
    async updateOrderStatus(orderId: string, status: OrderStatus): Promise<OrderDTO> {
        // Get current order
        const currentOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!currentOrder) {
            throw new NotFoundError("Order not found");
        }

        // Update status and timestamps based on status
        const updateData: any = { status };

        if (status === OrderStatus.PAID && !currentOrder.paidAt) {
            updateData.paidAt = new Date();
        } else if (status === OrderStatus.SHIPPED && !currentOrder.shippedAt) {
            updateData.shippedAt = new Date();
        } else if (status === OrderStatus.COMPLETED && !currentOrder.completedAt) {
            updateData.completedAt = new Date();
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: updateData,
            include: { items: true },
        });

        return mapToOrderDTO(order);
    }
}