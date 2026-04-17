# Quick Start: Modular Monolith

## Installation

```bash
# 1. Install new dependencies
npm install zod

# 2. Check that you have all dependencies
npm ls

# 3. Run the development server
npm run dev
```

If you get errors about missing packages, install them:
```bash
npm install
```

---

## Folder Structure at a Glance

```
src/
├── modules/                    # Domain-based modules
│   ├── auth/                   # User authentication
│   ├── product/                # Product management
│   ├── category/               # Category management
│   └── [new-module]/           # Add more modules here
│
├── shared/                     # Shared infrastructure
│   ├── prisma/
│   │   └── client.ts          # Centralized DB connection
│   ├── middleware/
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── asyncHandler.ts
│   ├── config/
│   │   └── container.ts       # Dependency injection
│   └── types/
│       └── error.ts           # Custom errors
│
├── app.ts                      # Express app + route registration
└── server.ts                   # Server entry point
```

---

## Module Structure (Each Module Has These Files)

```
modules/[module-name]/
├── [module].types.ts      # Types + Zod validation schemas
├── [module].service.ts    # Business logic
├── [module].controller.ts # HTTP handlers
├── [module].routes.ts     # Route definitions
└── index.ts               # Public exports
```

---

## How It Works: Request Flow

```
1. Client Request
        ↓
2. Express Middleware (cors, json, etc.)
        ↓
3. Module Routes (validation middleware)
        ↓
4. Controller (receives validated request)
        ↓
5. Service (business logic + database)
        ↓
6. Prisma Client (single DB instance)
        ↓
7. Database
        ↓
8. Response (or caught error)
        ↓
9. Error Middleware (formats error response)
        ↓
10. Client Response
```

---

## API Endpoints

### Auth Module
```
POST   /api/auth/register
POST   /api/auth/login
```

### Product Module
```
GET    /api/products              (list with filters)
GET    /api/products/:id          (single product)
POST   /api/products              (create)
PUT    /api/products/:id          (update)
DELETE /api/products/:id          (delete)
```

### Category Module
```
GET    /api/categories            (list)
GET    /api/categories/:id        (single)
POST   /api/categories            (create)
PUT    /api/categories/:id        (update)
DELETE /api/categories/:id        (delete)
```

---

## Error Response Format

All errors return this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "details": {...},
  "timestamp": "2026-04-17T10:30:00Z"
}
```

Common status codes:
- `400` - Validation error
- `401` - Unauthorized
- `404` - Not found
- `409` - Conflict (e.g., duplicate)
- `500` - Server error

---

## Success Response Format

```json
{
  "success": true,
  "data": {...}
}
```

For paginated responses:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Creating Your First Module

Run through the template in `MIGRATION_GUIDE.md` (section "Example: Adding a New Module").

Key files to create:
1. `types.ts` - Define your Zod schemas
2. `service.ts` - Write your business logic
3. `controller.ts` - Handle HTTP requests
4. `routes.ts` - Define endpoints
5. `index.ts` - Export public API
6. Update `app.ts` to register routes

---

## Key Concepts

### 1. Services Are Isolated
Each service only cares about its domain. No service imports another service directly (unless needed).

### 2. All DB Access Goes Through Prisma
Never query the database outside of services:
```typescript
// ✅ Good
const product = await productService.getProductById(id);

// ❌ Bad
import { prisma } from "../shared/prisma";
const product = await prisma.product.findUnique({...});
```

### 3. Validation Happens First
All inputs are validated with Zod BEFORE reaching controllers:
```typescript
router.post("/", 
  validate({ body: createProductSchema }),
  controller.create
);
```

### 4. Errors Are Structured
Use custom errors for automatic error handling:
```typescript
throw new NotFoundError("Product not found");
throw new ValidationError("Invalid input");
throw new ConflictError("Email already used");
```

### 5. Async/Await Is Safe
Use `asyncHandler` to automatically catch errors:
```typescript
const createProduct = asyncHandler(async (req, res) => {
  // If this throws, it's automatically handled
  const product = await service.create(req.body);
  res.json(product);
});
```

---

## Common Patterns

### Getting Data From Service
```typescript
const product = await productService.getProductById(id);
```

### Checking if Resource Exists
```typescript
const product = await prisma.product.findUnique({ where: { id } });
if (!product) throw new NotFoundError("Not found");
```

### Cross-Module Communication
```typescript
// In order.service.ts
const productService = new ProductService();
const available = await productService.checkInventory(productId, qty);
```

### Type-Safe Request/Response
```typescript
// In controller
const data = req.body as CreateProductRequest;
const product = await service.create(data);

res.json({
  success: true,
  data: product,
});
```

---

## Testing

Test services independently:
```bash
npm test
```

Test a specific module:
```bash
npm test -- src/modules/product/product.service.test.ts
```

---

## Next: Scaling to Microservices

When you're ready, each module can become a microservice:

**Current (Monolith)**
```
+-----------+
| Monolith  |
| Auth      |
| Product   |
| Category  |
| OrderDb   |
+-----------+
```

**Future (Microservices)**
```
+----------+    +----------+    +----------+
| Auth Svc |    | Product  |    | Category |
|          |    | Svc      |    | Svc      |
| AuthDb   |    | ProdDb   |    | CatDb    |
+----------+    +----------+    +----------+
        |             |              |
        +-----+-------+------+-------+
              |              |
          API Gateway    Service Discovery
```

The refactoring is already done to prepare for this!

---

## Troubleshooting

### "Cannot find module 'zod'"
```bash
npm install zod
```

### "Prisma error: DATABASE_URL not in .env"
```env
# .env
DATABASE_URL="mysql://user:pass@localhost:3306/db"
JWT_SECRET="your-secret"
```

### "Service not defined"
Make sure you're instantiating services in routes:
```typescript
const productService = new ProductService();
const controller = new ProductController(productService);
```

---

## What's Different From Before?

| Before | After |
|--------|-------|
| `src/controllers/` | `src/modules/*/controller.ts` |
| `src/services/` | `src/modules/*/service.ts` |
| `src/routes/` | `src/modules/*/routes.ts` |
| Direct Prisma access | Through services only |
| Try-catch in routes | `asyncHandler` wrapper |
| Manual error responses | Global error middleware |
| No validation | Zod schema validation |
| Global scope issues | Module-scoped services |

---

## Resources

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full architecture explanation
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Detailed migration steps
- [Zod Docs](https://zod.dev) - Validation library
- [Prisma Docs](https://www.prisma.io/docs/) - Database ORM
- [Express Best Practices](https://expressjs.com/en/guide/security.html)

---

Now you're ready to develop! 🚀
