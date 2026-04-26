/**
 * Product Module Service
 * 
 * Core business logic for products.
 * Note: Services are completely isolated and only communicate with Prisma.
 * If other modules need product data, they use the public methods here.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "../../shared/prisma/client";
import { generateUniqueSlug } from "../../shared/utils";
import {
    NotFoundError,
    ValidationError,
    ConflictError,
} from "../../shared/types/error";
import {
    ProductQuery,
    CreateProductRequest,
    UpdateProductRequest,
    ProductDTO,
} from "./product.types";
import { PaginatedResponse } from "../../common/types/pagination";

/**
 * Map Prisma product (with Decimal price) to ProductDTO (with number price)
 */
function mapToProductDTO(product: any): ProductDTO {
    return {
        ...product,
        price: product.price.toNumber(),
    };
}

export class ProductService {
    /**
     * Get all products with filters and pagination
     */
    async getProducts(query: ProductQuery): Promise<PaginatedResponse<ProductDTO>> {
        const { search, minPrice, maxPrice, categoryId, page, limit, sortBy, order } = query;

        const where: Prisma.ProductWhereInput = {
            isActive: true,
        };

        // Search in name and description
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        // Price range filter
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice !== undefined) where.price.gte = minPrice;
            if (maxPrice !== undefined) where.price.lte = maxPrice;
        }

        // Category filter
        if (categoryId) {
            where.categoryId = categoryId;
        }

        // Get total count
        const total = await prisma.product.count({ where });

        // Fetch paginated products
        const products = await prisma.product.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                [sortBy]: order,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                stock: true,
                categoryId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return {
            data: products.map(mapToProductDTO),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get single product by ID
     */
    async getProductById(id: string): Promise<ProductDTO> {
        const product = await prisma.product.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                stock: true,
                categoryId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        return mapToProductDTO(product);
    }

    /**
     * Create new product
     */
    async createProduct(data: CreateProductRequest): Promise<ProductDTO> {
        // Validate category exists
        const category = await prisma.category.findUnique({
            where: { id: data.categoryId },
        });

        if (!category) {
            throw new ValidationError("Category not found");
        }

        // Check if product name already exists (case-insensitive)
        const existingProduct = await prisma.product.findFirst({
            where: { name: data.name },
        });

        if (existingProduct) {
            throw new ConflictError("Product with this name already exists");
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(data.name, async (slug) => {
            const existing = await prisma.product.findUnique({ where: { slug } });
            return !!existing;
        });

        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug,
                description: data.description || null,
                price: new Prisma.Decimal(data.price),
                stock: data.stock,
                categoryId: data.categoryId,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                stock: true,
                categoryId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return mapToProductDTO(product);
    }

    /**
     * Update product
     */
    async updateProduct(
        id: string,
        data: UpdateProductRequest
    ): Promise<ProductDTO> {
        // Verify product exists
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundError("Product not found");
        }

        // Validate category if provided
        if (data.categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!category) {
                throw new ValidationError("Category not found");
            }
        }

        const updateData: Prisma.ProductUpdateInput = {};

        if (data.name) {
            // Check name uniqueness if name is being changed
            if (data.name !== product.name) {
                const existingProduct = await prisma.product.findFirst({
                    where: {
                        name: data.name,
                        id: { not: id }
                    },
                });
                if (existingProduct) {
                    throw new ConflictError("Product with this name already exists");
                }
            }

            updateData.name = data.name;

            // Generate new unique slug if name changed
            const slug = await generateUniqueSlug(data.name, async (slug) => {
                const existing = await prisma.product.findFirst({
                    where: { slug, id: { not: id } }
                });
                return !!existing;
            });
            updateData.slug = slug;
        }
        if (data.description !== undefined) updateData.description = data.description;
        if (data.price) updateData.price = new Prisma.Decimal(data.price);
        if (data.stock !== undefined) updateData.stock = data.stock;
        if (data.categoryId) updateData.category = { connect: { id: data.categoryId } };
        if (data.isActive !== undefined) updateData.isActive = data.isActive;
        updateData.updatedAt = new Date();

        const updated = await prisma.product.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                price: true,
                stock: true,
                categoryId: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return mapToProductDTO(updated);
    }

    /**
     * Delete product (soft delete)
     */
    async deleteProduct(id: string): Promise<void> {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            throw new NotFoundError("Product not found");
        }

        await prisma.product.update({
            where: { id },
            data: { isActive: false, updatedAt: new Date() },
        });
    }

    /**
     * Get product inventory (useful for other modules like orders)
     * Public method that other modules can call
     */
    async checkInventory(productId: string, quantity: number): Promise<boolean> {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stock: true },
        });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        return product.stock >= quantity;
    }

    /**
     * Update inventory (useful for other modules)
     * This could be called by order module after order is placed
     */
    async updateInventory(productId: string, quantityChange: number): Promise<void> {
        const product = await prisma.product.findUnique({
            where: { id: productId },
            select: { stock: true },
        });

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        const newStock = product.stock + quantityChange;
        if (newStock < 0) {
            throw new ValidationError("Insufficient inventory");
        }

        await prisma.product.update({
            where: { id: productId },
            data: { stock: newStock, updatedAt: new Date() },
        });
    }
}
