# Refactoring: Layered → Modular Monolith

## What Changed?

### Before (Layered Architecture)
```
src/
├── controllers/  ← mixed domain logic
├── services/     ← mixed domain logic
├── routes/       ← mixed domain logic
└── utils/
```

## After (Modular Monolith)
```
src/
├── modules/      ← organized by domain
│   ├── auth/
│   ├── product/
│   └── category/
├── shared/       ← infrastructure
└── app.ts, server.ts
```

---

## Key Improvements

| Aspect | Before | After |
|--------|--------|-------|
| **Organization** | By layer | By domain (module) |
| **Module Communication** | Mixed dependencies | Clear interfaces |
| **Error Handling** | Inconsistent try-catch | Global error middleware |
| **Request Validation** | Manual checks | Zod schema validation |
| **Database Access** | Direct Prisma anywhere | Centralized through services |
| **Testability** | Coupled code | Independent modules |
| **Scaling to Microservices** | Difficult refactor | Module → Service |

---

## Migration Status

### ✅ Already Done
- [x] Folder structure created
- [x] Shared infrastructure setup (Prisma, errors, middleware)
- [x] Auth module refactored
- [x] Product module refactored (detailed example)
- [x] Category module refactored
- [x] New app.ts with module registration
- [x] Error handling middleware
- [x] Request validation with Zod
- [x] Async handler wrapper

### 🚀 Next Steps
1. **Install Dependencies**: `npm install zod`
2. **Test the Setup**: `npm run dev`
3. **Update Old Files**: Archive `controllers/`, `services/`, `routes/` folders (don't delete yet)
4. **Add Remaining Modules**: Auth, Product, Category, and any others

---

## Old Files (Can Be Archived)

These folders are no longer needed. Archive them but keep for reference:
- `src/controllers/` → Now in `src/modules/*/controller.ts`
- `src/services/` → Now in `src/modules/*/service.ts`
- `src/routes/` → Now in `src/modules/*/routes.ts`
- `src/utils/prisma.ts` → Now in `src/shared/prisma/client.ts`
- `src/utils/jwt.ts` → Now in `src/shared/utils/jwt.ts`

---

## Example: Adding a New Module

Let's say you want to add an **Order** module. Follow this checklist:

### 1. Create Type Definitions
**File**: `src/modules/order/order.types.ts`

```typescript
import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: z.string().min(5),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;

export interface OrderDTO {
  id: string;
  userId: string;
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: Date;
}
```

### 2. Create Service
**File**: `src/modules/order/order.service.ts`

```typescript
import { prisma } from "../../shared/prisma/client";
import { NotFoundError, ValidationError } from "../../shared/types/error";
import { CreateOrderRequest, OrderDTO } from "./order.types";

export class OrderService {
  async createOrder(userId: string, data: CreateOrderRequest): Promise<OrderDTO> {
    // Validate user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Create order with items
    const order = await prisma.order.create({
      data: {
        userId,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
        shippingAddress: data.shippingAddress,
        totalAmount: 0, // Calculate in real scenario
      },
    });

    return order;
  }

  async getOrderById(id: string): Promise<OrderDTO> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    return order;
  }
}
```

### 3. Create Controller
**File**: `src/modules/order/order.controller.ts`

```typescript
import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.id; // From auth middleware
    const order = await this.orderService.createOrder(userId, req.body);
    
    res.status(201).json({
      success: true,
      data: order,
    });
  });

  getOrder = asyncHandler(async (req: Request, res: Response) => {
    const order = await this.orderService.getOrderById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: order,
    });
  });
}
```

### 4. Create Routes
**File**: `src/modules/order/order.routes.ts`

```typescript
import { Router } from "express";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { validate } from "../../shared/middleware/validation.middleware";
import { createOrderSchema } from "./order.types";

export function createOrderRouter(): Router {
  const router = Router();

  const orderService = new OrderService();
  const orderController = new OrderController(orderService);

  router.post(
    "/",
    validate({ body: createOrderSchema }),
    orderController.createOrder
  );

  router.get("/:id", orderController.getOrder);

  return router;
}
```

### 5. Create Index
**File**: `src/modules/order/index.ts`

```typescript
export { OrderService } from "./order.service";
export { OrderController } from "./order.controller";
export { createOrderRouter } from "./order.routes";
export * from "./order.types";
```

### 6. Register in App
**File**: `src/app.ts`

```typescript
import { createOrderRouter } from "./modules/order/order.routes";

export function createApp(): Express {
  // ... existing code ...
  
  app.use("/api/orders", createOrderRouter());
  
  // ... error middleware ...
}
```

### 7. Update Prisma Schema
**File**: `prisma/schema.prisma`

```prisma
model Order {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  items     OrderItem[]
  totalAmount Decimal
  status    String   @default("pending")
  shippingAddress String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model OrderItem {
  id        String   @id @default(uuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  quantity  Int
}
```

### 8. Run Migration
```bash
npx prisma migrate dev --name create_order
```

---

## Best Practices Going Forward

### ✅ Do This
- Keep each module independent
- Use services for data access (never direct Prisma in controllers)
- Validate all inputs with Zod
- Throw custom errors (`NotFoundError`, `ValidationError`, etc.)
- Use `asyncHandler` for all async route handlers
- Export from `module/index.ts` for clean imports

### ❌ Don't Do This
- Import from another module's internal files (always use `index.ts`)
- Access Prisma directly in controllers
- Use generic `Error` instead of custom error classes
- Mix business logic and HTTP concerns in controllers
- Create global dependencies without using the DI pattern

---

## Testing Each Module

Since modules are isolated, testing is straightforward:

```typescript
// order.service.test.ts
import { OrderService } from "./order.service";

describe("OrderService", () => {
  const orderService = new OrderService();

  it("should create an order", async () => {
    const order = await orderService.createOrder("user-123", {
      items: [{ productId: "prod-1", quantity: 2 }],
      shippingAddress: "123 Main St",
    });

    expect(order.id).toBeDefined();
  });

  it("should throw NotFoundError for invalid user", async () => {
    await expect(
      orderService.createOrder("invalid-user", {
        items: [],
        shippingAddress: "123 Main St",
      })
    ).rejects.toThrow(NotFoundError);
  });
});
```

---

## Troubleshooting

### Problem: "Module not found"
**Solution**: Make sure you're importing from `module/index.ts`, not internal files.

```typescript
// ✅ Good
import { ProductService } from "../product";

// ❌ Bad
import { ProductService } from "../product/product.service";
```

### Problem: Circular dependencies
**Solution**: Use the DI container or pass dependencies to constructors.

### Problem: Services running tests fail
**Solution**: Mock Prisma queries or use a test database.

---

## Summary of Changes

1. ✅ Created modular structure (modules/ folder)
2. ✅ Moved all business logic into services
3. ✅ Added comprehensive error handling
4. ✅ Added request validation with Zod
5. ✅ Centralized Prisma and utilities
6. ✅ Removed old layered structure (still available)
7. ✅ Prepared for microservices migration

You're now ready to scale! 🚀
