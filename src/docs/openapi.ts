import { OpenAPIRegistry, OpenApiGeneratorV31 } from "@asteasolutions/zod-to-openapi";

export const registry = new OpenAPIRegistry();

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV31(registry.definitions);

  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "Ecommerce API",
      version: "0.1.0",
    },
  });
}
