import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";
import slugify from "slugify";

/**
 * GET CATEGORIES SERVICE
 * Lấy danh sách danh mục sản phẩm + search + pagination
 */
export const getCategories = async (query: {
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}) => {
    const {
        search,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        order = "desc",
    } = query;

    // Build điều kiện truy vấn
    const where: Prisma.CategoryWhereInput = {};

    // Search theo name hoặc slug
    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                },
            },
            {
                slug: {
                    contains: search,
                },
            },
        ];
    }

    // Chuyển page/limit từ query string sang số
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    // Chọn trường sort an toàn
    const allowedSort = ["name", "createdAt"];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "createdAt";

    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [safeSortBy]: order,
            },
        }),
        prisma.category.count({ where }),
    ]);

    return {
        data: categories,
        meta: {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    };
};

/**
 * CREATE CATEGORY SERVICE
 * Tạo danh mục sản phẩm mới
 */
export const createCategory = async (data: { name: string }) => {
    const { name } = data;

    // Tạo slug từ name
    const slug = slugify(name, { lower: true });

    // Kiểm tra slug đã tồn tại chưa
    const existing = await prisma.category.findUnique({
        where: { slug },
    });

    if (existing) {
        throw new Error("Category slug already exists");
    }

    // Tạo category mới
    return await prisma.category.create({
        data: {
            name,
            slug,
        },
    });
};

/**
 * EDIT CATEGORY SERVICE
 * Sửa thông tin danh mục sản phẩm
 */
export const editCategory = async (id: number, data: { name?: string }) => {
    // Validate id
    if (!id || isNaN(id)) {
        throw new Error("Invalid category id");
    }

    // Lấy category hiện tại
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const updateData: any = {};

    if (data.name) {
        const slug = slugify(data.name, { lower: true });

        // Check slug mới có trùng với category khác không
        const existingSlug = await prisma.category.findFirst({
            where: {
                slug,
                NOT: {
                    id,
                },
            },
        });

        if (existingSlug) {
            throw new Error("Category slug already exists");
        }

        updateData.name = data.name;
        updateData.slug = slug;
    }

    // Nếu không có field nào cần cập nhật, trả về category hiện tại
    if (Object.keys(updateData).length === 0) {
        return category;
    }

    // Cập nhật category
    return await prisma.category.update({
        where: { id },
        data: updateData,
    });
};

/**
 * DELETE CATEGORY SERVICE
 * Xóa danh mục sản phẩm
 */
export const deleteCategory = async (id: number) => {
    // Validate id
    if (!id || isNaN(id)) {
        throw new Error("Invalid category id");
    }

    // Kiểm tra category tồn tại
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // Kiểm tra xem có sản phẩm liên kết với category này không
    const productsCount = await prisma.product.count({
        where: { categoryId: id },
    });

    if (productsCount > 0) {
        throw new Error("Cannot delete category while products are assigned to it");
    }

    // Xóa category
    return await prisma.category.delete({
        where: { id },
    });
};
