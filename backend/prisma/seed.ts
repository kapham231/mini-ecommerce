import { Category, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateUniqueSlug } from "../src/shared/utils";

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    /**
     * =========================
     * 1. CREATE USERS
     * =========================
     */

    // Hash password
    const password = await bcrypt.hash("123456", 10);

    // Admin user
    await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@example.com",
            password,
            role: Role.ADMIN,
        },
    });

    // 5 Regular Users
    for (let i = 1; i <= 5; i++) {
        await prisma.user.create({
            data: {
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password,
                role: Role.USER,
            },
        });
    }

    console.log("Users have been seeded");

    /**
   * =========================
   * 2. CREATE CATEGORIES & PRODUCTS
   * =========================
   */

    const categoriesData = [
        { name: "Electronics", description: "Gadgets and devices" },
        { name: "Fashion", description: "Clothing and accessories" },
        { name: "Home & Garden", description: "Furniture and decor" },
        { name: "Sports", description: "Fitness and outdoor gear" },
        { name: "Books", description: "Knowledge and literature" },
    ];

    for (const cat of categoriesData) {
        const categorySlug = await generateUniqueSlug(cat.name, async (slug) => {
            const existing = await prisma.category.findUnique({ where: { slug } });
            return !!existing;
        });

        const category = await prisma.category.create({
            data: {
                name: cat.name,
                slug: categorySlug,
                description: cat.description,
                isActive: true,
            },
        });

        // Create 5 products for each category
        const productsData = [];
        for (let i = 1; i <= 5; i++) {
            const productName = `${cat.name} Product ${i}`;
            const productSlug = await generateUniqueSlug(productName, async (slug) => {
                const existing = await prisma.product.findUnique({ where: { slug } });
                return !!existing;
            });

            productsData.push({
                name: productName,
                slug: productSlug,
                description: `Description for ${productName}`,
                price: Math.floor(Math.random() * 900) + 100,
                stock: Math.floor(Math.random() * 50) + 10,
                categoryId: category.id,
                imageUrl: "https://via.placeholder.com/150",
            });
        }

        await prisma.product.createMany({
            data: productsData,
        });
    }

    console.log("5 categories seeded, each with 5 products (Total 25 products)");
}

/**
 * Run seed
 */
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });