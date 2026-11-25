import { z } from "zod";
import { ErrorResponseSchema, errorExample } from "../../docs/common.schemas.js";
import { registry } from "../../docs/openapi.js";
import {
  PaginatedProductsResponseSchema,
  ProductListQuerySchema,
} from "./products.schemas.js";

const ProductListQueryDocSchema = ProductListQuerySchema.extend({
  gender: z.enum(["men", "women", "unisex"]).optional(),
});

registry.registerPath({
  method: "get",
  path: "/products",
  tags: ["Products"],
  summary: "List active products, newest first",
  description:
    "Filter by `gender` (`men`, `women` or `unisex`, any case) and by `category` slug. Filters can be combined. An unknown category slug returns an empty page.",
  request: {
    query: ProductListQueryDocSchema,
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
                id: 33,
                name: "Red Shoes",
                slug: "red-shoes",
                description: "The Red Shoes are a bold and stylish choice for any occasion.",
                priceCents: 3499,
                stockQuantity: 21,
                inStock: true,
                imageUrl: "https://cdn.dummyjson.com/product-images/womens-shoes/red-shoes/1.webp",
                category: { id: 5, name: "Shoes", slug: "shoes" },
                gender: "WOMEN",
              },
            ],
            meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
          },
        },
      },
    },
    400: {
      description: "Invalid pagination or filter parameters",
      content: {
        "application/json": {
          schema: ErrorResponseSchema,
          example: errorExample("VALIDATION_ERROR", "Validation failed", {
            query: {
              limit: ["Too big: expected number to be <=100"],
              gender: ['Invalid option: expected one of "MEN"|"WOMEN"|"UNISEX"'],
            },
          }),
        },
      },
    },
  },
});
