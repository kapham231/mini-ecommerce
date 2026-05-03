import { prisma } from "../../shared/prisma/client";
import { NotFoundError, ForbiddenError } from "../../shared/types/error";
import { CreateAddressRequest, UpdateAddressRequest, AddressDTO } from "./address.types";

export class AddressService {
    /**
     * Get all addresses of a user
     */
    async getAddresses(userId: string): Promise<AddressDTO[]> {
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: "desc" },
        });
        return addresses as AddressDTO[];
    }

    /**
     * Create a new address
     */
    async createAddress(userId: string, data: CreateAddressRequest): Promise<AddressDTO> {
        // Check if this is the first address
        const count = await prisma.address.count({ where: { userId } });
        
        // If first address or data.isDefault is true, handle default logic
        const isDefault = count === 0 ? true : data.isDefault;

        if (isDefault) {
            await this.clearDefaults(userId);
        }

        const address = await prisma.address.create({
            data: {
                ...data,
                userId,
                isDefault,
            },
        });

        return address as AddressDTO;
    }

    /**
     * Update an address
     */
    async updateAddress(userId: string, addressId: string, data: UpdateAddressRequest): Promise<AddressDTO> {
        const address = await this.findAndVerifyOwner(userId, addressId);

        if (data.isDefault === true && !address.isDefault) {
            await this.clearDefaults(userId);
        }

        const updated = await prisma.address.update({
            where: { id: addressId },
            data,
        });

        return updated as AddressDTO;
    }

    /**
     * Delete an address
     */
    async deleteAddress(userId: string, addressId: string): Promise<void> {
        const address = await this.findAndVerifyOwner(userId, addressId);

        await prisma.address.delete({
            where: { id: addressId },
        });

        // If the deleted address was default, set another one as default
        if (address.isDefault) {
            const nextAddress = await prisma.address.findFirst({
                where: { userId },
            });
            if (nextAddress) {
                await prisma.address.update({
                    where: { id: nextAddress.id },
                    data: { isDefault: true },
                });
            }
        }
    }

    /**
     * Set an address as default
     */
    async setDefaultAddress(userId: string, addressId: string): Promise<AddressDTO> {
        await this.findAndVerifyOwner(userId, addressId);

        await this.clearDefaults(userId);

        const updated = await prisma.address.update({
            where: { id: addressId },
            data: { isDefault: true },
        });

        return updated as AddressDTO;
    }

    /**
     * Helper: Clear all default addresses for a user
     */
    private async clearDefaults(userId: string): Promise<void> {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }

    /**
     * Helper: Find address and verify it belongs to user
     */
    private async findAndVerifyOwner(userId: string, addressId: string) {
        const address = await prisma.address.findUnique({
            where: { id: addressId },
        });

        if (!address) {
            throw new NotFoundError("Address not found");
        }

        if (address.userId !== userId) {
            throw new ForbiddenError("You don't have permission to modify this address");
        }

        return address;
    }
}
