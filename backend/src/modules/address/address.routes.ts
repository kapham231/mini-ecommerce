import { Router } from "express";
import { AddressController } from "./address.controller";
import { AddressService } from "./address.service";
import { authMiddleware } from "../../shared/middleware/auth.middleware";
import { validate } from "../../shared/middleware/validation.middleware";
import { createAddressSchema, updateAddressSchema, addressIdParamSchema } from "./address.types";

export function createAddressRouter(): Router {
    const router = Router();
    const service = new AddressService();
    const controller = new AddressController(service);

    // All routes require authentication
    router.use(authMiddleware);

    router.get("/", controller.getAddresses);

    router.post("/", 
        validate({ body: createAddressSchema }), 
        controller.createAddress
    );

    router.patch("/:id", 
        validate({ params: addressIdParamSchema, body: updateAddressSchema }), 
        controller.updateAddress
    );

    router.delete("/:id", 
        validate({ params: addressIdParamSchema }), 
        controller.deleteAddress
    );

    router.patch("/:id/default", 
        validate({ params: addressIdParamSchema }), 
        controller.setDefaultAddress
    );

    return router;
}
