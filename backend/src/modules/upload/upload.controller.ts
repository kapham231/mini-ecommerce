import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { CreatePresignedUploadRequest } from "./upload.types";
import { UploadService } from "./upload.service";

export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    createPresignedUpload = asyncHandler(async (req: Request, res: Response) => {
        const payload = req.body as CreatePresignedUploadRequest;
        const result = await this.uploadService.createPresignedUpload(payload);

        res.status(200).json({
            success: true,
            data: result,
        });
    });
}
