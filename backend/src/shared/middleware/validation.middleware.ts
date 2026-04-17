/**
 * Request Validation Middleware
 * 
 * Uses Zod for schema validation. Validates request body, query, and params.
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../types/error";

export interface ValidateOptions {
    body?: ZodSchema;
    query?: ZodSchema;
    params?: ZodSchema;
}

export const validate = (options: ValidateOptions) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate body
            if (options.body) {
                const parsedBody = await options.body.parseAsync(req.body);
                req.body = parsedBody;
            }

            // Validate query
            if (options.query) {
                const parsedQuery = await options.query.parseAsync(req.query);
                req.query = parsedQuery as any;
            }

            // Validate params
            if (options.params) {
                const parsedParams = await options.params.parseAsync(req.params);
                req.params = parsedParams as any;
            }

            next();
        } catch (error: any) {
            const details = error.errors || error.message;
            throw new ValidationError("Validation failed", details);
        }
    };
};
