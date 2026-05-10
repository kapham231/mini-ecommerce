# 🧸 KidoZone - Mini Ecommerce Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-indigo.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC.svg)](https://tailwindcss.com/)

**KidoZone** là một nền tảng thương mại điện tử chuyên biệt cho đồ chơi trẻ em. Dự án được xây dựng với mục tiêu thực hành và áp dụng các kỹ thuật lập trình hiện đại, quy trình phát triển sản phẩm thực tế, từ thiết kế Database đến triển khai Frontend/Backend đồng bộ.

---

## ✨ Tính năng chính

### 🛒 Trải nghiệm Người dùng (Frontend)
- **Giao diện Responsive**: Tối ưu hóa trên mọi thiết bị (Mobile, Tablet, Desktop).
- **Quản lý Giỏ hàng**: Thêm, xóa, cập nhật số lượng sản phẩm mượt mà với Redux Toolkit.
- **Tìm kiếm & Lọc**: Hệ thống phân loại theo danh mục (Category) và trạng thái sản phẩm.
- **Xác thực**: Đăng ký, đăng nhập, bảo mật phiên làm việc với JWT và HttpOnly Cookie.
- **Thông tin cá nhân**: Quản lý sổ địa chỉ (Address Book) và lịch sử đơn hàng.

### ⚙️ Hệ thống Quản trị & Logic (Backend)
- **Kiến trúc Modular**: Hệ thống được chia thành các module độc lập (Auth, User, Product, Category, Cart, Order, Address), dễ bảo trì và mở rộng.
- **Xác thực đa tầng**: Middleware kiểm tra quyền truy cập (Auth & Admin Middleware).
- **Validation chặt chẽ**: Toàn bộ dữ liệu đầu vào được xác thực bằng Zod trước khi xử lý.
- **Quản lý Database**: Sử dụng Prisma ORM để tương tác với MySQL, xử lý các mối quan hệ phức tạp (One-to-Many, Many-to-Many).
- **Tài liệu API**: Tích hợp Swagger (OpenAPI) giúp việc tích hợp và kiểm thử API trở nên chuyên nghiệp.

---

## 🛠️ Công nghệ sử dụng

### Frontend Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MySQL
- **ORM**: Prisma
- **Auth**: JWT, Bcrypt
- **Documentation**: Swagger / Zod-to-OpenAPI

---

## 📂 Cấu trúc dự án

```text
mini-ecommerce/
├── backend/                # Source code API (Node.js, Express)
│   ├── prisma/             # Schema & Migrations
│   ├── src/
│   │   ├── modules/        # Business logic (User, Product, Cart...)
│   │   ├── shared/         # Middleware, Config, Utils
│   │   └── server.ts       # Entry point
│   └── package.json
├── frontend/               # Source code giao diện (React)
│   ├── src/
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Application Pages
│   │   ├── store/          # Redux Toolkit setup
│   │   └── services/       # API integration
│   └── package.json
└── README.md               # Tài liệu dự án
```

---

## 🚀 Hướng dẫn cài đặt

### 1. Yêu cầu hệ thống
- Node.js (v18+)
- MySQL Database

### 2. Cài đặt Backend
```bash
cd backend
npm install
# Tạo file .env từ .env.example và cấu hình DATABASE_URL
npx prisma generate
npx prisma db push
npm run dev
```

### 3. Cài đặt Frontend
```bash
cd frontend
npm install
# Cấu hình VITE_API_URL trong .env
npm run dev
```

---

## 📝 Mục tiêu dự án
Dự án được phát triển không nhằm mục đích thương mại, mà tập trung vào:
1. Áp dụng quy chuẩn **Clean Code** và **SOLID principles** trong TypeScript.
2. Hiểu sâu về luồng xác thực JWT và bảo mật Cookie.
3. Làm chủ kỹ năng thiết kế Database Schema thực tế.
4. Xây dựng giao diện người dùng có tính thẩm mỹ và hiệu năng cao.

---
