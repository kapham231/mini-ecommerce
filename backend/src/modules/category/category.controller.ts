/**
 * Category Module Controller
 */

import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { CreateCategoryRequest, UpdateCategoryRequest } from "./category.types";

export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    getCategories = asyncHandler(async (_req: Request, res: Response) => {
        const categories = await this.categoryService.getCategories();
        res.status(200).json({
            success: true,
            data: categories,
        });
    });

    getCategoryById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const category = await this.categoryService.getCategoryById(id);
        res.status(200).json({
            success: true,
            data: category,
        });
    });

    createCategory = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as CreateCategoryRequest;
        const category = await this.categoryService.createCategory(data);
        res.status(201).json({
            success: true,
            data: category,
        });
    });

    updateCategory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const data = req.body as UpdateCategoryRequest;
        const category = await this.categoryService.updateCategory(id, data);
        res.status(200).json({
            success: true,
            data: category,
        });
    });

    deleteCategory = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        await this.categoryService.deleteCategory(id);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    });
}
