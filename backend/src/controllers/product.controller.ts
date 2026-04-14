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
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await productService.getProduct(id);
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
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await productService.deleteProduct(id);
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller sửa thống tin sản phẩm dựa trên ID của sản phẩm
 */
export const editProduct = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await productService.editProduct(id, req.body);
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller xóa sản phẩm dựa trên ID của sản phẩm
 */
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const product = await productService.deleteProduct(id);
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};