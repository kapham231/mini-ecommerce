import { z } from "zod";

export const createPresignedUploadSchema = z.object({
    fileName: z.string().min(1, "File name is required"),
    contentType: z.string().min(1, "Content type is required"),
});

export type CreatePresignedUploadRequest = z.infer<typeof createPresignedUploadSchema>;

export interface PresignedUploadResponse {
    uploadUrl: string;
    fileUrl: string;
    key: string;
    expiresIn: number;
}
