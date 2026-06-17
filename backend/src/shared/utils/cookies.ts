import type { CookieOptions } from "express";
import { env } from "./env";

function isCrossSiteAuthDeployment() {
    try {
        return new URL(env.FRONTEND_URL).origin !== new URL(env.CALLBACK_URL_HOST).origin;
    } catch {
        return false;
    }
}

const useSecureCrossSiteCookies =
    process.env.NODE_ENV === "production" || isCrossSiteAuthDeployment();

export function getAccessTokenCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: useSecureCrossSiteCookies,
        sameSite: useSecureCrossSiteCookies ? "none" : "lax",
        maxAge: 3 * 24 * 60 * 60 * 1000,
    };
}

export function getRefreshTokenCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: useSecureCrossSiteCookies,
        sameSite: useSecureCrossSiteCookies ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

export function getClearAuthCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: useSecureCrossSiteCookies,
        sameSite: useSecureCrossSiteCookies ? "none" : "lax",
    };
}
