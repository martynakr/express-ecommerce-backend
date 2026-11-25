import { productsRepository } from "./products.repository.js";
import {
    toProductResponse,
    type PaginatedProductsResponse,
    type ProductListQuery,
} from "./products.schemas.js";

export const productsService = {
    async list({
        page,
        limit,
        gender,
        category,
    }: ProductListQuery): Promise<PaginatedProductsResponse> {
        const { products, total } = await productsRepository.findActive(
            {
                skip: (page - 1) * limit,
                take: limit,
            },
            {
                gender,
                category,
            },
        );

        return {
            data: products.map(toProductResponse),
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    },
};
