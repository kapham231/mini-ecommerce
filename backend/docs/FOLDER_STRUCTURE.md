# New Project Structure at a Glance

This document shows the complete new folder structure and what each file does.

---

## Complete File Tree

```
backend/
│
├── src/
│   │
│   ├── modules/                          # 🏢 Domain-based modules
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.types.ts             # ✓ Zod schemas + TypeScript types
│   │   │   ├── auth.service.ts           # ✓ Business logic (register, login)
│   │   │   ├── auth.controller.ts        # ✓ HTTP handlers
│   │   │   ├── auth.routes.ts            # ✓ Express router + endpoints
│   │   │   └── index.ts                  # ✓ Public API exports
│   │   │
│   │   ├── product/
│   │   │   ├── product.types.ts          # ✓ Query/create schemas
│   │   │   ├── product.service.ts        # ✓ CRUD + inventory logic
│   │   │   ├── product.controller.ts     # ✓ HTTP handlers for all endpoints
│   │   │   ├── product.routes.ts         # ✓ All product routes
│   │   │   └── index.ts                  # ✓ Public API exports
│   │   │
│   │   └── category/
│   │       ├── category.types.ts         # ✓ Zod schemas
│   │       ├── category.service.ts       # ✓ Category CRUD
│   │       ├── category.controller.ts    # ✓ HTTP handlers
│   │       ├── category.routes.ts        # ✓ Category routes
│   │       └── index.ts                  # ✓ Public API exports
│   │
│   ├── shared/                           # 🔧 Infrastructure & utilities
│   │   │
│   │   ├── prisma/
│   │   │   └── client.ts                 # ✓ Singleton Prisma client
│   │   │
│   │   ├── middleware/
│   │   │   ├── error.middleware.ts       # ✓ Global error handler
│   │   │   ├── validation.middleware.ts  # ✓ Zod validation wrapper
│   │   │   └── index.ts                  # ✓ Export all middleware
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.ts                    # ✓ Token generation/verification
│   │   │   ├── asyncHandler.ts           # ✓ Async route wrapper
│   │   │   └── index.ts                  # ✓ Export all utils
│   │   │
│   │   ├── config/
│   │   │   └── container.ts              # ✓ Dependency injection
│   │   │
│   │   └── types/
│   │       └── error.ts                  # ✓ Custom error classes
│   │
│   ├── app.ts                            # ✓ Express app setup + route registration
│   └── server.ts                         # ✓ Server entry point
│
├── prisma/
│   ├── schema.prisma                     # 📦 Database schema
│   ├── migrations/
│   ├── seed.ts
│
├── package.json                          # ✓ Updated with zod
├── tsconfig.json
├── ARCHITECTURE.md                       # 📖 Full architecture guide
├── MIGRATION_GUIDE.md                    # 📖 Step-by-step migration
├── QUICKSTART.md                         # 📖 Quick reference
├── REFACTORING_SUMMARY.md                # 📖 Before/after comparison
├── IMPLEMENTATION_EXAMPLES.md            # 📖 Code examples & patterns
├── FOLDER_STRUCTURE.md                   # 📖 This file
└── README.md
```

---

## Module Structure In Detail

### Each module has exactly 5 files:

```
modules/[MODULE-NAME]/
├── [module].types.ts       ← Types & validation
├── [module].service.ts     ← Business logic
├── [module].controller.ts  ← HTTP handlers
├── [module].routes.ts      ← Endpoint definitions
└── index.ts                ← Public exports
```

### File Responsibilities:

| File | Responsibility | Example |
|------|-----------------|---------|
| `types.ts` | Zod schemas + TypeScript types | `createProductSchema`, `ProductDTO` |
| `service.ts` | Business logic + database access | `getProduct()`, `createProduct()` |
| `controller.ts` | HTTP request/response handling | Call service, format response |
| `routes.ts` | Express router + middleware chain | `router.post("/", validate(...), handler)` |
| `index.ts` | Public API (what other modules import) | `export { ProductService } from ...` |

---

## Request Flow Through Modules

```
HTTP POST /api/products
    ↓
app.ts routes request to module
    ↓
product.routes.ts receives request
    ↓
Validation middleware (Zod schema)
    ↓
Product controller
    ↓
Product service (business logic)
    ↓
Prisma client (database)
    ↓
Response formatted + sent back
    ↓
(If error) Error middleware catches it
    ↓
Structured error response
```

---

## Shared Layer Files

### `prisma/client.ts`
- Singleton instance of Prisma client
- Used by ALL services
- Connection pooling handled by Prisma

### `middleware/error.middleware.ts`
- Catches ALL errors in express pipeline
- Returns structured JSON response
- Last middleware in chain

### `middleware/validation.middleware.ts`
- Validates request body/query/params
- Uses Zod schemas
- Applied to routes before controllers

### `utils/asyncHandler.ts`
- Wraps async route handlers
- Automatically catches errors
- Passes to error middleware

### `utils/jwt.ts`
- Generate JWT tokens
- Verify JWT tokens
- Used by auth module and others

### `config/container.ts`
- Dependency injection container
- Register services
- Retrieve services by name

### `types/error.ts`
- `AppError` base class
- `ValidationError` (400)
- `NotFoundError` (404)
- `UnauthorizedError` (401)
- `ConflictError` (409)

---

## How Files Connect

### Module A → Module B Communication

```
order.service.ts
    ↓ imports
product/index.ts
    ↓ exports
ProductService
```

**Pattern**: Import services from `module/index.ts`, not internal files

---

## Import Patterns (Correct Way)

### ✅ Import from Public Index
```typescript
import { ProductService } from "../product";
import { ProductDTO } from "../product";
```

### ❌ Don't Import Internal Files
```typescript
// Bad - don't do this
import ProductService from "../product/product.service";
import { ProductDTO } from "../product/product.types";
```

### Shared Imports
```typescript
import { prisma } from "../../shared/prisma/client";
import { NotFoundError } from "../../shared/types/error";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { validate } from "../../shared/middleware/validation.middleware";
```

---

## File Sizes (Estimate)

| File | Lines | Purpose |
|------|-------|---------|
| `module.types.ts` | 30-50 | Zod + interfaces |
| `module.service.ts` | 100-300 | Business logic |
| `module.controller.ts` | 50-100 | HTTP handlers |
| `module.routes.ts` | 30-50 | Route definitions |
| `module.index.ts` | 5-10 | Exports |
| **Total per module** | **215-510** | One complete module |

---

## Creating a New Module Checklist

- [ ] Create `modules/[name]/` directory
- [ ] Create `[name].types.ts` with Zod schemas
- [ ] Create `[name].service.ts` with business logic
- [ ] Create `[name].controller.ts` with HTTP handlers
- [ ] Create `[name].routes.ts` with Express router
- [ ] Create `index.ts` with exports
- [ ] Import router in `app.ts`
- [ ] Register route: `app.use("/api/[name]", create[Name]Router())`
- [ ] Add Prisma models to `schema.prisma`
- [ ] Run migration: `npx prisma migrate dev`

---

## Do's and Don'ts

### ✅ DO:
- Keep modules independent
- Use services for all database access
- Validate all inputs with Zod
- Use custom error classes
- Export from `index.ts`
- Call other modules through their services
- Use `asyncHandler` for all async routes

### ❌ DON'T:
- Direct Prisma access in controllers
- Import internal files (use `index.ts`)
- Mix business logic and HTTP handling
- Use generic `Error` class
- Access other modules' data directly
- Create new middleware without good reason
- Hardcode values (use env vars)

---

## Route Organization

All routes registered in `app.ts`:

```typescript
// src/app.ts
app.use("/api/auth", createAuthRouter());
app.use("/api/products", createProductRouter());
app.use("/api/categories", createCategoryRouter());
```

### Route Hierarchy
```
/api/
├── /auth
│   ├── POST   /register
│   └── POST   /login
├── /products
│   ├── GET    /
│   ├── GET    /:id
│   ├── POST   /
│   ├── PUT    /:id
│   └── DELETE /:id
└── /categories
    ├── GET    /
    ├── GET    /:id
    ├── POST   /
    ├── PUT    /:id
    └── DELETE /:id
```

---

## Environment Configuration

```env
# .env file
DATABASE_URL="postgresql://postgres:password@localhost:5432/db"
JWT_SECRET="your-secret-key"
NODE_ENV="development"
PORT=5000
```

---

## Development Workflow

### Add Feature to Existing Module
```
1. Update `module.types.ts` (add schema)
2. Add method to `module.service.ts`
3. Add handler to `module.controller.ts`
4. Add route to `module.routes.ts`
```

### Create New Module
```
1. Create module folder
2. Create 5 files (follow template)
3. Add models to `prisma/schema.prisma`
4. Run migration
5. Register in `app.ts`
```

### Fix Bug
```
1. Find problematic service method
2. Fix logic in `.service.ts`
3. No changes needed in controller/routes (usually)
4. Test change
```

---

## Documentation Map

| Document | What It Contains |
|----------|-----------------|
| `ARCHITECTURE.md` | Deep dive into design philosophy |
| `QUICKSTART.md` | 5-minute quick reference |
| `MIGRATION_GUIDE.md` | Step-by-step instructions |
| `REFACTORING_SUMMARY.md` | Before/after comparison |
| `IMPLEMENTATION_EXAMPLES.md` | Real code examples |
| `FOLDER_STRUCTURE.md` | This file - file reference |

---

## Next: Scaling to Microservices

When a module becomes large, split it:

**Step 1: Extract Module Service**
- Move `order.service.ts` to separate repository
- Expose as REST API

**Step 2: Replace Direct Calls**
```typescript
// Before (monolith)
const order = await orderService.createOrder(data);

// After (microservice)
const response = await fetch("http://orders-service/api/orders", {...});
const order = await response.json();
```

**Step 3: Add Service Discovery**
- Use environment variables or service mesh
- Dynamic service location

**Step 4: DataBase per Service**
- Each module gets own database
- Data consistency handled via events

---

## Summary

The new structure provides:
- ✅ Clear organization by domain
- ✅ Independent modules
- ✅ Type safety with Zod
- ✅ Structured error handling
- ✅ Easy testing
- ✅ Clear path to microservices

All while maintaining a single codebase and database (for now).

See `ARCHITECTURE.md` for deeper understanding!
