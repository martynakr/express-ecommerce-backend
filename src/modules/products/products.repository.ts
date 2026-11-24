import { prisma } from "../../lib/prisma.js";
import { productWithCategory } from "./products.schemas.js";

type Pagination = {
  skip: number;
  take: number;
};

export const productsRepository = {
  async findActive({ skip, take }: Pagination) {
    const where = { isActive: true };

    const [products, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        ...productWithCategory,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip,
        take,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  },
};
