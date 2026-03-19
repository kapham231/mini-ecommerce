import jwt from "jsonwebtoken";

// Lấy secret từ .env
// Dấu ! để nói với TS là chắc chắn có giá trị (non-null assertion)
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Hàm tạo JWT token
 * @param payload dữ liệu muốn encode (userId, role,...)
 * @returns token string
 */
export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: "3d", // token sống 3 ngày
    });
};