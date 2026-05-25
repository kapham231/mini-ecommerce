import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import { ValidationError } from "../../shared/types/error";
import { CreatePresignedUploadRequest, PresignedUploadResponse } from "./upload.types";

const ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

const PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS = 60;

function sanitizeFileName(fileName: string): string {
    return fileName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "");
}

export class UploadService {
    private readonly bucketName?: string;
    private readonly publicBaseUrl?: string;
    private readonly region?: string;
    private readonly s3Client: S3Client;

    constructor() {
        this.region = process.env.AWS_REGION;
        this.bucketName = process.env.AWS_S3_BUCKET;
        this.publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, "");
        this.s3Client = new S3Client({ region: this.region });
    }

    async createPresignedUpload(data: CreatePresignedUploadRequest): Promise<PresignedUploadResponse> {
        if (!this.region || !this.bucketName || !this.publicBaseUrl) {
            throw new ValidationError("Missing AWS S3 configuration");
        }

        if (!data.contentType.startsWith("image/")) {
            throw new ValidationError("Only image uploads are allowed");
        }

        if (!ALLOWED_IMAGE_TYPES.has(data.contentType)) {
            throw new ValidationError("Unsupported image format");
        }

        const safeFileName = sanitizeFileName(data.fileName);
        if (!safeFileName) {
            throw new ValidationError("Invalid file name");
        }

        const key = `products/${uuidv4()}-${safeFileName}`;
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: data.contentType,
        });

        const uploadUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
        });

        return {
            uploadUrl,
            fileUrl: `${this.publicBaseUrl}/${key}`,
            key,
            expiresIn: PRESIGNED_UPLOAD_EXPIRES_IN_SECONDS,
        };
    }
}
