import { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
    count: number;
    firstRequestAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const cleanExpiredEntries = (windowMs: number) => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now - entry.firstRequestAt > windowMs) {
            rateLimitStore.delete(key);
        }
    }
};

const createRateLimiter = (
    windowMs: number,
    maxRequests: number,
    message: string
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const key = `${req.ip}:${req.path}`;
        const now = Date.now();

        cleanExpiredEntries(windowMs);

        const entry = rateLimitStore.get(key);

        if (!entry) {
            rateLimitStore.set(key, { count: 1, firstRequestAt: now });
            return next();
        }

        if (now - entry.firstRequestAt > windowMs) {
            rateLimitStore.set(key, { count: 1, firstRequestAt: now });
            return next();
        }

        if (entry.count >= maxRequests) {
            return res.status(429).json({
                success: false,
                message,
                statusCode: 429,
                timestamp: new Date().toISOString(),
            });
        }

        entry.count += 1;
        rateLimitStore.set(key, entry);
        next();
    };
};

export const authRateLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    5,
    "Too many authentication attempts, please try again later."
);

export const uploadRateLimiter = createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    30,
    "Too many upload requests, please try again later."
);
