import { Request, Response } from "express";
import * as productService from "../services/product.service";


/**
 * Controller lấy toàn bộ sản phẩm có hỗ trợ search + filter
 */
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getProducts(req.query);
        res.json(products);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller lấy thông tin sản phẩm dựa trên ID của sản phẩm
 */
export const getProductbyId = async (req: Request, res: Response) => {
    try {
        const product = await productService.getProduct(+req.params.id);
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller tạo sản phẩm
 */
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await productService.createProduct(req.body);
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};