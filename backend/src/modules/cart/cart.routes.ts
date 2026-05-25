/**
 * Cart Module Routes
 *
 * Defines API endpoints for the cart module.
 * Uses validation and async handler for consistency.
 */

import { Router } from "express";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { validate } from "../../shared/middleware/validation.middleware";
import { authMiddleware } from "../../shared/middleware";
import {
    addToCartSchema,
    updateCartItemSchema,
    productIdParamSchema,
} from "./cart.types";

export function createCartRouter(): Router {
    const router = Router();

    // Instantiate service and controller
    const cartService = new CartService();
    const cartController = new CartController(cartService);

    // All cart routes require authentication
    router.use(authMiddleware);

    // Routes
    router.get("/", cartController.getCart);

    router.post(
        "/items",
        validate({ body: addToCartSchema }),
        cartController.addToCart
    );

    router.put(
        "/items/:productId",
        validate({
            params: productIdParamSchema,
            body: updateCartItemSchema
        }),
        cartController.updateCartItem
    );

    router.delete(
        "/items/:productId",
        validate({ params: productIdParamSchema }),
        cartController.removeCartItem
    );

    return router;
}