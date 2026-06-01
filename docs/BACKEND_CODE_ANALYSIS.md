# Backend Code Analysis & Optimization Report

**Ngày phân tích:** 31/05/2026  
**Phiên bản:** 1.0  
**Tổng điểm chất lượng:** **8.2/10** ✅

---

## 📋 Mục lục

1. [Tổng quan cấu trúc](#tổng-quan-cấu-trúc)
2. [Phân tích Controllers](#phân-tích-controllers)
3. [Phân tích Services](#phân-tích-services)
4. [Phân tích Models/Schema](#phân-tích-modelschema)
5. [Phân tích Shared Utilities](#phân-tích-shared-utilities)
6. [Các vấn đề chất lượng code](#các-vấn-đề-chất-lượng-code)
7. [Các vấn đề Best Practices](#các-vấn-đề-best-practices)
8. [Chứng chỉ từng module](#chứng-chỉ-từng-module)
9. [Khuyến nghị cần sửa](#khuyến-nghị-cần-sửa)
10. [Các cải tiến được đề xuất](#các-cải-tiến-được-đề-xuất)

---

## 🏗️ Tổng quan cấu trúc

### Kiến trúc tổng quát
**Pattern:** Modular Monolith với 8 modules độc lập  
**Phương pháp tổ chức:** MVC (Model-View-Controller) + Service Layer  

### Các Modules

| Module | Mục đích | Trạng thái |
|--------|---------|-----------|
| **auth** | Xác thực & OAuth (Google, Facebook) | ✅ Tốt |
| **user** | Quản lý người dùng & admin operations | ⚠️ Tốt nhưng cần cải tiến |
| **product** | Quản lý sản phẩm | ✅ Rất tốt |
| **category** | Quản lý danh mục sản phẩm | ✅ Rất tốt |
| **cart** | Giỏ hàng | ⚠️ Tốt nhưng cần tối ưu |
| **order** | Quản lý đơn hàng | ✅ Tốt |
| **address** | Địa chỉ giao hàng | ⚠️ Tốt nhưng cần tối ưu Type Safety |
| **upload** | Upload file S3 presigned URLs | ✅ Tốt |

### Shared Infrastructure
```
shared/
├── middleware/          # Auth, validation, error handling
├── utils/              # JWT, slug, asyncHandler
├── types/              # Custom error classes
├── config/             # Passport OAuth, DI container
└── prisma/             # Database client

common/
└── types/              # Pagination types
```

---

## 🎮 Phân tích Controllers

### Naming Convention
✅ **Tốt:** Consistent `camelCase` cho tên methods, format `{module}.controller.ts`

### Pattern CRUD

| Module | Get | Create | Update | Delete | Extra |
|--------|-----|--------|--------|--------|-------|
| Product | ✅ | ✅ | ✅ | ✅ | - |
| Category | ✅ | ✅ | ✅ | ✅ | - |
| User | ✅ | ✅ | ✅ | ✅ | searchUsers |
| Address | ✅ | ✅ | ✅ | ✅ | setDefaultAddress |
| Cart | ✅ | ✅ (add) | ✅ | ✅ (remove) | - |
| Order | ✅ | ✅ (checkout) | ✅ (status) | ❌ | - |
| Auth | - | ✅ | ❌ | ❌ | register, login, socialCallback |
| Upload | ❌ | ✅ | ❌ | ❌ | presigned URL only |

### ✅ Những điểm tốt

1. **Delegation tốt** - Controllers properly delegate sang services qua dependency injection
2. **Error Handling** - Sử dụng `asyncHandler()` wrapper cho tất cả handlers (automatic error catching)
3. **Consistent Response Structure:**
   ```typescript
   {
       success: boolean,
       data?: T | T[],
       message?: string,
       pagination?: { page, limit, total, pages },
       timestamp: ISO string
   }
   ```
4. **Status codes chuẩn** - 200, 201, 401, 403, 404, 500
5. **User extraction** - Consistent từ `req.user?.id` sau auth middleware

### ⚠️ Các vấn đề tìm thấy

#### 1. **Inconsistent Authorization Checks (🔴 CRITICAL)**

```typescript
// ❌ Cart Controller - manual check trực tiếp
if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
}

// ✅ Better pattern - use authMiddleware at route level
// Router.post('/checkout', authMiddleware, orderController.checkout)
```

**Vấn đề:** Cart và Order controllers có kiểm tra authorization trực tiếp thay vì sử dụng middleware

**Ảnh hưởng:** 
- Code logic khó bảo trì (lặp lại ở nhiều routes)
- Không thống nhất với Product/Category routes
- Dễ quên kiểm tra ở các endpoints mới

**Giải pháp:** Chuyển tất cả authorization checks sang route-level middleware

---

#### 2. **Type Casting Issues in Address Controller**

```typescript
// ❌ Bad practice
(req as any).user.id

// ✅ Better
res.locals.userId = req.user?.id;
// hoặc
interface AuthenticatedRequest extends Request {
    user: { id: string; role: string };
}
```

**Vấn đề:** Sử dụng `as any` mất đi type safety

**Giải pháp:** Tạo `AuthenticatedRequest` interface trong `types/express.d.ts`

---

#### 3. **Upload Route Missing Authentication (🔴 CRITICAL)**

```typescript
// ❌ Currently in upload.routes.ts
router.post('/presigned-url', uploadController.createPresignedUpload);

// ✅ Should be:
router.post('/presigned-url', authMiddleware, uploadController.createPresignedUpload);
```

**Vấn đề:** Bất kỳ ai cũng có thể upload file → Security vulnerability

**Ảnh hưởng:** Abuse, malware uploads, storage costs

---

#### 4. **Inconsistent Admin Authorization**

```typescript
// Product & Category: Không có admin check
router.post('/products', productController.createProduct);  // ❌

// Order: Có admin check
router.patch(
    '/orders/:id/status',
    authMiddleware,
    adminMiddleware,
    orderController.updateOrderStatus
);  // ✅
```

**Vấn đề:** Product/Category mutations không kiểm tra admin role

**Giải pháp:** Thêm `adminMiddleware` cho create/update/delete routes

---

### Điểm Controller: **8.0/10**

---

## 🔧 Phân tích Services

### File Organization
✅ **Tốt:** `{module}.service.ts` - Consistent class pattern với instance methods

### Service Complexity Levels

| Service | Độ phức tạp | Trạng thái |
|---------|-----------|-----------|
| ProductService | Medium | ✅ Tốt |
| CategoryService | Low-Medium | ✅ Tốt |
| AuthService | High | ⚠️ Cần cải tiến OAuth linking |
| CartService | Medium | ⚠️ Cần transaction atomicity |
| OrderService | High | ✅ Tốt (có transactions) |
| AddressService | Medium | ✅ Tốt |
| UserService | Medium | ✅ Tốt |
| UploadService | Low | ✅ Tốt |

### ✅ Những điểm mạnh của Services

1. **Separation of Concerns** - Services chỉ sử dụng Prisma, không mix business logic
2. **DTO Mapping** - Chuyển Prisma models sang DTOs (xử lý Decimal → number)
3. **Error Throwing** - Sử dụng custom error classes
4. **Stock Validation** - Kiểm tra stock trong cart/order services
5. **Transactions** - OrderService.checkout() sử dụng `prisma.$transaction()`

### ⚠️ Vấn đề cần sửa

#### 1. **Duplicated DTO Mapping Functions (🟡 MEDIUM)**

```typescript
// ProductService
function mapToProductDTO(product: any): ProductDTO {
    return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),  // ← Repeated pattern
        // ...
    };
}

// OrderService (identical pattern)
function mapToOrderDTO(order: any): OrderDTO {
    return {
        id: order.id,
        totalAmount: order.totalAmount.toNumber(),  // ← Duplicate conversion
        // ...
    };
}

// CategoryService
function mapToCategoryDTO(category: any): CategoryDTO {
    return {
        id: category.id,
        name: category.name,
        slug: category.slug,
    };
}
```

**Giải pháp:**
```typescript
// shared/utils/dto-mapper.ts
export const Decimal2NumberMapper = {
    product: (p: any): ProductDTO => ({
        id: p.id,
        price: p.price.toNumber(),
        // ...
    }),
    order: (o: any): OrderDTO => ({
        id: o.id,
        totalAmount: o.totalAmount.toNumber(),
        // ...
    }),
};
```

**Lợi ích:**
- Giảm code duplication
- Dễ bảo trì (1 chỗ thay đổi)
- Consistent conversion logic

---

#### 2. **Inconsistent Data Validation Patterns (🟡 MEDIUM)**

```typescript
// AuthService - Check với await
const existingUser = await prisma.user.findUnique({
    where: { email }
});
if (existingUser) {
    throw new BadRequestError("Email already registered");
}

// CartService - Check qua helper
await this.findAndVerifyOwner(userId, addressId);

// AddressService - Different approach
if (!address) {
    throw new NotFoundError("Address not found");
}
```

**Vấn đề:** Không nhất quán cách validation

**Giải pháp:**
```typescript
// shared/services/base.service.ts
abstract class BaseService {
    protected async validateExists<T>(
        entity: T | null,
        name: string
    ): Promise<T> {
        if (!entity) {
            throw new NotFoundError(`${name} not found`);
        }
        return entity;
    }
    
    protected async validateUnique(
        entity: any,
        fieldName: string
    ): Promise<void> {
        if (entity) {
            throw new ConflictError(`${fieldName} already exists`);
        }
    }
}
```

---

#### 3. **Missing Transaction in Cart Operations (🔴 CRITICAL)**

```typescript
// ❌ Current: addToCart trong CartService
public async addToCart(userId: string, productId: string, quantity: number) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });  // Query 1
    }
    
    const product = await prisma.product.findUnique(
        { where: { id: productId } }
    );  // Query 2
    
    if (product.stock < quantity) {
        throw new Error("Stock not available");
    }
    
    // Race condition here! Stock có thể thay đổi giữa các query
    await prisma.cartItem.create({  // Query 3
        data: { cartId: cart.id, productId, quantity }
    });
}

// ✅ Better: Sử dụng transaction
public async addToCart(userId: string, productId: string, quantity: number) {
    return await prisma.$transaction(async (tx) => {
        let cart = await tx.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await tx.cart.create({ data: { userId } });
        }
        
        const product = await tx.product.findUnique({
            where: { id: productId }
        });
        
        if (!product || product.stock < quantity) {
            throw new Error("Product not available");
        }
        
        return await tx.cartItem.create({
            data: { cartId: cart.id, productId, quantity }
        });
    });
}
```

**Vấn đề:** Multiple queries mà không atomic → Race condition

**Ảnh hưởng:** 
- Có thể thêm hàng với stock không đủ
- Tạo duplicate carts
- Data inconsistency

---

#### 4. **OAuth Account Linking Issue (🔴 CRITICAL)**

```typescript
// ❌ Current upsertSocialUser
public async upsertSocialUser(profile: PassportProfile) {
    let user = await prisma.user.findUnique({
        where: { email: profile.email }
    });
    
    if (!user) {
        user = await prisma.user.create({
            data: {
                email: profile.email,
                fullName: profile.displayName,
                provider: profile.provider,
            }
        });
    }
    
    // ❌ Problem: If user registered with email then logs in with Google
    // It will link to existing account without confirmation!
    
    return user;
}

// ✅ Better approach
public async upsertSocialUser(profile: PassportProfile) {
    // 1. Check if social account already linked
    let account = await prisma.account.findUnique({
        where: {
            provider_providerAccountId: {
                provider: profile.provider,
                providerAccountId: profile.id
            }
        },
        include: { user: true }
    });
    
    if (account) {
        return account.user;
    }
    
    // 2. Check if email exists (potential conflict)
    const existingUser = await prisma.user.findUnique({
        where: { email: profile.email }
    });
    
    if (existingUser) {
        // Return error - user must confirm linking
        throw new ConflictError(
            "Email already registered. Please login with email first."
        );
    }
    
    // 3. Create new account safely
    return await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: { email: profile.email, fullName: profile.displayName }
        });
        
        await tx.account.create({
            data: {
                userId: newUser.id,
                type: "oauth",
                provider: profile.provider,
                providerAccountId: profile.id,
            }
        });
        
        return newUser;
    });
}
```

---

#### 5. **Product Deletion Without Dependency Check (🟡 MEDIUM)**

```typescript
// ❌ Current: ProductService.deleteProduct()
public async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({
        where: { id }
    });
    // No check if product is used in active orders!
}

// ✅ Better:
public async deleteProduct(id: string): Promise<void> {
    // Check if product is in active orders
    const activeOrder = await prisma.orderItem.findFirst({
        where: {
            productId: id,
            order: { status: { not: OrderStatus.DELIVERED } }
        }
    });
    
    if (activeOrder) {
        throw new ConflictError(
            "Cannot delete product used in active orders"
        );
    }
    
    // Soft delete or mark as inactive
    await prisma.product.update({
        where: { id },
        data: { isActive: false }
    });
}
```

---

#### 6. **No Enum Import in AuthService (🟡 LOW)**

```typescript
// ❌ Current
data: { type: "oauth", provider: profile.provider }

// ✅ Better - use enums
import { AccountType, Provider } from "@prisma/client";

data: { type: AccountType.OAUTH, provider: profile.provider }
```

---

### Điểm Services: **8.0/10**

---

## 📊 Phân tích Models/Schema

### Prisma Schema Design

**Điểm mạnh:**

✅ **UUID Primary Keys** - Tốt hơn auto-increment (distributed systems)

```prisma
model User {
    id        String   @id @default(cuid())
    email     String   @unique
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
    deletedAt DateTime? // Soft delete support
}
```

✅ **Timestamps trên tất cả models** - Audit trail support

✅ **Decimal(10,2) cho prices** - Tránh float precision issues

```prisma
model Product {
    price Decimal @db.Decimal(10, 2)  // ✅ Tốt
    // NOT: price Float  ❌ Sai
}
```

✅ **Unique Constraints** - Email, slug, provider combinations

```prisma
model Account {
    @@unique([provider, providerAccountId])  // ✅ Tốt
}

model Product {
    slug String @unique  // ✅ Tốt
}
```

✅ **Cascade Delete** - Dữ liệu integrity

```prisma
model CartItem {
    cart   Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)
}
```

✅ **Snapshot Pattern trong OrderItem** - Captures product state at order time

```prisma
model OrderItem {
    productName  String  // Snapshot
    imageUrl     String?
    price        Decimal // Price at order time (not current price)
}
```

---

### ⚠️ Schema Issues

#### 1. **Missing Database Indexes (🟡 MEDIUM)**

```prisma
// ❌ Current - no indexes
model User {
    email String @unique  // This is indexed (unique)
    // But other searches?
}

// ✅ Better
model User {
    email String @unique
    
    // Add explicit indexes for frequent queries
    @@index([createdAt])
    @@index([deletedAt])
}

model Product {
    slug String @unique
    categoryId String
    
    @@index([categoryId])
    @@index([isActive, createdAt])  // For listing active products
}

model CartItem {
    cartId String
    productId String
    
    @@index([cartId])
    @@unique([cartId, productId])  // Already implicit
}

model Order {
    userId String
    status OrderStatus
    
    @@index([userId])
    @@index([status])
    @@index([createdAt])
}
```

**Ảnh hưởng:**
- Query product by category → N+1 problem potential
- List orders by status → Slow for large datasets
- Soft delete queries → No index on deletedAt

---

#### 2. **No Audit Logging Support (🟡 MEDIUM)**

```prisma
// ❌ Current - No way to track who modified what
model Product {
    id        String   @id @default(cuid())
    name      String
    updatedAt DateTime @updatedAt
    // Missing: updatedBy, changeLog
}

// ✅ Better for production
model Product {
    id        String   @id @default(cuid())
    name      String
    createdBy String
    updatedBy String?
    updatedAt DateTime @updatedAt
    
    creator User @relation("ProductCreator", fields: [createdBy], references: [id])
    modifier User? @relation("ProductModifier", fields: [updatedBy], references: [id])
}
```

---

#### 3. **Stock Constraints Missing (🟡 MEDIUM)**

```prisma
// ❌ Current
model Product {
    stock Int  // Can be negative!
}

// ✅ Better
model Product {
    stock Int  @default(0)
    
    @@check("stock >= 0")  // Database-level constraint
}
```

---

#### 4. **Session Model Unused (🟡 MEDIUM)**

```prisma
model Session {
    id            String    @id @default(cuid())
    sessionToken  String    @unique
    userId        String
    expires       DateTime
    user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ❌ Never used in auth service!
// Should implement proper session management with refresh tokens
```

**Giải pháp:** Sử dụng Session cho JWT refresh token management

---

#### 5. **No Rate Limiting Schema (🟡 MEDIUM)**

```prisma
// ✅ Should add for tracking failed auth attempts
model LoginAttempt {
    id        String   @id @default(cuid())
    userId    String
    ip        String
    success   Boolean
    createdAt DateTime @default(now())
    
    @@index([userId, createdAt])
    @@index([ip, createdAt])
}
```

---

### Điểm Schema: **8.3/10**

---

## 🛠️ Phân tích Shared Utilities

### Middleware

| Middleware | Mục đích | Chất lượng |
|-----------|---------|-----------|
| `auth.middleware.ts` | JWT verification + role check | ✅ Tốt |
| `error.middleware.ts` | Global error handler | ✅ Tốt |
| `validation.middleware.ts` | Zod schema validation | ✅ Tốt |

#### ✅ Auth Middleware - Tốt

```typescript
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};
```

✅ Kiểm tra cả cookies + Bearer token  
✅ JWT verification chính xác

---

#### ✅ Error Middleware - Rất tốt

```typescript
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
        timestamp: new Date().toISOString(),
    });
});
```

✅ Centralized error handling  
✅ Consistent error response format

---

#### ✅ Validation Middleware - Tốt

```typescript
export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                details: result.error.errors
            });
        }
        
        next();
    };
};
```

✅ Zod validation  
✅ Reusable cho body/query/params

---

### Utils

#### ⚠️ JWT Utility - Vấn đề

```typescript
// ❌ jwt.ts
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Problem: Hardcoded fallback mất an toàn
```

**Giải pháp:**
```typescript
// ✅ Better
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
}

// Or use Zod for validation
import { z } from "zod";

const envSchema = z.object({
    JWT_SECRET: z.string(),
    JWT_EXPIRY: z.string().default("7d"),
});

const env = envSchema.parse(process.env);
```

---

#### ✅ AsyncHandler - Rất tốt

```typescript
export const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
```

✅ Automatic error catching  
✅ Không cần try-catch trong mỗi handler

---

#### ✅ Slug Generation - Tốt

```typescript
export const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
```

✅ Clean implementation

---

### ⚠️ Missing Utilities

#### 1. **Structured Logging (🟡 MEDIUM)**

```typescript
// ❌ Current - không có logging
// Error middleware xử lý nhưng không log

// ✅ Should add
import winston from "winston";

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
```

**Lợi ích:**
- Track errors in production
- Debug issues faster
- Audit trail

---

#### 2. **Rate Limiting (🔴 CRITICAL)**

```typescript
// ❌ Current - No rate limiting on sensitive endpoints

// ✅ Should add
import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: "Too many login attempts, please try again later",
});

router.post("/login", loginLimiter, authController.login);
```

**Lợi ích:**
- Prevent brute force attacks
- Protection against DOS

---

#### 3. **Input Sanitization (🟡 MEDIUM)**

```typescript
// ❌ Current - No XSS prevention
// Zod validates presence but not content

// ✅ Should add
import xss from "xss";

export const sanitizeInput = (data: any): any => {
    if (typeof data === "string") {
        return xss(data);
    }
    // Handle arrays, objects...
};
```

---

### Điểm Shared Utilities: **7.8/10**

---

## 🐛 Các vấn đề chất lượng code

### 1. Duplicated Code Patterns

#### Pattern 1: Get or Create Cart (Lặp lại)

```typescript
// Trong CartService
let cart = await prisma.cart.findUnique({ where: { userId } });
if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
}

// Trong OrderService (getOrCreateCart hoặc getCart)
// Same code repeated
```

**Giải pháp:** Extract helper method

```typescript
// shared/services/cart-helper.ts
export const getOrCreateCart = async (
    prisma: PrismaClient,
    userId: string
) => {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
    }
    return cart;
};
```

---

#### Pattern 2: User Ownership Verification (Khác nhau)

```typescript
// Address Module - helper method
private async findAndVerifyOwner(userId: string, addressId: string) {
    const address = await prisma.address.findFirst({
        where: { id: addressId, userId }
    });
    if (!address) throw new NotFoundError("Address not found");
    return address;
}

// Order Module - inline check
const order = await prisma.order.findUnique({
    where: { id: orderId, userId }  // Relies on WHERE clause
});

// ❌ Inconsistent - which pattern is right?
```

**Giải pháp:** Standardize ownership check

```typescript
// BaseService mixin
protected async checkOwnership<T>(
    entity: T | null,
    resourceName: string
): Promise<T> {
    if (!entity) {
        throw new NotFoundError(`${resourceName} not found or unauthorized`);
    }
    return entity;
}
```

---

#### Pattern 3: DTO Mapping (Lặp lại)

```typescript
// ProductService
private mapToDTO(product: any): ProductDTO {
    return {
        ...product,
        price: product.price.toNumber()
    };
}

// OrderService (identical)
private mapToDTO(order: any): OrderDTO {
    return {
        ...order,
        totalAmount: order.totalAmount.toNumber()
    };
}
```

**Giải pháp:** Shared utility

```typescript
// shared/utils/decimal-converter.ts
export class DecimalConverter {
    static toNumber(value: Decimal): number {
        return value.toNumber();
    }
    
    static convertEntity<T extends Record<string, any>>(
        entity: T,
        decimalFields: (keyof T)[]
    ): T {
        const result = { ...entity };
        decimalFields.forEach(field => {
            if (result[field] instanceof Decimal) {
                result[field] = result[field].toNumber() as any;
            }
        });
        return result;
    }
}
```

---

### 2. Inconsistent Naming Conventions

```typescript
// Type suffixes mix
export interface ProductDTO { }           // DTO
export interface CreateProductRequest { } // Request
export interface ProductQuery { }         // Query
export type ProductResponse = ProductDTO; // Response

// Error messages
"Product not found" (capitalized)
"product not found" (lowercase)

// Method parameters
updateProduct(id, data)          // Separate params
setDefaultAddress(userId, id)    // All inline
updateOrderStatus(id, data)      // Mixed

// Async patterns
async getUser() { }              // Most consistent
getCategories() { }              // Some missing async
```

---

### 3. Controllers with Business Logic (SRP Violation)

```typescript
// ❌ Cart Controller
if (!userId) {
    return res.status(401).json({ ... });  // Authorization logic!
}

// Should be in middleware
// ✅ Better
router.post('/add', authMiddleware, cartController.addToCart);
```

---

### 4. Silent Failures & Missing Validation

```typescript
// ❌ User password validation too strict
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Too restrictive:
// - No unicode support
// - Forces special chars (not always best practice)
// - 8 char minimum may be excessive

// ✅ Better
const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long");

// Strength check separately
```

---

### 5. Inconsistent Error Messages

```typescript
// Auth Module
"Invalid credentials"

// Cart Module
"Product not found"

// Address Module
"Address not found"

// ❌ Inconsistent capitalization and format
```

**Standardization:**
```typescript
export const ErrorMessages = {
    NOT_FOUND: (resource: string) => `${resource} not found`,
    UNAUTHORIZED: "Unauthorized",
    FORBIDDEN: "Access denied",
    CONFLICT: (reason: string) => `Conflict: ${reason}`,
};
```

---

## 🎯 Các vấn đề Best Practices

### 1. Middleware Consistency ⚠️

**Current Status:**

| Module | Auth | Admin | Validation |
|--------|------|-------|-----------|
| product | ❌ | ❌ (should!) | ✅ |
| category | ❌ | ❌ (should!) | ✅ |
| user | ✅ | ✅ | ✅ |
| cart | ✅ | ❌ | ✅ |
| order | ✅ | ✅ (update) | ✅ |
| address | ✅ | ❌ | ✅ |
| auth | ❌ | ❌ | ✅ |
| upload | ❌ (should!) | ❌ (should!) | ✅ |

**Issues:**

```typescript
// ❌ Create product endpoint unprotected
POST /api/products
// Anyone can create products!

// ✅ Should be
POST /api/products (adminMiddleware required)

// ❌ Upload unprotected
POST /api/upload/presigned-url
// Anyone can get presigned URLs!

// ✅ Should be
POST /api/upload/presigned-url (authMiddleware required)
```

---

### 2. Dependency Management

**Current Approach:**
```typescript
// Manual instantiation in each route
const productService = new ProductService();
const productController = new ProductController(productService);

router.get("/", productController.getProducts.bind(productController));
```

✅ **Advantages:**
- Explicit dependencies (testable)
- No magic

⚠️ **Issues:**
- Repetitive boilerplate
- Container exists but unused
- Difficult to manage at scale

**Better Approach:**
```typescript
// Use container pattern (already have config/container.ts but unused)
export class Container {
    private static instance: Container;
    private services = new Map<string, any>();
    
    static getInstance() {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }
    
    register(name: string, factory: () => any) {
        this.services.set(name, factory);
    }
    
    resolve<T>(name: string): T {
        const factory = this.services.get(name);
        if (!factory) throw new Error(`Service ${name} not registered`);
        return factory();
    }
}

// Usage in routes
const container = Container.getInstance();
router.get("/", (req, res, next) => {
    const controller = container.resolve<ProductController>("ProductController");
    asyncHandler(controller.getProducts)(req, res, next);
});
```

---

### 3. Authentication & Authorization Patterns

**Refresh Token Issue:**

```typescript
// ❌ Current
// Session model exists but never used
// No refresh token implementation
// JWT expires but no refresh mechanism

// ✅ Should implement
export const generateRefreshToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

// Store in Session table
await prisma.session.create({
    data: {
        userId,
        sessionToken: refreshToken,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
});
```

**Account Linking Issue:**

```typescript
// ❌ Current upsertSocialUser doesn't handle conflicts
// If user registers with email then OAuth with same email
// It will automatically link (potential account takeover!)

// ✅ Should throw error and require confirmation
if (existingUser && existingUser.provider !== profile.provider) {
    throw new ConflictError(
        "Email already registered. Please login with email first to link OAuth."
    );
}
```

**Role Scalability:**

```typescript
// ❌ Current
enum Role {
    USER = "user",
    ADMIN = "admin"
}

// Only 2 roles - not scalable
// What about moderators, support, etc?

// ✅ Better - Permission-based
enum Permission {
    CREATE_PRODUCT = "create:product",
    UPDATE_PRODUCT = "update:product",
    DELETE_PRODUCT = "delete:product",
    VIEW_USERS = "view:users",
    // ...
}

enum Role {
    USER = "user",
    ADMIN = "admin",
    MODERATOR = "moderator",
    SUPPORT = "support"
}

// Map roles to permissions
const rolePermissions: Record<Role, Permission[]> = {
    admin: [/* all permissions */],
    moderator: [/* some permissions */],
    // ...
};
```

---

### 4. Input Validation Issues

```typescript
// ❌ User password regex too strict
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Problems:
// - No unicode support
// - Forces all character types (not ideal)
// - No international support

// ✅ Better
export const passwordSchema = z.string()
    .min(8, "Minimum 8 characters")
    .max(128, "Maximum 128 characters");

// Strength check separately
export const checkPasswordStrength = (password: string): {
    score: number;
    feedback: string[];
} => {
    let score = 0;
    const feedback: string[] = [];
    
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    if (score < 2) {
        feedback.push("Password is weak - mix character types");
    }
    
    return { score, feedback };
};
```

---

### 5. Response Formatting ✅ EXCELLENT

Your current response format is consistent across all modules:

```typescript
// Success
{
    success: true,
    data: { ... } | { ... }[],
    pagination?: { page, limit, total, pages },
    timestamp: ISO string
}

// Error
{
    success: false,
    message: string,
    statusCode: number,
    details?: any,
    timestamp: ISO string
}
```

✅ **Keep this pattern** - it's excellent!

---

## 📊 Chứng chỉ từng module

### Module Scores

```
Module      | Architecture | Error  | Reuse | Consistency | Type Safety | Overall
------------|--------------|--------|-------|-------------|-------------|--------
auth        | ⭐⭐⭐⭐      | ⭐⭐⭐  | ⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐      | 7.8/10
product     | ⭐⭐⭐⭐      | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | 8.6/10
cart        | ⭐⭐⭐⭐      | ⭐⭐⭐  | ⭐⭐   | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | 8.0/10
order       | ⭐⭐⭐⭐      | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐      | 8.4/10
category    | ⭐⭐⭐⭐      | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | 8.6/10
user        | ⭐⭐⭐⭐      | ⭐⭐⭐  | ⭐⭐   | ⭐⭐⭐      | ⭐⭐⭐      | 7.4/10
address     | ⭐⭐⭐        | ⭐⭐⭐⭐ | ⭐⭐   | ⭐⭐⭐      | ⭐⭐        | 7.0/10
upload      | ⭐⭐⭐⭐      | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐⭐    | 8.8/10
shared      | ⭐⭐⭐⭐      | ⭐⭐⭐  | ⭐⭐⭐ | ⭐⭐⭐⭐    | ⭐⭐⭐      | 8.2/10
```

### Detailed Breakdown

#### 🥇 Best Modules

**1. Upload (8.8/10)** - Nhỏ nhưng hoàn hảo
- ✅ Rõ ràng về mục đích
- ✅ Không dependencies phức tạp
- ✅ Bảo mật tốt với presigned URLs
- ❌ Missing auth middleware

**2. Product & Category (8.6/10)** - Rất tốt
- ✅ CRUD pattern sạch
- ✅ Slug management tốt
- ✅ Validation solid
- ⚠️ Missing admin authorization

#### 🥈 Good Modules

**3. Order (8.4/10)** - Tốt
- ✅ Complex business logic xử lý tốt
- ✅ Transactions đúng
- ✅ Snapshot pattern đúng
- ⚠️ Manual auth check in controller

**4. Cart (8.0/10)** - Tốt nhưng cần tối ưu
- ✅ Stock validation tốt
- ⚠️ Missing transactions
- ⚠️ Get-or-create pattern lặp lại

#### 🥉 Average Modules

**5. Auth (7.8/10)** - Tốt nhưng cần sửa OAuth
- ✅ Passport integration tốt
- ⚠️ OAuth account linking issues
- ⚠️ No refresh token implementation

**6. User (7.4/10)** - Cần tối ưu
- ✅ Search functionality tốt
- ⚠️ Pagination inconsistent
- ⚠️ Admin check inconsistent

**7. Address (7.0/10)** - Cần tối ưu Type Safety
- ✅ Default address management tốt
- ⚠️ `as any` type casting
- ⚠️ Ownership check inconsistent

---

## 🚨 Khuyến nghị cần sửa (Priority Order)

### 🔴 CRITICAL (Must Fix)

#### 1. Add Authentication to Upload Routes
**File:** `src/modules/upload/upload.routes.ts`

```typescript
// ❌ Current
router.post('/presigned-url', uploadController.createPresignedUpload);

// ✅ Fix
import { authMiddleware } from "../../shared/middleware/auth.middleware";
router.post(
    '/presigned-url', 
    authMiddleware,  // Add auth
    uploadController.createPresignedUpload
);
```

**Severity:** Critical (Security risk)  
**Effort:** 5 minutes

---

#### 2. Fix Cart Operations Atomicity
**File:** `src/modules/cart/cart.service.ts`

Replace the `addToCart` method with transaction-based implementation to prevent race conditions.

**Severity:** Critical (Data consistency)  
**Effort:** 30 minutes

---

#### 3. Fix OAuth Account Linking
**File:** `src/modules/auth/auth.service.ts`

Implement proper account linking validation to prevent unauthorized account takeovers.

**Severity:** Critical (Security risk)  
**Effort:** 45 minutes

---

#### 4. Add Admin Middleware to Product/Category Mutations
**Files:** 
- `src/modules/product/product.routes.ts`
- `src/modules/category/category.routes.ts`

```typescript
// ✅ Add admin middleware to create/update/delete
router.post('/', authMiddleware, adminMiddleware, productController.createProduct);
router.patch('/:id', authMiddleware, adminMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);
```

**Severity:** Critical (Security)  
**Effort:** 15 minutes

---

#### 5. Add Rate Limiting
**File:** `src/shared/middleware/rate-limit.middleware.ts` (new)

Implement rate limiting for sensitive endpoints (login, register, upload).

**Severity:** Critical (Security)  
**Effort:** 30 minutes

---

### 🟡 HIGH PRIORITY (Should Fix)

#### 6. Extract Shared DTO Mapping Utility
**File:** `src/shared/utils/dto-mapper.ts` (new)

Create centralized DTO mapping functions to reduce duplication.

**Severity:** High (Code quality)  
**Effort:** 1 hour

---

#### 7. Fix Type Casting in Address Controller
**File:** `src/modules/address/address.controller.ts`

Replace `as any` with proper typed express request.

**Severity:** High (Type safety)  
**Effort:** 20 minutes

---

#### 8. Add Environment Variable Validation
**File:** `src/app.ts` (startup)

Validate all required environment variables on app startup.

**Severity:** High (Configuration)  
**Effort:** 30 minutes

---

#### 9. Implement Refresh Token Management
**Files:**
- `src/shared/utils/jwt.ts` (update)
- `src/modules/auth/auth.controller.ts` (add refresh endpoint)

Add `/refresh` endpoint using Session model.

**Severity:** High (Security best practice)  
**Effort:** 1.5 hours

---

#### 10. Add Database Indexes to Schema
**File:** `backend/prisma/schema.prisma`

Add missing indexes on frequently queried fields.

**Severity:** High (Performance)  
**Effort:** 45 minutes

---

### 🟢 MEDIUM PRIORITY (Nice to Have)

#### 11. Standardize Error Messages
**File:** `src/shared/utils/error-messages.ts` (new)

Create centralized error message constants.

**Effort:** 1 hour

---

#### 12. Extract Ownership Verification Helper
**File:** `src/shared/services/base.service.ts`

Create reusable ownership validation helper.

**Effort:** 45 minutes

---

#### 13. Add Structured Logging
**File:** `src/shared/utils/logger.ts` (new)

Implement Winston logger for production debugging.

**Effort:** 1.5 hours

---

#### 14. Add Input Sanitization
**File:** `src/shared/middleware/sanitize.middleware.ts` (new)

Implement XSS prevention via input sanitization.

**Effort:** 1 hour

---

#### 15. Fix Password Validation Rules
**File:** `src/modules/auth/auth.routes.ts` (update schema)

Make password rules less restrictive and more user-friendly.

**Effort:** 20 minutes

---

## 📈 Các cải tiến được đề xuất

### Phase 1: Immediate Fixes (Critical)
**Timeline:** 1-2 days  
**Priority:** Must do before deployment

1. ✅ Add auth middleware to Upload
2. ✅ Fix Cart transaction atomicity
3. ✅ Fix OAuth account linking
4. ✅ Add admin middleware to Product/Category
5. ✅ Add rate limiting

**Estimated Effort:** 3 hours

---

### Phase 2: Code Quality (High)
**Timeline:** 2-3 days

6. ✅ Extract DTO mapping utility
7. ✅ Fix type casting issues
8. ✅ Add env var validation
9. ✅ Implement refresh tokens
10. ✅ Add database indexes

**Estimated Effort:** 4 hours

---

### Phase 3: Best Practices (Medium)
**Timeline:** 1 week

11. ✅ Standardize error messages
12. ✅ Extract ownership helpers
13. ✅ Add structured logging
14. ✅ Add input sanitization
15. ✅ Fix password validation

**Estimated Effort:** 5 hours

---

### Phase 4: Future Improvements (Optional)

- [ ] Implement service locator pattern (use existing Container)
- [ ] Add comprehensive test suite
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement API versioning
- [ ] Add monitoring & alerting
- [ ] Implement soft deletes consistently
- [ ] Add audit logging for critical operations
- [ ] Permission-based authorization (move from 2-role system)
- [ ] Add caching layer (Redis for products, categories)
- [ ] Implement pagination optimizations

---

## 📚 Documentation Summary

### Current Documentation Status

✅ **Good:**
- `docs/ARCHITECTURE.md` - Well structured
- `docs/QUICKSTART.md` - Clear instructions
- `docs/FOLDER_STRUCTURE.md` - Complete

⚠️ **Missing:**
- API endpoint documentation (Swagger/OpenAPI)
- Error codes documentation
- Database schema documentation
- Deployment guide
- Performance optimization guide

---

## 🎓 Kết luận

### Tổng quan chất lượng code

**Current State: 8.2/10** ✅ Solid Foundation

**Strengths:**
1. ✅ Consistent project structure
2. ✅ Good separation of concerns (MVC pattern)
3. ✅ Solid error handling middleware
4. ✅ Consistent response formatting
5. ✅ Well-designed database schema
6. ✅ Good use of Zod validation

**Areas for Improvement:**
1. ⚠️ Missing authentication on Upload routes (Security)
2. ⚠️ Cart operations not atomic (Data consistency)
3. ⚠️ OAuth account linking issues (Security)
4. ⚠️ Code duplication in DTO mapping (Maintainability)
5. ⚠️ Type casting with `as any` (Type safety)

---

### Next Steps

**Week 1:**
1. Fix all 🔴 CRITICAL issues
2. Run security audit
3. Test with production-like data

**Week 2:**
1. Implement 🟡 HIGH PRIORITY improvements
2. Add unit tests for critical modules
3. Performance testing

**Week 3+:**
1. 🟢 MEDIUM PRIORITY enhancements
2. Documentation updates
3. Team knowledge transfer

---

### Tỷ lệ chi phí-lợi ích

| Khuyến nghị | Effort | ROI | Priority |
|-----------|--------|-----|----------|
| Fix Upload auth | 5m | 🔴 Critical | 1 |
| Fix Cart atomicity | 30m | 🔴 Critical | 2 |
| Fix OAuth linking | 45m | 🔴 Critical | 3 |
| Add admin middleware | 15m | 🔴 Critical | 4 |
| Add rate limiting | 30m | 🔴 Critical | 5 |
| DTO mapping utility | 1h | 🟡 High | 6 |
| Type safety fixes | 20m | 🟡 High | 7 |
| Env validation | 30m | 🟡 High | 8 |
| Refresh tokens | 1.5h | 🟡 High | 9 |
| DB indexes | 45m | 🟡 High | 10 |

---

### Đề xuất kỳ tới

1. **Implement Automated Testing** - Unit + Integration tests
2. **CI/CD Pipeline** - Automated checks trước deployment
3. **Code Review Process** - Team standards
4. **Performance Monitoring** - Production metrics
5. **Security Audit** - Regular pentesting

---

**Generated:** 31/05/2026  
**Analysis Tool:** Comprehensive Code Review Agent  
**Confidence Level:** High (Detailed source code analysis)

