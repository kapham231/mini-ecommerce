import { Category, PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    /**
     * =========================
     * 1. CREATE USERS
     * =========================
     */

    // Hash password
    const password = await bcrypt.hash("123456", 10);

    // Admin user
    const admin = await prisma.user.create({
        data: {
            name: "Admin",
            email: "admin@example.com",
            password,
            role: Role.ADMIN,
        },
    });

    const user = await prisma.user.create({
        data: {
            name: "User",
            email: "user@example.com",
            password,
            role: Role.USER,
        },
    });

    console.log("Users have been seeded");

    /**
   * =========================
   * 2. CREATE CATEGORIES
   * =========================
   */

    const categoriesData = [
        "Laptop",
        "Phone",
        "Tablet",
        "Accessory",
        "Camera",
    ];

    const categories: Category[] = [];

    for (const name of categoriesData) {
        const category = await prisma.category.create({
            data: {
                name,
                slug: name.toLowerCase(),
            },
        });

        categories.push(category);
    }

    console.log("Catgories have been seeded");

    /**
   * =========================
   * 3. CREATE PRODUCTS
   * =========================
   */

    const productsData = Array.from({ length: 15 }).map((_, i) => {
        // Random
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        return {
            name: `Product ${i + 1}`,
            slug: `Product-${i + 1}`,
            description: `Product ${i + 1} description`,
            price: Math.floor(Math.random() * 1000) + 100,
            stock: Math.floor(Math.random() * 50),
            categoryId: randomCategory.id,
            imageUrl: "https://via.placeholder.com/150",
        }
    });

    await prisma.product.createMany({
        data: productsData,
    });

    console.log("Products have been seeded");
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