import type { Gender } from "../../src/generated/prisma/client.js";
import { prisma } from "../../src/lib/prisma.js";

let sequence = 0;

function nextId() {
  sequence += 1;
  return sequence;
}

export function createCategory(overrides: { name?: string; slug?: string } = {}) {
  const n = nextId();

  return prisma.category.create({
    data: {
      name: overrides.name ?? `Category ${n}`,
      slug: overrides.slug ?? `category-${n}`,
    },
  });
}

type ProductOverrides = {
  name?: string;
  slug?: string;
  priceCents?: number;
  stockQuantity?: number;
  isActive?: boolean;
  gender?: Gender;
  createdAt?: Date;
};

export function createProduct(categoryId: number, overrides: ProductOverrides = {}) {
  const n = nextId();

  return prisma.product.create({
    data: {
      categoryId,
      name: overrides.name ?? `Product ${n}`,
      slug: overrides.slug ?? `product-${n}`,
      description: "A test product",
      priceCents: overrides.priceCents ?? 1000,
      stockQuantity: overrides.stockQuantity ?? 10,
      isActive: overrides.isActive ?? true,
      gender: overrides.gender ?? "UNISEX",
      ...(overrides.createdAt ? { createdAt: overrides.createdAt } : {}),
    },
  });
}
