import type { Category } from './category'

export type Gender = 'MEN' | 'WOMEN' | 'UNISEX'

export type Product = {
  id: number
  name: string
  slug: string
  description: string | null
  priceCents: number
  stockQuantity: number
  inStock: boolean
  imageUrl: string | null
  category: Category
  gender: Gender
}

export type PaginatedProducts = {
  data: Product[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
