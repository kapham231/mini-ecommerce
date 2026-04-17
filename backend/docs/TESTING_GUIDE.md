# Testing the Refactored Architecture

Step-by-step instructions to verify the new modular architecture is working correctly.

---

## Prerequisites

```bash
# Install dependencies
npm install zod

# Verify environment is set up
cat .env
# Should have: DATABASE_URL, JWT_SECRET, NODE_ENV, PORT
```

---

## Quick Sanity Check

### 1. Verify File Structure

```bash
# Check modules exist
ls -la src/modules/
# Should show: auth, product, category

# Check shared folder exists
ls -la src/shared/
# Should show: prisma, middleware, utils, config, types

# Check documentation
ls -la *.md
# Should show: ARCHITECTURE.md, QUICKSTART.md, etc.
```

### 2. Check Node Modules

```bash
# Verify Zod installed
npm ls zod
# Should show: zod@3.x.x (or similar)
```

### 3. Check TypeScript

```bash
# Verify no TypeScript errors
npx tsc --noEmit
# Should complete without errors
```

---

## Start the Server

### Option 1: Development Mode

```bash
npm run dev

# You should see:
# ✅ Server running on port 5000
# 📍 Environment: development
# 🏗️  Architecture: Modular Monolith
```

### Option 2: Build Then Run

```bash
# Compile TypeScript
npx tsc

# Run compiled JavaScript
node dist/server.js
```

---

## API Testing

### Using cURL

#### 1. Health Check
```bash
curl http://localhost:5000/health

# Response:
# {"status":"healthy","timestamp":"2026-04-17T..."}
```

#### 2. Root Endpoint
```bash
curl http://localhost:5000/

# Response:
# {"message":"API is running","version":"1.0.0","architecture":"Modular Monolith"}
```

#### 3. Test Auth Module

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Expected: 201 Created
# {
#   "success": true,
#   "data": {
#     "id": "uuid",
#     "name": "John Doe",
#     "email": "john@example.com",
#     "role": "USER"
#   }
# }
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Expected: 200 OK with token in cookie
```

#### 4. Test Category Module

**Create Category:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics"
  }'

# Expected: 201 Created
# {
#   "success": true,
#   "data": {
#     "id": "uuid",
#     "name": "Electronics",
#     "slug": "electronics",
#     "createdAt": "...",
#     "updatedAt": "..."
#   }
# }
```

**List Categories:**
```bash
curl http://localhost:5000/api/categories

# Expected: 200 OK with array
```

#### 5. Test Product Module

**Create Product:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "categoryId": "uuid-from-category-above",
    "stock": 10,
    "description": "High-end laptop"
  }'

# Expected: 201 Created
```

**List Products:**
```bash
curl "http://localhost:5000/api/products?page=1&limit=10&search=laptop"

# Expected: 200 OK with items and pagination
# {
#   "success": true,
#   "data": [...],
#   "pagination": {
#     "page": 1,
#     "limit": 10,
#     "total": 1,
#     "pages": 1
#   }
# }
```

### Using Postman

1. Import base URL: `http://localhost:5000`
2. Create requests for each endpoint
3. Test different scenarios

---

## Error Testing

### 1. Validation Error

```bash
# Missing required field
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John"
    # missing email and password
  }'

# Expected: 400 Bad Request
# {
#   "success": false,
#   "message": "Validation failed",
#   "statusCode": 400,
#   "details": [...],
#   "timestamp": "..."
# }
```

### 2. Not Found Error

```bash
curl http://localhost:5000/api/products/invalid-uuid

# Expected: 404 Not Found
# {
#   "success": false,
#   "message": "Product not found",
#   "statusCode": 404,
#   "timestamp": "..."
# }
```

### 3. Conflict Error

```bash
# Register same email twice
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "email": "john@example.com",
    "password": "password123"
  }'

# Expected: 409 Conflict
# {
#   "success": false,
#   "message": "Email already exists",
#   "statusCode": 409,
#   "timestamp": "..."
# }
```

### 4. Route Not Found

```bash
curl http://localhost:5000/api/nonexistent

# Expected: 404 Not Found
# {
#   "success": false,
#   "message": "Route not found",
#   "statusCode": 404
# }
```

---

## Code-Level Testing

### 1. Test Service Instantiation

```bash
# Add to a test file temporarily
cd src/modules/product

cat > test.ts << 'EOF'
import { ProductService } from "./product.service";

const service = new ProductService();
console.log("✅ ProductService instantiated successfully");
EOF

npx ts-node test.ts
# Should print: ✅ ProductService instantiated successfully

rm test.ts
```

### 2. Test Error Classes

```bash
# Create test in src/shared/types/
cat > error.test.ts << 'EOF'
import { ValidationError, NotFoundError, ConflictError } from "./error";

const err1 = new ValidationError("Invalid input");
const err2 = new NotFoundError("Not found");
const err3 = new ConflictError("Conflict");

console.log("✅ Error classes working");
console.log(err1.statusCode); // 400
console.log(err2.statusCode); // 404
console.log(err3.statusCode); // 409
EOF

npx ts-node error.test.ts

rm error.test.ts
```

---

## Performance Testing

### Load Test (Optional)

```bash
# Using Apache Bench (if installed)
ab -n 100 -c 10 http://localhost:5000/health

# Results should show:
# - Requests per second
# - Average response time
# - No errors
```

### Database Query Test

```bash
# Enable Prisma logging
# In src/shared/prisma/client.ts, change NODE_ENV check to always log

# Run a query
curl http://localhost:5000/api/products

# Check console for database queries
```

---

## Integration Testing

### Workflow 1: Complete Order (if order module existed)

```
1. Register user
2. Create category
3. Create product
4. Create order with that product
5. Verify all operations succeeded
6. Check database state
```

### Workflow 2: Error Scenarios

```
1. Try to create product with invalid category
   → Should get 400 Validation Error
2. Try to get non-existent product
   → Should get 404 Not Found
3. Try to create duplicate category
   → Should get 409 Conflict
4. Try invalid email format
   → Should get 400 Validation Error
```

---

## Verification Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns 200
- [ ] Can create user (auth/register)
- [ ] Can login user (auth/login)
- [ ] Can create category
- [ ] Can list categories
- [ ] Can create product with valid category
- [ ] Can list products with pagination
- [ ] Can get single product
- [ ] Can update product
- [ ] Can delete product
- [ ] Validation errors return 400
- [ ] Not found errors return 404
- [ ] Conflict errors return 409
- [ ] Error responses are structured
- [ ] TypeScript has no errors
- [ ] All modules in modules/ folder
- [ ] Shared layer accessible
- [ ] Prisma client singleton working

---

## Debugging

### Enable Detailed Logging

```typescript
// src/shared/prisma/client.ts
export const prisma = new PrismaClient({
  log: ["query", "error", "warn", "info"],
});
```

### Check Module Imports

```typescript
// In src/app.ts, verify imports work
import { createAuthRouter } from "./modules/auth/auth.routes"; ✅
import { createProductRouter } from "./modules/product/product.routes"; ✅
import { createCategoryRouter } from "./modules/category/category.routes"; ✅
```

### Watch for Common Issues

1. **"Module not found"** → Check file paths
2. **"Service undefined"** → Check service instantiation in routes
3. **"Prisma error"** → Check DATABASE_URL in .env
4. **"Validation failed"** → Check Zod schema definition
5. **"No response"** → Check error middleware is last in chain

---

## Test Scenarios Summary

| Scenario | Expected | How to Test |
|----------|----------|------------|
| Server starts | Logs to console | `npm run dev` |
| Health check | 200 status | `curl /health` |
| Create with valid data | 201 status | `curl -X POST /api/auth/register {...}` |
| Create with invalid data | 400 status | Missing required fields |
| Get non-existent resource | 404 status | Wrong UUID |
| Duplicate entry | 409 status | Same email twice |
| Invalid request format | 400 status | Malformed JSON |
| Unknown route | 404 status | `/api/unknown` |
| Update resource | 200 status | `PUT /api/products/:id` |
| Delete resource | 200 status | `DELETE /api/products/:id` |

---

## Performance Baselines

| Metric | Good | Accept | Bad |
|--------|------|--------|-----|
| Response time (GET) | < 50ms | < 100ms | > 200ms |
| Response time (POST) | < 100ms | < 200ms | > 500ms |
| Database query | < 10ms | < 50ms | > 100ms |
| Validation | < 5ms | < 10ms | > 50ms |

---

## Continuous Testing

### Pre-commit Hook (Optional)

```bash
# In package.json scripts
"test": "npx tsc --noEmit",
"lint": "eslint src/**/*.ts"

# Then run before commits
npm test && npm run lint
```

---

## Troubleshooting Test Failures

### Server won't start
```bash
# Check port is available
lsof -i :5000

# Check .env exists
cat .env

# Check database connection
npm run db:test

# Check TypeScript errors
npx tsc --noEmit
```

### Validation always fails
```bash
# Check Zod schema (types file)
# Verify middleware is imported
# Verify route has validate() call
```

### Services not working
```bash
# Check service is instantiated in routes.ts
# Check Prisma is imported in service
# Check DATABASE_URL is set
```

---

## Next Steps After Testing

✅ All tests pass?
1. Archive old folders (controllers/, services/, routes/)
2. Update team documentation
3. Start adding new features using module pattern
4. Monitor for edge cases

❌ Tests fail?
1. Check debugging section above
2. Review ARCHITECTURE.md
3. Verify all files were created
4. Check imports and paths

---

Complete testing takes ~30 minutes. The architecture is solid and production-ready! 🚀
