import { ErrorResponseSchema, errorExample } from "../../docs/common.schemas.js";
import { registry } from "../../docs/openapi.js";
import {
  PaginatedProductsResponseSchema,
  ProductListQuerySchema,
} from "./products.schemas.js";

registry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Products"],
  summary: "List active products, newest first",
  request: {
    query: ProductListQuerySchema,
  },
  responses: {
    200: {
      description: "A page of products",
      content: {
        "application/json": {
          schema: PaginatedProductsResponseSchema,
          example: {
            data: [
              {
                id: 50,
                name: "Refined Rubber Keyboard",
                slug: "refined-rubber-keyboard",
                description: "A reliable keyboard with a modern design",
                priceCents: 15511,
                stockQuantity: 50,
                inStock: true,
                imageUrl: "https://picsum.photos/seed/wChgX8H/640/480",
                category: { id: 2, name: "Grocery", slug: "grocery" },
              },
            ],
            meta: { page: 1, limit: 20, total: 46, totalPages: 3 },
          },
        },
      },
    },
    400: {
      description: "Invalid pagination parameters",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: errorExample("VALIDATION_ERROR", "Validation failed", {
            query: { limit: ["Too big: expected number to be <=100"] },
          }),
        },
      },
    },
  },
});
