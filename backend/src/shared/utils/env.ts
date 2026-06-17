import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

function normalizeOriginUrl(url: string) {
    return url.replace(/\/$/, "");
}

const originUrlSchema = z
    .string()
    .url()
    .transform(normalizeOriginUrl);

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("5000"),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    CALLBACK_URL_HOST: originUrlSchema.default("http://localhost:5000"),
    FRONTEND_URL: originUrlSchema.default("http://localhost:3000"),
});

export const env = envSchema.parse(process.env);
