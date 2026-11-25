<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getWomensProducts } from '@/services/products.service'
import type { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard.vue'

const products = ref<Product[]>([])
onMounted(async () => {
  const result = await getWomensProducts()
  console.log(result, 'RESULT')
  products.value = result.data
})
</script>

<template>
  <h1>Womens</h1>
  <ProductCard v-for="product in products" :key="product.id" :product="product" />
</template>
