/**
 * Async Request Handler Wrapper
 * 
 * Wraps async route handlers to automatically catch errors and pass to error middleware.
 * This eliminates the need for try-catch blocks in controllers.
 */

import { Request, Response, NextFunction } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (handler: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
