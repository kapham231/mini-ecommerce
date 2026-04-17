/**
 * Product Module Routes
 * 
 * Defines API endpoints for the product module.
 * Uses validation and async handler for consistency.
 */

import { Router } from "express";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { validate } from "../../shared/middleware/validation.middleware";
import {
  productQuerySchema,
  createProductSchema,
  updateProductSchema,
  productIdParamSchema,
} from "./product.types";

export function createProductRouter(): Router {
  const router = Router();

  // Instantiate service and controller
  const productService = new ProductService();
  const productController = new ProductController(productService);

  // Routes
  router.get(
    "/",
    validate({ query: productQuerySchema }),
    productController.getProducts
  );

  router.get(
    "/:id",
    validate({ params: productIdParamSchema }),
    productController.getProductById
  );

  router.post(
    "/",
    validate({ body: createProductSchema }),
    productController.createProduct
  );

  router.put(
    "/:id",
    validate({ params: productIdParamSchema, body: updateProductSchema }),
    productController.updateProduct
  );

  router.delete(
    "/:id",
    validate({ params: productIdParamSchema }),
    productController.deleteProduct
  );

  return router;
}

export default createProductRouter();
