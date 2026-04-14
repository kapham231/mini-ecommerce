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
        "Action Figures",
        "Building Sets",
        "Dolls",
        "Puzzles",
        "Educational Toys",
    ];

    const categories: Category[] = [];

    for (const name of categoriesData) {
        const category = await prisma.category.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
            },
        });

        categories.push(category);
    }

    console.log("Categories have been seeded");

    /**
   * =========================
   * 3. CREATE PRODUCTS
   * =========================
   */

    const toyNames = [
        "Rainbow Building Blocks",
        "Space Adventure Robot",
        "Princess Dollhouse",
        "Animal Puzzle Set",
        "Alphabet Learning Board",
        "Race Car Track",
        "Wooden Train Set",
        "Magic Clay Kit",
        "Mini Soccer Ball",
        "Dinosaur Explorer Kit",
        "Stickers and Coloring Set",
        "Cuddly Plush Bear",
        "Bubble Wand Set",
        "Kids Karaoke Microphone",
        "Rocket Launcher Toy",
    ];

    const productsData = toyNames.map((name, i) => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];

        return {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            description: `${name} for children aged 3 and up`,
            price: Math.floor(Math.random() * 300) + 100,
            stock: Math.floor(Math.random() * 50) + 10,
            categoryId: randomCategory.id,
            imageUrl: "https://via.placeholder.com/150",
        };
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