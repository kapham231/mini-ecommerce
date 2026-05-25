import { Router } from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { authMiddleware, adminMiddleware } from "../../shared/middleware";
import { validate } from "../../shared/middleware/validation.middleware";
import { createUserSchema, updateUserSchema, userIdParamSchema } from "./user.types";

export function createUserRouter(): Router {
    const router = Router();
    const service = new UserService();
    const controller = new UserController(service);

    // Routes
    router.get("/", authMiddleware, adminMiddleware, controller.getUsers);
    router.get("/:id", authMiddleware, controller.getUserById);
    router.post("/", authMiddleware, adminMiddleware, validate({ body: createUserSchema }), controller.createUser);
    router.put("/:id", authMiddleware, validate({ params: userIdParamSchema, body: updateUserSchema }), controller.updateUser);
    router.delete("/:id", authMiddleware, adminMiddleware, validate({ params: userIdParamSchema }), controller.deleteUser);

    return router;
}
