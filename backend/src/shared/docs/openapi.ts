import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

// Enable OpenAPI on Zod (must be called before any .openapi() calls)
extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// Register Bearer Auth security scheme
export const bearerAuth = registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Mini Ecommerce API',
      description: 'API documentation for the Mini Ecommerce platform',
    },
    servers: [{ url: '/api' }],
  });
}
