/**
 * Product Module Controller
 * 
 * Handles HTTP requests and delegates to service.
 * Controllers should not contain business logic or database queries.
 */

import { Request, Response } from "express";
import { ProductService } from "./product.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { ProductQuery, CreateProductRequest, UpdateProductRequest } from "./product.types";

export class ProductController {
    constructor(private productService: ProductService) { }

    /**
     * GET /products
     * Get all products with filtering and pagination
     */
    getProducts = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as ProductQuery;
        const result = await this.productService.getProducts(query);

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    });

    /**
     * GET /products/:id
     */
    getProductById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const product = await this.productService.getProductById(id);

        res.status(200).json({
            success: true,
            data: product,
        });
    });

    /**
     * POST /products
     */
    createProduct = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as CreateProductRequest;
        const product = await this.productService.createProduct(data);

        res.status(201).json({
            success: true,
            data: product,
        });
    });

    /**
     * PUT /products/:id
     */
    updateProduct = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const data = req.body as UpdateProductRequest;
        const product = await this.productService.updateProduct(id, data);

        res.status(200).json({
            success: true,
            data: product,
        });
    });

    /**
     * DELETE /products/:id
     */
    deleteProduct = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        await this.productService.deleteProduct(id);

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    });
}
