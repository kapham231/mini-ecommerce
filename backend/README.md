# Mini E-Commerce Backend

Express.js + TypeScript + Prisma with Modular Monolith Architecture

**Production-Ready** | **Well Documented** | **Microservices-Ready**

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup database
- If this is a fresh PostgreSQL environment, run:
    ```bash
    npx prisma migrate dev --name init
    ```
    If you are reusing an existing database schema after switching from MySQL, run:
    ```bash
    npx prisma migrate reset --force
    ```

# 4. Start development server
npm run dev
```

Your API is now running on `http://localhost:5000`

---

## Project Structure

```
backend/
├── src/
│   ├── modules/                  # Domain-based modules
│   │   ├── auth/                 # Authentication
│   │   ├── product/              # Product management
│   │   └── category/             # Category management
│   │
│   ├── shared/                   # Shared infrastructure
│   │   ├── prisma/               # Database client
│   │   ├── middleware/           # Global middleware
│   │   ├── utils/                # Utilities
│   │   ├── config/               # Configuration
│   │   └── types/                # Custom types
│   │
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
│
├── docs/                         # Documentation
│   ├── QUICKSTART.md             # Quick reference guide
│   ├── ARCHITECTURE.md           # Architecture documentation
│   ├── FOLDER_STRUCTURE.md       # Folder and file reference
│   ├── MIGRATION_GUIDE.md        # Guide for extending modules
│   ├── IMPLEMENTATION_EXAMPLES.md# Code patterns and examples
│   ├── TESTING_GUIDE.md          # API testing guide
│   ├── DOCUMENTATION_INDEX.md    # Documentation navigation
│   └── README_REFACTORING.md     # Refactoring summary
│
├── package.json
├── tsconfig.json
└── README.md (you are here)
```

---

## Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# Compile TypeScript
npx tsc

# Run production build
npm start

# Database commands
npx prisma migrate dev           # Create new migration
npx prisma migrate deploy        # Apply migrations
npx prisma studio               # Open Prisma Studio

# Testing
npm test
```

---

## Documentation

All documentation is organized in the `docs/` folder:

| Document | Purpose | Length |
|----------|---------|--------|
| QUICKSTART.md | Quick reference and overview | Quick |
| ARCHITECTURE.md | Architectural principles and design | Complete |
| FOLDER_STRUCTURE.md | File and folder reference guide | Reference |
| MIGRATION_GUIDE.md | Guide for adding new modules | Tutorial |
| IMPLEMENTATION_EXAMPLES.md | Real code patterns and examples | Examples |
| REFACTORING_SUMMARY.md | Before and after comparison | Summary |
| TESTING_GUIDE.md | API testing and verification | Testing |
| DOCUMENTATION_INDEX.md | Documentation navigation | Index |

**Start with:** docs/QUICKSTART.md

---

## Architecture Overview

This project uses a Modular Monolith architecture:

```
HTTP Request
    |
Express Middleware
    |
Module Routes
    |
Validation (Zod)
    |
Controller (HTTP handler)
    |
Service (Business logic)
    |
Prisma Client (Database)
    |
Response
```

Key Features:

- Domain-Based Organization: Code organized by business logic, not layers
- Module Independence: Each module is self-contained and testable
- Type Safety: Full TypeScript support with Zod validation
- Global Error Handling: Structured error middleware
- Clean Architecture: Clear separation of concerns
- Microservices Ready: Each module can become a service

---

## API Endpoints

### Authentication
```
POST   /api/auth/register    Register new user
POST   /api/auth/login       Login user
```

### Products
```
GET    /api/products              List products (with filtering)
GET    /api/products/:id          Get single product
POST   /api/products              Create product
PUT    /api/products/:id          Update product
DELETE /api/products/:id          Delete product
```

### Categories
```
GET    /api/categories            List categories
GET    /api/categories/:id        Get single category
POST   /api/categories            Create category
PUT    /api/categories/:id        Update category
DELETE /api/categories/:id        Delete category
```

See docs/TESTING_GUIDE.md for complete API testing instructions.

---

## Module Structure

Each module has exactly 5 files:

```
modules/[module-name]/
├── [module].types.ts       # Zod schemas + TypeScript types
├── [module].service.ts     # Business logic
├── [module].controller.ts  # HTTP request handlers
├── [module].routes.ts      # Express routes + middleware
└── index.ts                # Public API exports
```

All modules are registered in `src/app.ts`

---

## Testing

### Running the Server

```bash
npm run dev
```

### Testing API

```bash
# Health check
curl http://localhost:5000/health

# List all categories
curl http://localhost:5000/api/categories

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'
```

See docs/TESTING_GUIDE.md for complete testing guide and more examples.

---

## How to Add New Features

### Add Feature to Existing Module

1. Update `module.types.ts` - Add validation schema
2. Add method to `module.service.ts` - Implement business logic
3. Add handler to `module.controller.ts` - Handle HTTP request
4. Add route to `module.routes.ts` - Define endpoint
5. Test the new endpoint

See docs/MIGRATION_GUIDE.md for complete instructions.

### Create New Module

Follow the complete template in docs/MIGRATION_GUIDE.md

Steps:
1. Create module folder
2. Create 5 required files (types, service, controller, routes, index)
3. Add Prisma models
4. Register in app.ts

---

## Future: Scaling to Microservices

Each module is prepared to become an independent microservice:

Current (Monolith)
```
Single Repository
- Auth Service
- Product Service
- Category Service
- Single Database
```

Future (Microservices)
```
Auth Service (separate repo/container)
- Own database
- Own API
- Communicates via REST

Product Service (separate repo/container)
- Own database
- Own API
- Communicates via REST
```

No architectural changes needed - module structure is already prepared. See docs/ARCHITECTURE.md for details.

---

## Environment Variables

Create `.env` file in root:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/mini_ecommerce"

# JWT
JWT_SECRET="your-secret-key-change-in-production"

# Server
NODE_ENV="development"
PORT=5000
```

---

## Dependencies

### Runtime
- express: Web framework
- @prisma/client: ORM
- bcrypt: Password hashing
- jsonwebtoken: JWT tokens
- zod: Request validation
- cookie-parser: Cookie parsing
- cors: CORS support
- dotenv: Environment variables
- slugify: URL slug generation

### Development
- typescript: Type safety
- ts-node-dev: Development server
- @types/*: TypeScript definitions

---

## Error Handling

All errors return standardized JSON:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "details": {...},
  "timestamp": "2026-04-17T10:30:00Z"
}
```

Common Status Codes:
- 200: Success
- 201: Created
- 400: Validation error
- 401: Unauthorized
- 404: Not found
- 409: Conflict
- 500: Server error

---

## Security

- Password hashing with bcrypt
- JWT authentication
- Input validation with Zod
- CORS protection
- HTTP-only cookies for tokens
- Type-safe queries (Prisma)

---

## Project Statistics

| Metric | Count |
|--------|-------|
| Modules | 3 |
| Documentation Files | 9 |
| Source Files | 26 |
| Test Scenarios | 20+ |

---

## Contributing

When adding new features:

1. Follow Module Pattern - Keep module isolation
2. Validate Inputs - Use Zod schemas
3. Use Custom Errors - (NotFoundError, ValidationError, etc.)
4. Add Types - Full TypeScript coverage
5. Test API - Use cURL or Postman
6. Update Docs - If adding new pattern

See docs/DOCUMENTATION_INDEX.md for complete guidelines.

---

## Checklist for New Developer

- Read docs/QUICKSTART.md
- Run `npm install && npm run dev`
- Follow docs/TESTING_GUIDE.md
- Review module structure
- Try adding a simple feature
- Ask questions via documentation

---

## Quick Links

| Need | Link |
|------|------|
| Quick overview | docs/QUICKSTART.md |
| Understand architecture | docs/ARCHITECTURE.md |
| File reference | docs/FOLDER_STRUCTURE.md |
| Add new module | docs/MIGRATION_GUIDE.md |
| Code examples | docs/IMPLEMENTATION_EXAMPLES.md |
| Test the API | docs/TESTING_GUIDE.md |
| Find anything | docs/DOCUMENTATION_INDEX.md |

---

## Notes

- Old folders (controllers/, services/, routes/) have been removed
- All documentation is in docs/ folder
- This architecture is production-ready
- Supports scaling to microservices when needed

---

## Next Steps

1. Setup - Follow the Quick Start section above
2. Learn - Read docs/QUICKSTART.md
3. Test - Follow docs/TESTING_GUIDE.md
4. Build - Use docs/IMPLEMENTATION_EXAMPLES.md

---

Architecture Version: Modular Monolith v1.0
Last Updated: April 17, 2026
Status: Production Ready
