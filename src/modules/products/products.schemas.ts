import { z } from "zod";
import type { Prisma } from "../../generated/prisma/client.js";

export const ProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ProductListQuery = z.infer<typeof ProductListQuerySchema>;

export const ProductResponseSchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    description: z.string().nullable(),
    priceCents: z.number().int(),
    stockQuantity: z.number().int(),
    inStock: z.boolean(),
    imageUrl: z.string().nullable(),
    category: z.object({
      id: z.number().int(),
      name: z.string(),
      slug: z.string(),
    }),
  })
  .meta({ id: "ProductResponse" });

export type ProductResponse = z.infer<typeof ProductResponseSchema>;

export const PaginatedProductsResponseSchema = z
  .object({
    data: z.array(ProductResponseSchema),
    meta: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      total: z.number().int(),
      totalPages: z.number().int(),
    }),
  })
  .meta({ id: "PaginatedProductsResponse" });

export type PaginatedProductsResponse = z.infer<typeof PaginatedProductsResponseSchema>;

export const productWithCategory = {
  include: {
    category: { select: { id: true, name: true, slug: true } },
  },
} satisfies Prisma.ProductDefaultArgs;

type ProductWithCategory = Prisma.ProductGetPayload<typeof productWithCategory>;

export function toProductResponse(product: ProductWithCategory): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    priceCents: product.priceCents,
    stockQuantity: product.stockQuantity,
    inStock: product.stockQuantity > 0,
    imageUrl: product.imageUrl,
    category: product.category,
  };
}
