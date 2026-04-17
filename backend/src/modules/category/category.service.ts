/**
 * Category Module Service
 */

import slugify from "slugify";
import { prisma } from "../../shared/prisma/client";
import { NotFoundError, ConflictError } from "../../shared/types/error";
import { CreateCategoryRequest, UpdateCategoryRequest, CategoryDTO } from "./category.types";

export class CategoryService {
    async getCategories(): Promise<CategoryDTO[]> {
        return prisma.category.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                slug: true,
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
        const slug = slugify(data.name, { lower: true });

        const existingCategory = await prisma.category.findUnique({
            where: { slug },
        });

        if (existingCategory) {
            throw new ConflictError("Category with this name already exists");
        }

        return prisma.category.create({
            data: {
                name: data.name,
                slug,
            },
            select: {
                id: true,
                name: true,
                slug: true,
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
            updateData.name = data.name;
            updateData.slug = slugify(data.name, { lower: true });
        }

        return prisma.category.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                slug: true,
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
