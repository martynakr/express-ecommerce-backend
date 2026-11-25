import type { Gender, Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { productWithCategory } from "./products.schemas.js";

type Pagination = {
    skip: number;
    take: number;
};

type ProductFilters = {
    gender?: Gender;
    category?: string;
};

export const productsRepository = {
    async findActive(
        { skip, take }: Pagination,
        { gender, category }: ProductFilters = {},
    ) {
        const where: Prisma.ProductWhereInput = {
            isActive: true,
            gender,
            category: category ? { slug: category } : undefined,
        };

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
