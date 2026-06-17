import type { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export function getAccessTokenCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000,
    };
}

export function getRefreshTokenCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

export function getClearAuthCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    };
}
