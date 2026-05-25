/**
 * Order Module Routes
 *
 * Defines API endpoints for the order module.
 * Uses validation and async handler for consistency.
 */

import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { validate } from "../../shared/middleware/validation.middleware";
import { authMiddleware, adminMiddleware } from "../../shared/middleware";
import {
    checkoutSchema,
    updateOrderStatusSchema,
    orderQuerySchema,
    orderIdParamSchema,
} from "./order.types";

export function createOrderRouter(): Router {
    const router = Router();

    // Instantiate service and controller
    const orderService = new OrderService();
    const orderController = new OrderController(orderService);

    // All order routes require authentication
    router.use(authMiddleware);

    // Routes
    router.get(
        "/",
        validate({ query: orderQuerySchema }),
        orderController.getOrders
    );

    router.get(
        "/:id",
        validate({ params: orderIdParamSchema }),
        orderController.getOrderById
    );

    router.post(
        "/checkout",
        validate({ body: checkoutSchema }),
        orderController.checkout
    );

    router.patch(
        "/:id",
        adminMiddleware,
        validate({
            params: orderIdParamSchema,
            body: updateOrderStatusSchema
        }),
        orderController.updateOrderStatus
    );

    return router;
}