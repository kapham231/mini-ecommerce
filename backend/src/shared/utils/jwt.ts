/**
 * JWT Token Generation Utility
 * 
 * Centralized JWT token generation used by auth and other modules.
 */

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

if (!REFRESH_TOKEN_SECRET) {
    throw new Error("REFRESH_TOKEN_SECRET environment variable is required");
}

/**
 * Generate access token
 */
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "3d",
    });
};

/**
 * Verify access token
 */
export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error("Invalid token");
    }
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new Error("Invalid refresh token");
    }
};
