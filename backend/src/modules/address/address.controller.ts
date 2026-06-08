import { Request, Response } from "express";
import { AddressService } from "./address.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { CreateAddressRequest, UpdateAddressRequest } from "./address.types";

export class AddressController {
    constructor(private addressService: AddressService) { }

    /**
     * GET /addresses
     */
    getAddresses = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id as string;
        const addresses = await this.addressService.getAddresses(userId);

        res.status(200).json({
            success: true,
            data: addresses,
        });
    });

    /**
     * POST /addresses
     */
    createAddress = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id as string;
        const data = req.body as CreateAddressRequest;
        const address = await this.addressService.createAddress(userId, data);

        res.status(201).json({
            success: true,
            data: address,
        });
    });

    /**
     * PATCH /addresses/:id
     */
    updateAddress = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id as string;
        const id = req.params.id as string;
        const data = req.body as UpdateAddressRequest;
        const address = await this.addressService.updateAddress(userId, id, data);

        res.status(200).json({
            success: true,
            data: address,
        });
    });

    /**
     * DELETE /addresses/:id
     */
    deleteAddress = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id as string;
        const id = req.params.id as string;
        await this.addressService.deleteAddress(userId, id);

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
        });
    });

    /**
     * PATCH /addresses/:id/default
     */
    setDefaultAddress = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user?.id as string;
        const id = req.params.id as string;
        const address = await this.addressService.setDefaultAddress(userId, id);

        res.status(200).json({
            success: true,
            data: address,
        });
    });
}
