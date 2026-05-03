import { z } from "zod";

export const createAddressSchema = z.object({
    receiverName: z.string().min(2, "Receiver name is required"),
    phone: z.string().regex(/^[0-9]{9,11}$/, "Invalid phone number"),
    province: z.string().min(1, "Province is required"),
    district: z.string().min(1, "District is required"),
    ward: z.string().min(1, "Ward is required"),
    detail: z.string().min(1, "Detail address is required"),
    isDefault: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export const addressIdParamSchema = z.object({
    id: z.string().uuid("Invalid address ID"),
});

export type CreateAddressRequest = z.infer<typeof createAddressSchema>;
export type UpdateAddressRequest = z.infer<typeof updateAddressSchema>;

export interface AddressDTO {
    id: string;
    userId: string;
    receiverName: string;
    phone: string;
    province: string;
    district: string;
    ward: string;
    detail: string;
    isDefault: boolean;
}
