# Modular Monolith Architecture

## Overview

This project has been refactored from a traditional layered architecture (controllers/services/routes folders) into a **modular monolith architecture**. This structure is designed to:

1. **Keep code organized by domain**, not by layer
2. **Prepare for microservices** - each module can eventually become a microservice
3. **Maintain a single database** while ensuring strict module boundaries
4. **Follow clean architecture principles** within each module

---

## Folder Structure

```
src/
├── modules/                    # Domain-specific modules
│   ├── auth/                   # Authentication module
│   │   ├── auth.controller.ts  # HTTP handlers
│   │   ├── auth.service.ts     # Business logic
│   │   ├── auth.routes.ts      # Route definitions
│   │   ├── auth.types.ts       # Types & validation schemas (Zod)
│   │   └── index.ts            # Public exports
│   │
│   ├── product/                # Product module
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.routes.ts
│   │   ├── product.types.ts
│   │   └── index.ts
│   │
│   └── category/               # Category module
│       ├── category.controller.ts
│       ├── category.service.ts
│       ├── category.routes.ts
│       ├── category.types.ts
│       └── index.ts
│
├── shared/                     # Shared infrastructure
│   ├── prisma/
│   │   └── client.ts           # Centralized Prisma instance
│   ├── middleware/
│   │   ├── error.middleware.ts # Global error handler
│   │   ├── validation.middleware.ts  # Request validation
│   │   └── index.ts
│   ├── utils/
│   │   ├── jwt.ts              # JWT token utilities
│   │   ├── asyncHandler.ts     # Async error wrapper
│   │   └── index.ts
│   ├── config/
│   │   └── container.ts        # Dependency injection
│   ├── types/
│   │   └── error.ts            # Custom error classes
│   └── ...
│
├── app.ts                      # Express app setup & route registration
└── server.ts                   # Server entry point
```

---

## Key Principles

### 1. **Module Isolation**

Each module is completely self-contained:

```typescript
// ✅ Good: Module communicates through its service
const product = await productService.getProductById(id);

// ❌ Bad: Directly accessing another module's service
import authService from "../auth/auth.service";
```

### 2. **Centralized Database Access**

All database queries go through the centralized Prisma client:

```typescript
// shared/prisma/client.ts
export const prisma = new PrismaClient();

// In any service
import { prisma } from "../../shared/prisma/client";

await prisma.user.create(...);
```

### 3. **Clear Separation of Concerns**

- **Controller**: HTTP request/response handling only
- **Service**: Business logic only
- **Routes**: Endpoint definitions and middleware chains only
- **Types**: Validation schemas and TypeScript interfaces

### 4. **Error Handling**

Custom error classes provide structured error responses:

```typescript
// shared/types/error.ts
export class ValidationError extends AppError { ... }
export class NotFoundError extends AppError { ... }
export class ConflictError extends AppError { ... }

// Usage in service
throw new ValidationError("Invalid input");
throw new NotFoundError("Resource not found");
```

All errors are caught by the global error middleware and return standardized JSON responses.

### 5. **Request Validation**

Zod schemas validate all requests:

```typescript
// In types file
export const createProductSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  categoryId: z.string().uuid(),
});

// In routes
router.post(
  "/",
  validate({ body: createProductSchema }),
  productController.createProduct
);
```

### 6. **Async Error Handling**

The `asyncHandler` wrapper eliminates try-catch boilerplate:

```typescript
// Without wrapper (old way)
router.get("/", async (req, res, next) => {
  try {
    const data = await service.getData();
    res.json(data);
  } catch (error) {
    next(error);  // Must manually pass to error handler
  }
});

// With wrapper (new way)
const getProducts = asyncHandler(async (req, res) => {
  const data = await service.getData();
  res.json(data);  // Errors automatically caught
});

router.get("/", getProducts);
```

---

## How Routes are Registered

The main app registers all module routes:

```typescript
// src/app.ts
import { createAuthRouter } from "./modules/auth/auth.routes";
import { createProductRouter } from "./modules/product/product.routes";

export function createApp(): Express {
  const app = express();

  // Global middleware
  app.use(cors());
  app.use(express.json());

  // Module routes
  app.use("/api/auth", createAuthRouter());
  app.use("/api/products", createProductRouter());
  app.use("/api/categories", createCategoryRouter());

  // Error middleware (ALWAYS last)
  app.use(errorMiddleware);

  return app;
}
```

---

## Module Template: Creating a New Module

When adding a new feature, follow this template:

### 1. Create Module Files

```typescript
// src/modules/order/order.types.ts
import { z } from "zod";

export const createOrderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive(),
  })),
});

export type CreateOrderRequest = z.infer<typeof createOrderSchema>;
```

### 2. Create Service

```typescript
// src/modules/order/order.service.ts
import { prisma } from "../../shared/prisma/client";
import { CreateOrderRequest } from "./order.types";

export class OrderService {
  async createOrder(data: CreateOrderRequest) {
    // Business logic with Prisma
    const order = await prisma.order.create({ data: {...} });
    
    // Can call other module services if needed
    // E.g., check product inventory
    return order;
  }
}
```

### 3. Create Controller

```typescript
// src/modules/order/order.controller.ts
import { OrderService } from "./order.service";

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = asyncHandler(async (req, res) => {
    const order = await this.orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  });
}
```

### 4. Create Routes

```typescript
// src/modules/order/order.routes.ts
export function createOrderRouter(): Router {
  const router = Router();
  const service = new OrderService();
  const controller = new OrderController(service);

  router.post("/", validate({ body: createOrderSchema }), controller.createOrder);

  return router;
}
```

### 5. Export from Module

```typescript
// src/modules/order/index.ts
export { OrderService } from "./order.service";
export { OrderController } from "./order.controller";
export { createOrderRouter } from "./order.routes";
export * from "./order.types";
```

### 6. Register in App

```typescript
// src/app.ts
import { createOrderRouter } from "./modules/order/order.routes";

app.use("/api/orders", createOrderRouter());
```

---

## Inter-Module Communication

### Pattern 1: Through Parent Service (Recommended)

If a service needs data from another module, it calls the other module's service:

```typescript
// order.service.ts
export class OrderService {
  async createOrder(data: CreateOrderRequest) {
    // Initialize product service if needed
    const productService = new ProductService();
    
    // Check inventory
    for (const item of data.items) {
      const available = await productService.checkInventory(
        item.productId,
        item.quantity
      );
      
      if (!available) {
        throw new ValidationError("Insufficient inventory");
      }
    }

    // Create order
    return prisma.order.create({ data: {...} });
  }
}
```

### Pattern 2: Using Dependency Injection

For more complex scenarios, use the DI container:

```typescript
// src/shared/config/container.ts
export const container = new DIContainer();

// In app.ts setup
container.register('productService', new ProductService());

// In order.service.ts
export class OrderService {
  private productService = container.get('productService');
}
```

### Important Rules

- ✅ **Allowed**: A service calling another module's service
- ❌ **Not Allowed**: A controller directly accessing another module's database
- ❌ **Not Allowed**: A route handler importing another module's controller
- ❌ **Not Allowed**: Direct Prisma queries outside of services

---

## Error Handling Examples

```typescript
// Validation error
throw new ValidationError("Invalid input", { field: "email" });

// Not found
throw new NotFoundError("Product not found");

// Conflict
throw new ConflictError("Email already exists");

// Unauthorized
throw new UnauthorizedError("Invalid credentials");

// Generic error (500)
throw new AppError("Something went wrong", 500);
```

Response format (automatically handled by error middleware):

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 400,
  "details": [...],
  "timestamp": "2026-04-17T10:30:00Z"
}
```

---

## Benefits of This Architecture

### Now (Monolith Benefits)
- 🎯 Clear domain boundaries
- 🔧 Easy to locate and modify related code
- 📦 Modules are loosely coupled
- 🧪 Easy to test individual modules
- 🚀 Consistent patterns across all modules

### Later (Microservices-Ready)
- 🔄 Each module can become a microservice with minimal refactoring
- 📡 Module's service becomes a standalone API
- 🗄️ Database can be migrated per module
- 🤝 Modules communicate via API instead of direct calls

---

## Next Steps: Scaling to Microservices

When ready to split into microservices:

1. **Module Service → Standalone Service**
   ```typescript
   // Extract order.service.ts into separate service
   // Replace direct service calls with HTTP calls
   ```

2. **Shared Prisma → Separate Databases**
   ```typescript
   // Each module gets its own Prisma instance and database
   // Cross-module queries use HTTP APIs
   ```

3. **Shared Middleware → API Gateway**
   ```typescript
   // Error handling, validation, auth moved to gateway
   // Services become lightweight handlers
   ```

4. **Service Discovery**
   ```typescript
   // Services register with a discovery service
   // Allow dynamic service location
   ```

---

## Development Workflow

### Adding a Feature to Existing Module
1. Add endpoint to `module.types.ts` (schema + types)
2. Add method to `module.service.ts` (business logic)
3. Add handler to `module.controller.ts` (HTTP handler)
4. Add route to `module.routes.ts`

### Creating New Module
Follow the "Module Template" section above

### Modifying Shared Code
- Change in `shared/` folder affects all modules
- Coordinate with team members
- Run full test suite after changes

---

## Configuration

### Environment Variables

```env
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
PORT=5000
```

### Prisma Schema

Add models to [prisma/schema.prisma]('../prisma/schema.prisma'), then:

```bash
npx prisma migrate dev --name add_new_model
```

---

## Summary

This modular monolith architecture provides:

✅ **Clear structure** - Code organized by domain
✅ **Easy maintenance** - Related code is collocated
✅ **Testability** - Modules are independent
✅ **Microservices ready** - Smooth migration path
✅ **Type safety** - Full TypeScript support
✅ **Error handling** - Structured error responses
✅ **Validation** - Request validation with Zod
✅ **Scalability** - Easy to add new modules

The key is maintaining module boundaries and following the established patterns.
