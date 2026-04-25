/**
 * Cart Module Controller
 *
 * Handles HTTP requests and delegates to service.
 * Controllers should not contain business logic or database queries.
 */

import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { AddToCartRequest, UpdateCartItemRequest } from "./cart.types";

export class CartController {
    constructor(private cartService: CartService) { }

    /**
     * GET /cart
     * Get user's cart
     */
    getCart = asyncHandler(async (req: Request, res: Response) => {
        // User ID from auth middleware (assuming it's set)
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const cart = await this.cartService.getCart(userId);

        res.status(200).json({
            success: true,
            data: cart,
        });
    });

    /**
     * POST /cart/items
     * Add item to cart
     */
    addToCart = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { productId, quantity } = req.body as AddToCartRequest;
        const cart = await this.cartService.addToCart(userId, productId, quantity);

        res.status(200).json({
            success: true,
            data: cart,
        });
    });

    /**
     * PUT /cart/items/:productId
     * Update cart item quantity
     */
    updateCartItem = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { productId } = req.params as { productId: string };
        const { quantity } = req.body as UpdateCartItemRequest;
        const cart = await this.cartService.updateCartItem(userId, productId, quantity);

        res.status(200).json({
            success: true,
            data: cart,
        });
    });

    /**
     * DELETE /cart/items/:productId
     * Remove item from cart
     */
    removeCartItem = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { productId } = req.params as { productId: string };
        const cart = await this.cartService.removeCartItem(userId, productId);

        res.status(200).json({
            success: true,
            data: cart,
        });
    });
}