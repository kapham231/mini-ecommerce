/**
 * Category Module Service
 */

import { prisma } from "../../shared/prisma/client";
import { NotFoundError, ConflictError } from "../../shared/types/error";
import { generateUniqueSlug } from "../../shared/utils";
import { CreateCategoryRequest, UpdateCategoryRequest, CategoryDTO } from "./category.types";

export class CategoryService {
    async getCategories(): Promise<CategoryDTO[]> {
        return prisma.category.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        }) as Promise<CategoryDTO[]>;
    }

    async getCategoryById(id: string): Promise<CategoryDTO> {
        const category = await prisma.category.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        return category as CategoryDTO;
    }

    async createCategory(data: CreateCategoryRequest): Promise<CategoryDTO> {
        // Check if category name already exists (case-insensitive)
        const existingCategory = await prisma.category.findFirst({
            where: { name: { equals: data.name, mode: "insensitive" } },
        });

        if (existingCategory) {
            throw new ConflictError("Category with this name already exists");
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(data.name, async (slug) => {
            const existing = await prisma.category.findUnique({ where: { slug } });
            return !!existing;
        });

        return prisma.category.create({
            data: {
                name: data.name,
                slug,
                description: data.description || null,
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        }) as Promise<CategoryDTO>;
    }

    async updateCategory(id: string, data: UpdateCategoryRequest): Promise<CategoryDTO> {
        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        const updateData: any = {};

        if (data.name) {
            // Check name uniqueness if name is being changed
            if (data.name !== category.name) {
                const existingCategory = await prisma.category.findFirst({
                    where: {
                        name: { equals: data.name, mode: "insensitive" },
                        id: { not: id }
                    },
                });
                if (existingCategory) {
                    throw new ConflictError("Category with this name already exists");
                }
            }

            updateData.name = data.name;

            // Generate new unique slug if name changed
            const slug = await generateUniqueSlug(data.name, async (slug) => {
                const existing = await prisma.category.findFirst({
                    where: { slug, id: { not: id } }
                });
                return !!existing;
            });
            updateData.slug = slug;
        }

        if (data.description !== undefined) {
            updateData.description = data.description;
        }

        if (data.isActive !== undefined) {
            updateData.isActive = data.isActive;
        }

        return prisma.category.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                isActive: true,
                createdAt: true,
                updatedAt: true,
            },
        }) as Promise<CategoryDTO>;
    }

    async deleteCategory(id: string): Promise<void> {
        const category = await prisma.category.findUnique({ where: { id } });

        if (!category) {
            throw new NotFoundError("Category not found");
        }

        await prisma.category.delete({ where: { id } });
    }
}
