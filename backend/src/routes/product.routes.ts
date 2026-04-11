import { Router } from "express";
import * as productController from "../controllers/product.controller";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductbyId);
router.post("/", productController.createProduct);
router.put("/:id", productController.editProduct);
router.delete("/:id", productController.deleteProduct);

export default router;