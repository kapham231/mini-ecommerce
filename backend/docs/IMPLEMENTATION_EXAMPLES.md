# Implementation Examples & Common Patterns

This document shows real, copy-paste-ready examples for the most common scenarios.

---

## Example 1: Simple GET Endpoint (List)

### Types
```typescript
// modules/product/product.types.ts
import { z } from "zod";

export const productQuerySchema = z.object({
  page: z.string().optional().default("1").transform(Number),
  limit: z.string().optional().default("10").transform(Number),
  search: z.string().optional(),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
```

### Service
```typescript
// modules/product/product.service.ts
export class ProductService {
  async getProducts(query: ProductQuery) {
    const { page, limit, search } = query;
    
    const where = search 
      ? { name: { contains: search } }
      : {};
    
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}
```

### Controller
```typescript
// modules/product/product.controller.ts
export class ProductController {
  constructor(private productService: ProductService) {}

  getProducts = asyncHandler(async (req: Request, res: Response) => {
    const result = await this.productService.getProducts(
      req.query as unknown as ProductQuery
    );
    
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  });
}
```

### Routes
```typescript
// modules/product/product.routes.ts
export function createProductRouter(): Router {
  const router = Router();
  const service = new ProductService();
  const controller = new ProductController(service);

  router.get(
    "/",
    validate({ query: productQuerySchema }),
    controller.getProducts
  );

  return router;
}
```

---

## Example 2: Creating with Validation

### Types
```typescript
// modules/product/product.types.ts
export const createProductSchema = z.object({
  name: z.string()
    .min(2, "Name too short")
    .max(100, "Name too long"),
  price: z.number()
    .positive("Price must be positive"),
  categoryId: z.string()
    .uuid("Invalid category ID"),
  description: z.string().optional(),
  stock: z.number()
    .int("Stock must be whole number")
    .min(0, "Stock cannot be negative"),
});

export type CreateProductRequest = z.infer<typeof createProductSchema>;
```

### Service
```typescript
// modules/product/product.service.ts
export class ProductService {
  async createProduct(data: CreateProductRequest) {
    // Validation happens in middleware, but we can add business logic checks
    
    // Check category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    
    if (!category) {
      throw new ValidationError("Category not found");
    }

    // Check for duplicates
    const existing = await prisma.product.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictError("Product with this name already exists");
    }

    // Create
    const slug = slugify(data.name);
    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        price: new Decimal(data.price),
        categoryId: data.categoryId,
        description: data.description,
        stock: data.stock,
      },
    });
  }
}
```

### Controller
```typescript
// modules/product/product.controller.ts
export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body as CreateProductRequest;
    const product = await this.productService.createProduct(data);

    res.status(201).json({
      success: true,
      message: "Product created",
      data: product,
    });
  });
}
```

### Routes
```typescript
// modules/product/product.routes.ts
router.post(
  "/",
  validate({ body: createProductSchema }),
  controller.createProduct
);
```

---

## Example 3: Handling Errors Properly

### Service (with error handling)
```typescript
export class ProductService {
  async deleteProduct(id: string) {
    // Check if exists
    const product = await prisma.product.findUnique({ where: { id } });
    
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Soft delete
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateInventory(productId: string, quantityChange: number) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stock: true },
    });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const newStock = product.stock + quantityChange;

    if (newStock < 0) {
      throw new ValidationError(
        "Insufficient inventory",
        { available: product.stock, requested: -quantityChange }
      );
    }

    return prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    });
  }
}
```

### Controller (errors caught automatically)
```typescript
export class ProductController {
  constructor(private productService: ProductService) {}

  // ✅ All errors automatically caught by asyncHandler
  deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.productService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted",
    });
  });
}
```

Result (error middleware handles these):
```json
// For NotFoundError
{
  "success": false,
  "message": "Product not found",
  "statusCode": 404,
  "timestamp": "2026-04-17T10:30:00Z"
}

// For ValidationError with details
{
  "success": false,
  "message": "Insufficient inventory",
  "statusCode": 400,
  "details": {
    "available": 5,
    "requested": 10
  },
  "timestamp": "2026-04-17T10:30:00Z"
}
```

---

## Example 4: Cross-Module Communication

### Scenario: Order module needs product availability

### Order Service
```typescript
// modules/order/order.service.ts
import { ProductService } from "../product"; // Public export

export class OrderService {
  private productService = new ProductService();

  async createOrder(userId: string, items: OrderItem[]) {
    // Validate products
    for (const item of items) {
      const available = await this.productService.checkInventory(
        item.productId,
        item.quantity
      );

      if (!available) {
        throw new ValidationError(
          `Product ${item.productId} has insufficient inventory`
        );
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        items: { create: items },
        status: "pending",
      },
    });

    // Update product inventory
    for (const item of items) {
      await this.productService.updateInventory(item.productId, -item.quantity);
    }

    return order;
  }
}
```

### Key Points
- ✅ Import service from module's `index.ts`
- ✅ Call public service methods
- ✅ Each module still independent
- ⚠️ Future: Replace with HTTP calls when module becomes microservice

---

## Example 5: Type-Safe Responses

### Service Returns Typed Data
```typescript
// product.types.ts
export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### Service Implementation
```typescript
// product.service.ts
async getProducts(query: ProductQuery): Promise<PaginatedResponse<ProductDTO>> {
  // ... implementation
  return {
    data: products as ProductDTO[],
    pagination: { page, limit, total },
  };
}
```

### Controller Uses Types
```typescript
// product.controller.ts
getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await this.productService.getProducts(
    req.query as ProductQuery
  );

  // TypeScript knows result is PaginatedResponse<ProductDTO>
  res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});
```

---

## Example 6: Conditional Logic

### Service
```typescript
export class ProductService {
  async updateProduct(id: string, data: UpdateProductRequest) {
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Only update provided fields
    const updateData: Prisma.ProductUpdateInput = {};

    if (data.name) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }

    if (data.price !== undefined) {
      updateData.price = new Decimal(data.price);
    }

    if (data.stock !== undefined) {
      updateData.stock = data.stock;
    }

    if (data.categoryId) {
      // Validate category
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new ValidationError("Category not found");
      }
      updateData.categoryId = data.categoryId;
    }

    updateData.updatedAt = new Date();

    return prisma.product.update({
      where: { id },
      data: updateData,
    });
  }
}
```

---

## Example 7: Batch Operations

### Service
```typescript
export class ProductService {
  async updatePrices(updates: { id: string; newPrice: number }[]) {
    // Validate all products exist
    const productIds = updates.map(u => u.id);
    const existing = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    if (existing.length !== updates.length) {
      throw new ValidationError("Some products not found");
    }

    // Batch update using Promise.all
    const results = await Promise.all(
      updates.map(update =>
        prisma.product.update({
          where: { id: update.id },
          data: { price: new Decimal(update.newPrice) },
        })
      )
    );

    return results;
  }
}
```

---

## Example 8: Search & Filter

### Types
```typescript
export const searchProductSchema = z.object({
  q: z.string().min(1, "Search term required"),
  category: z.string().uuid().optional(),
  minPrice: z.string().optional().transform(Number),
  maxPrice: z.string().optional().transform(Number),
  inStock: z.string().optional().transform(v => v === "true"),
  sortBy: z.enum(["name", "price", "newest"]).optional(),
  order: z.enum(["asc", "desc"]).optional().default("asc"),
});
```

### Service
```typescript
async searchProducts(params: SearchProductParams) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  // Text search (name + description)
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { description: { contains: params.q, mode: "insensitive" } },
    ];
  }

  // Category filter
  if (params.category) {
    where.categoryId = params.category;
  }

  // Price range
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = params.minPrice;
    if (params.maxPrice) where.price.lte = params.maxPrice;
  }

  // Stock filter
  if (params.inStock) {
    where.stock = { gt: 0 };
  }

  // Determine sort order
  const orderBy = this.mapSortBy(params.sortBy, params.order);

  return prisma.product.findMany({
    where,
    orderBy,
    take: 20,
  });
}

private mapSortBy(sortBy?: string, order?: "asc" | "desc") {
  const sortOrder = (order || "asc") as "asc" | "desc";

  switch (sortBy) {
    case "price":
      return { price: sortOrder };
    case "newest":
      return { createdAt: sortOrder };
    case "name":
    default:
      return { name: sortOrder };
  }
}
```

---

##  Quick Reference: Common Patterns

### Throwing Errors
```typescript
throw new ValidationError("Invalid input", { field: "name" });
throw new NotFoundError("Resource not found");
throw new UnauthorizedError("Not allowed");
throw new ConflictError("Already exists");
```

### Wrapping Async
```typescript
const handler = asyncHandler(async (req, res) => {
  // Errors automatically caught
});
```

### Validating Requests
```typescript
router.post(
  "/",
  validate({ 
    body: createSchema,
    query: querySchema,
    params: paramSchema,
  }),
  controller.action
);
```

### Calling Services from Controllers
```typescript
const data = await this.service.getData(id);
res.json({ success: true, data });
```

### Calling Services from Services
```typescript
const productService = new ProductService();
const inventory = await productService.checkInventory(productId, qty);
```

### Type-Safe Request Data
```typescript
const data = req.body as CreateProductRequest;
const params = req.params as { id: string };
```

### Pagination Template
```typescript
const page = 1;
const limit = 10;
const total = await prisma.model.count({ where });
const data = await prisma.model.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

return {
  data,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  },
};
```

---

These patterns cover 90% of real-world scenarios. Use them as templates!
