/**
 * Category Module Routes
 */

import { Router } from "express";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";
import { validate } from "../../shared/middleware/validation.middleware";
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdParamSchema,
} from "./category.types";

export function createCategoryRouter(): Router {
    const router = Router();

    const categoryService = new CategoryService();
    const categoryController = new CategoryController(categoryService);

    router.get("/", categoryController.getCategories);

    router.get(
        "/:id",
        validate({ params: categoryIdParamSchema }),
        categoryController.getCategoryById
    );

    router.post(
        "/",
        validate({ body: createCategorySchema }),
        categoryController.createCategory
    );

    router.put(
        "/:id",
        validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
        categoryController.updateCategory
    );

    router.delete(
        "/:id",
        validate({ params: categoryIdParamSchema }),
        categoryController.deleteCategory
    );

    return router;
}

export default createCategoryRouter();
