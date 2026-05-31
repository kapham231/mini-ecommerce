/**
 * Cart Module Service
 *
 * Core business logic for cart operations.
 * Note: Services are completely isolated and only communicate with Prisma.
 */

import { prisma } from "../../shared/prisma/client";
import {
    NotFoundError,
    ValidationError,
    ConflictError,
} from "../../shared/types/error";
import { mapCartItemDTO } from "../../shared/utils/dto-mapper";
import { CartDTO } from "./cart.types";

/**
 * Map Prisma cart to CartDTO
 */
function mapToCartDTO(cart: any): CartDTO {
    return {
        id: cart.id,
        userId: cart.userId,
        items: cart.items.map(mapCartItemDTO),
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
    };
}

export class CartService {
    /**
     * Get user's cart with items and product data
     */
    async getCart(userId: string): Promise<CartDTO> {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                imageUrl: true,
                                stock: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });

        if (!cart) {
            // Create empty cart for user
            const newCart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    price: true,
                                    imageUrl: true,
                                    stock: true,
                                    isActive: true,
                                },
                            },
                        },
                    },
                },
            });
            return mapToCartDTO(newCart);
        }

        return mapToCartDTO(cart);
    }

    /**
     * Add item to cart
     * If item exists, increase quantity; if not, create new
     */
    async addToCart(userId: string, productId: string, quantity: number): Promise<CartDTO> {
        // Check if product exists and is active
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                stock: true,
                isActive: true,
            },
        });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        if (!product.isActive) {
            throw new ValidationError("Product is not available");
        }

        if (product.stock < quantity) {
            throw new ValidationError(`Insufficient stock. Available: ${product.stock}`);
        }

        await prisma.$transaction(async (tx) => {
            let cart = await tx.cart.findUnique({ where: { userId } });

            if (!cart) {
                cart = await tx.cart.create({ data: { userId } });
            }

            const existingItem = await tx.cartItem.findUnique({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
            });

            if (existingItem) {
                await tx.cartItem.update({
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId,
                        },
                    },
                    data: {
                        quantity: existingItem.quantity + quantity,
                    },
                });
            } else {
                await tx.cartItem.create({
                    data: {
                        cartId: cart.id,
                        productId,
                        quantity,
                    },
                });
            }
        });

        return this.getCart(userId);
    }

    /**
     * Update cart item quantity
     * If quantity = 0, remove item
     */
    async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartDTO> {
        // Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        // Check if item exists
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (!existingItem) {
            throw new NotFoundError("Cart item not found");
        }

        if (quantity === 0) {
            // Remove item
            await prisma.cartItem.delete({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
            });
        } else {
            // Update quantity
            await prisma.cartItem.update({
                where: {
                    cartId_productId: {
                        cartId: cart.id,
                        productId,
                    },
                },
                data: { quantity },
            });
        }

        return this.getCart(userId);
    }

    /**
     * Remove item from cart
     */
    async removeCartItem(userId: string, productId: string): Promise<CartDTO> {
        // Get user's cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            throw new NotFoundError("Cart not found");
        }

        // Check if item exists
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        if (!existingItem) {
            throw new NotFoundError("Cart item not found");
        }

        // Remove item
        await prisma.cartItem.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId,
                },
            },
        });

        return this.getCart(userId);
    }
}