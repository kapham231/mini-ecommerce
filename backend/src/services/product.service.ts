import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";
import slugify from "slugify";

/**
 * GET PRODUCTS SERVICE
 * Lấy danh sách sản phẩm + search + filter + pagination
 */
export const getProducts = async (query: {
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    order?: "asc" | "desc";
}) => {
    const {
        search,
        minPrice,
        maxPrice,
        categoryId,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        order = "desc",
    } = query;

    const where: Prisma.ProductWhereInput = {
        isActive: true, // chỉ lấy sản phẩm đang bán
    };

    // Search (name + description)
    if (search) {
        where.OR = [
            {
                name: {
                    contains: search,
                },
            },
            {
                description: {
                    contains: search,
                },
            },
        ];
    }

    // Price filter (Decimal)
    const priceFilter: Prisma.DecimalFilter = {};

    if (minPrice) {
        priceFilter.gte = new Prisma.Decimal(minPrice);
    }

    if (maxPrice) {
        priceFilter.lte = new Prisma.Decimal(maxPrice);
    }

    if (Object.keys(priceFilter).length > 0) {
        where.price = priceFilter;
    }

    // Category filter
    if (categoryId) {
        where.categoryId = Number(categoryId);
    }

    // Pagination
    const pageNumber = Number(page);
    const pageSize = Number(limit);

    // Safe sort
    const allowedSort = ["price", "createdAt", "name"];
    const safeSortBy = allowedSort.includes(sortBy) ? sortBy : "createdAt";

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            include: {
                category: true, // lấy luôn category
            },
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [safeSortBy]: order,
            },
        }),
        prisma.product.count({ where }),
    ]);

    return {
        data: products,
        meta: {
            total,
            page: pageNumber,
            limit: pageSize,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}

/**
 * CREATE PRODUCT SERVICE
 * Tạo sản phẩm
 */
export const createProduct = async (data: {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    categoryId: number;
}) => {
    const { name, description, price, stock = 0, imageUrl, categoryId } = data;

    // tạo slug
    const slug = slugify(name, { lower: true });

    // check slug trùng
    const existing = await prisma.product.findUnique({
        where: { slug },
    });

    if (existing) {
        throw new Error("Product slug already exists");
    }

    const product = await prisma.product.create({
        data: {
            name,
            slug,
            description,
            price: new Prisma.Decimal(price),
            stock,
            imageUrl,
            categoryId,
        },
    });

    return product;
}

/**
 * GET PRODUCT INFORMATION
 * Lấy thông tin chi tiết của 1 sản phẩm
 */
export const getProduct = async (id: number) => {
    // Kiểm tra id
    if (!id || isNaN(id)) {
        throw new Error("Invalid product id");
    }

    // Query product
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true, // lấy luôn category
        },
    });

    // Check tồn tại
    if (!product || !product.isActive) {
        throw new Error("Product not found");
    }

    // Convert Decimal -> number
    return {
        ...product,
        price: Number(product.price),
    };
}