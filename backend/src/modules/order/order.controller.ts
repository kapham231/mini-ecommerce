/**
 * Order Module Controller
 *
 * Handles HTTP requests and delegates to service.
 * Controllers should not contain business logic or database queries.
 */

import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { CheckoutRequest, UpdateOrderStatusRequest, OrderQuery } from "./order.types";

export class OrderController {
    constructor(private orderService: OrderService) { }

    /**
     * GET /orders
     * Get user's orders with pagination
     */
    getOrders = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const query = req.query as unknown as OrderQuery;
        const result = await this.orderService.getOrders(userId, query);

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    });

    /**
     * GET /orders/:id
     * Get single order
     */
    getOrderById = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = req.params as { id: string };
        const order = await this.orderService.getOrderById(userId, id);

        res.status(200).json({
            success: true,
            data: order,
        });
    });

    /**
     * POST /orders/checkout
     * Checkout cart and create order
     */
    checkout = asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { address, phone } = req.body as CheckoutRequest;
        const order = await this.orderService.checkout(userId, address, phone);

        res.status(201).json({
            success: true,
            data: order,
        });
    });

    /**
     * PATCH /orders/:id
     * Update order status (admin only)
     */
    updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const { status } = req.body as UpdateOrderStatusRequest;

        const order = await this.orderService.updateOrderStatus(id, status);

        res.status(200).json({
            success: true,
            data: order,
        });
    });
}