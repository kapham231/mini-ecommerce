import { registry, bearerAuth } from './openapi';

import { registerSchema, loginSchema } from '../../modules/auth/auth.types';
import { createUserSchema, updateUserSchema, userIdParamSchema, userQuerySchema } from '../../modules/user/user.types';
import { createAddressSchema, updateAddressSchema, addressIdParamSchema } from '../../modules/address/address.types';
import { createProductSchema, updateProductSchema, productIdParamSchema, productQuerySchema } from '../../modules/product/product.types';
import { createCategorySchema, updateCategorySchema, categoryIdParamSchema } from '../../modules/category/category.types';
import { addToCartSchema, updateCartItemSchema, productIdParamSchema as cartProductIdSchema } from '../../modules/cart/cart.types';
import { checkoutSchema, updateOrderStatusSchema, orderQuerySchema, orderIdParamSchema } from '../../modules/order/order.types';

export function registerRoutes() {
  // ============================================
  // Auth Routes
  // ============================================
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    tags: ['Auth'],
    summary: 'Register a new user',
    request: {
      body: { content: { 'application/json': { schema: registerSchema } } },
    },
    responses: { 201: { description: 'User created' }, 409: { description: 'Email already exists' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/auth/login',
    tags: ['Auth'],
    summary: 'Login user',
    request: {
      body: { content: { 'application/json': { schema: loginSchema } } },
    },
    responses: { 200: { description: 'Login successful' }, 401: { description: 'Invalid credentials' } },
  });

  // ============================================
  // User Routes
  // ============================================
  registry.registerPath({
    method: 'get',
    path: '/users',
    tags: ['Users'],
    summary: 'Get all users',
    security: [{ [bearerAuth.name]: [] }],
    request: { query: userQuerySchema },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Get user by ID',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: userIdParamSchema },
    responses: { 200: { description: 'Success' }, 404: { description: 'Not found' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/users',
    tags: ['Users'],
    summary: 'Create user',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: createUserSchema } } } },
    responses: { 201: { description: 'Created' } },
  });

  registry.registerPath({
    method: 'put',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Update user',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: userIdParamSchema, body: { content: { 'application/json': { schema: updateUserSchema } } } },
    responses: { 200: { description: 'Updated' } },
  });

  registry.registerPath({
    method: 'delete',
    path: '/users/{id}',
    tags: ['Users'],
    summary: 'Delete user',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: userIdParamSchema },
    responses: { 200: { description: 'Deleted' } },
  });

  // ============================================
  // Address Routes
  // ============================================
  registry.registerPath({
    method: 'get',
    path: '/addresses',
    tags: ['Addresses'],
    summary: 'Get user addresses',
    security: [{ [bearerAuth.name]: [] }],
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/addresses',
    tags: ['Addresses'],
    summary: 'Create address',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: createAddressSchema } } } },
    responses: { 201: { description: 'Created' } },
  });

  registry.registerPath({
    method: 'patch',
    path: '/addresses/{id}',
    tags: ['Addresses'],
    summary: 'Update address',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: addressIdParamSchema, body: { content: { 'application/json': { schema: updateAddressSchema } } } },
    responses: { 200: { description: 'Updated' } },
  });

  registry.registerPath({
    method: 'delete',
    path: '/addresses/{id}',
    tags: ['Addresses'],
    summary: 'Delete address',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: addressIdParamSchema },
    responses: { 200: { description: 'Deleted' } },
  });

  registry.registerPath({
    method: 'patch',
    path: '/addresses/{id}/default',
    tags: ['Addresses'],
    summary: 'Set default address',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: addressIdParamSchema },
    responses: { 200: { description: 'Updated' } },
  });

  // ============================================
  // Product Routes
  // ============================================
  registry.registerPath({
    method: 'get',
    path: '/products',
    tags: ['Products'],
    summary: 'Get products',
    request: { query: productQuerySchema },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'get',
    path: '/products/{id}',
    tags: ['Products'],
    summary: 'Get product by ID',
    request: { params: productIdParamSchema },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/products',
    tags: ['Products'],
    summary: 'Create product',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: createProductSchema } } } },
    responses: { 201: { description: 'Created' } },
  });

  registry.registerPath({
    method: 'put',
    path: '/products/{id}',
    tags: ['Products'],
    summary: 'Update product',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: productIdParamSchema, body: { content: { 'application/json': { schema: updateProductSchema } } } },
    responses: { 200: { description: 'Updated' } },
  });

  registry.registerPath({
    method: 'delete',
    path: '/products/{id}',
    tags: ['Products'],
    summary: 'Delete product',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: productIdParamSchema },
    responses: { 200: { description: 'Deleted' } },
  });

  // ============================================
  // Category Routes
  // ============================================
  registry.registerPath({
    method: 'get',
    path: '/categories',
    tags: ['Categories'],
    summary: 'Get categories',
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'get',
    path: '/categories/{id}',
    tags: ['Categories'],
    summary: 'Get category by ID',
    request: { params: categoryIdParamSchema },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/categories',
    tags: ['Categories'],
    summary: 'Create category',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: createCategorySchema } } } },
    responses: { 201: { description: 'Created' } },
  });

  registry.registerPath({
    method: 'put',
    path: '/categories/{id}',
    tags: ['Categories'],
    summary: 'Update category',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: categoryIdParamSchema, body: { content: { 'application/json': { schema: updateCategorySchema } } } },
    responses: { 200: { description: 'Updated' } },
  });

  registry.registerPath({
    method: 'delete',
    path: '/categories/{id}',
    tags: ['Categories'],
    summary: 'Delete category',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: categoryIdParamSchema },
    responses: { 200: { description: 'Deleted' } },
  });

  // ============================================
  // Cart Routes
  // ============================================
  registry.registerPath({
    method: 'get',
    path: '/cart',
    tags: ['Cart'],
    summary: 'Get user cart',
    security: [{ [bearerAuth.name]: [] }],
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/cart/items',
    tags: ['Cart'],
    summary: 'Add item to cart',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: addToCartSchema } } } },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'put',
    path: '/cart/items/{productId}',
    tags: ['Cart'],
    summary: 'Update cart item',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: cartProductIdSchema, body: { content: { 'application/json': { schema: updateCartItemSchema } } } },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'delete',
    path: '/cart/items/{productId}',
    tags: ['Cart'],
    summary: 'Remove item from cart',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: cartProductIdSchema },
    responses: { 200: { description: 'Success' } },
  });

  // ============================================
  // Order Routes
  // ============================================
  registry.registerPath({
    method: 'get',
    path: '/orders',
    tags: ['Orders'],
    summary: 'Get user orders',
    security: [{ [bearerAuth.name]: [] }],
    request: { query: orderQuerySchema },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'get',
    path: '/orders/{id}',
    tags: ['Orders'],
    summary: 'Get order by ID',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: orderIdParamSchema },
    responses: { 200: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'post',
    path: '/orders/checkout',
    tags: ['Orders'],
    summary: 'Checkout cart',
    security: [{ [bearerAuth.name]: [] }],
    request: { body: { content: { 'application/json': { schema: checkoutSchema } } } },
    responses: { 201: { description: 'Success' } },
  });

  registry.registerPath({
    method: 'patch',
    path: '/orders/{id}',
    tags: ['Orders'],
    summary: 'Update order status (admin)',
    security: [{ [bearerAuth.name]: [] }],
    request: { params: orderIdParamSchema, body: { content: { 'application/json': { schema: updateOrderStatusSchema } } } },
    responses: { 200: { description: 'Success' } },
  });
}
