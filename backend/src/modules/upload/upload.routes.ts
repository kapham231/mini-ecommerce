import { Router } from "express";
import { authMiddleware, uploadRateLimiter } from "../../shared/middleware";
import { validate } from "../../shared/middleware/validation.middleware";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";
import { createPresignedUploadSchema } from "./upload.types";

export function createUploadRouter(): Router {
    const router = Router();

    const uploadService = new UploadService();
    const uploadController = new UploadController(uploadService);

    router.post(
        "/presign",
        authMiddleware,
        uploadRateLimiter,
        validate({ body: createPresignedUploadSchema }),
        uploadController.createPresignedUpload
    );

    return router;
}

export default createUploadRouter();
