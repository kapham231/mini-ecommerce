// This is a utility file to create a singleton instance of Prisma Client

import { PrismaClient } from "@prisma/client";

// 1. Khởi tạo type cho biến global để TypeScript không báo lỗi
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Export instance prisma ra ngoài để tái sử dụng.
// Logic: Nếu trong biến global đã có sẵn, thì lấy cái đó dùng tiếp.
// Nếu chưa có (tiến trình mới chạy lần đầu), thì mới khởi tạo `new PrismaClient()`.
export const prisma = globalForPrisma.prisma || new PrismaClient();

// 3. Nếu không phải môi trường "production" (nghĩa là đang ở "development"),
// thì gán cái instance vừa tạo/vừa lấy được vào lại biến global.
// Nhờ vậy, ở lần hot-reload tiếp theo, bước 2 sẽ tìm thấy prisma trong globalForPrisma
// và KHÔNG tạo kết nối mới tới database nữa.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
