import type { Gender, PaginatedProducts } from '@/types/product'

const API_URL = import.meta.env.VITE_API_URL

async function getProductsByGender(gender: Gender): Promise<PaginatedProducts> {
  const params = new URLSearchParams({ gender })
  const response = await fetch(`${API_URL}/products?${params}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`)
  }

  return response.json()
}

export const getWomensProducts = () => getProductsByGender('WOMEN')
export const getMensProducts = () => getProductsByGender('MEN')
