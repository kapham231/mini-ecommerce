import { Router } from "express";
import * as authController from "../controllers/auth.controller";

const router = Router();

/**
 * POST /auth/register
 * Dùng để đăng ký tài khoản
 */
router.post("/register", authController.register);

/**
 * POST /auth/login
 * Dùng để đăng nhập
 */
router.post("/login", authController.login);

export default router;