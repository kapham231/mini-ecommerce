import { Request, Response } from "express";
import * as categoryService from "../services/category.service";

/**
 * Controller lấy danh sách category
 * Gọi service với query params để search + pagination
 */
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getCategories(req.query as any);
        res.json(categories);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller tạo category mới
 * Nhận body từ client và gọi service tạo category
 */
export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller sửa category
 * Truyền id trực tiếp từ params vì mô hình ID là UUID string
 */
export const editCategory = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const category = await categoryService.editCategory(id, req.body);
        res.json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller xóa category
 * Truyền id trực tiếp từ params vì mô hình ID là UUID string
 */
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const category = await categoryService.deleteCategory(id);
        res.json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
