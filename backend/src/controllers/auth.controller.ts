import { Request, Response } from "express";
import * as authService from "../services/auth.service";

/**
 * Controller đăng ký
 * Nhận request → gọi service → trả response
 */
export const register = async (req: Request, res: Response) => {
    try {
        // req.body chứa dữ liệu từ client gửi lên
        const result = await authService.register(req.body);

        // Tách token ra
        const { token, user } = result;

        // Set token vào cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 ngày
        });

        // Trả về user (KHÔNG trả token)
        res.json(user);

    } catch (error: any) {
        // lỗi thì trả status 400
        res.status(400).json({ message: error.message });
    }
};

/**
 * Controller đăng nhập
 */
export const login = async (req: Request, res: Response) => {
    try {
        const result = await authService.login(req.body);

        // Trả về token
        const { token, user } = result;

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3 * 24 * 60 * 60 * 1000, // 3 ngày
        });

        res.json({ user });

    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};