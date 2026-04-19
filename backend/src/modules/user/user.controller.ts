/**
 * User Module Controller
 * 
 * Handles HTTP requests and delegates to service.
 * Controllers should not contain business logic or database queries.
 */

import { Request, Response } from "express";
import { UserService } from "./user.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { UserQuery, CreateUserRequest, UpdateUserRequest } from "./user.types";

export class UserController {
    constructor(private userService: UserService) { }

    /**
     * GET /users
     */
    getUsers = asyncHandler(async (req: Request, res: Response) => {
        const query = req.query as unknown as UserQuery;
        const result = await this.userService.getUsers(query);

        res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    });

    /**
     * GET /users/:id
     */
    getUserById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const user = await this.userService.getUserById(id);

        res.status(200).json({
            success: true,
            data: user,
        });
    });

    /**
     * POST /users
     */
    createUser = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as CreateUserRequest;
        const user = await this.userService.createUser(data);

        res.status(201).json({
            success: true,
            data: user,
        });
    });

    /**
     * PUT /users/:id
     */
    updateUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        const data = req.body as UpdateUserRequest;
        const user = await this.userService.updateUser(id, data);

        res.status(200).json({
            success: true,
            data: user,
        });
    });

    /**
     * DELETE /users/:id
     */
    deleteUser = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params as { id: string };
        await this.userService.deleteUser(id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    });
};