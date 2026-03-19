import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";

/**
 * REGISTER SERVICE
 * Xử lý logic đăng ký user
 */
export const register = async (data: {
    name: string;
    email: string;
    password: string;
}) => {
    const { name, email, password } = data;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    // Nếu tồn tại thì throw error
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // 2. Hash password trước khi lưu DB
    // 10 là salt rounds (độ mạnh mã hoá)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo user mới trong DB
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            // role sẽ mặc định là USER (theo schema)
        },
    });

    // 4. Tạo token
    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    // 5. Loại bỏ password trước khi trả về client
    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token,
    };
};

/**
 * LOGIN SERVICE
 * Xử lý đăng nhập
 */
export const login = async (data: {
    email: string;
    password: string;
}) => {
    const { email, password } = data;

    // 1. Tìm user theo email
    const user = await prisma.user.findUnique({
        where: { email },
    });

    // Nếu không có user → sai email
    if (!user) {
        throw new Error("Invalid credentials");
    }

    // 2. So sánh password nhập vào với password đã hash
    const isMatch = await bcrypt.compare(password, user.password);

    // Nếu không khớp → sai mật khẩu
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // 3. Tạo token
    const token = generateToken({
        id: user.id,
        role: user.role,
    });

    // 4. Loại bỏ password trước khi trả về
    const { password: _, ...userWithoutPassword } = user;

    return {
        user: userWithoutPassword,
        token,
    };
};