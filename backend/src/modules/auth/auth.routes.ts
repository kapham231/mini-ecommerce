/**
 * Auth Module Routes
 * 
 * Defines API endpoints for the auth module.
 */

import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { validate } from "../../shared/middleware/validation.middleware";
import { registerSchema, loginSchema } from "./auth.types";

export function createAuthRouter(): Router {
  const router = Router();

  // Instantiate service and controller (DI pattern)
  const authService = new AuthService();
  const authController = new AuthController(authService);

  // Routes
  router.post(
    "/register",
    validate({ body: registerSchema }),
    authController.register
  );

  router.post(
    "/login",
    validate({ body: loginSchema }),
    authController.login
  );

  return router;
}

export default createAuthRouter();
