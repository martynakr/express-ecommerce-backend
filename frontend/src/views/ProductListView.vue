<script setup lang="ts">
import { ref, watch } from 'vue'
import { getProductsByGender } from '@/services/products.service'
import type { Gender, Product } from '@/types/product'
import ProductCard from '@/components/ProductCard.vue'

const props = defineProps<{ gender: Gender }>()

const titles: Record<Gender, string> = {
  WOMEN: 'Women',
  MEN: 'Men',
  UNISEX: 'Unisex',
}

const products = ref<Product[]>([])

watch(
  () => props.gender,
  async (gender, _oldGender, onCleanup) => {
    let cancelled = false
    onCleanup(() => {
      cancelled = true
    })

    const result = await getProductsByGender(gender)
    if (!cancelled) {
      products.value = result.data
    }
  },
  { immediate: true },
)
</script>

<template>
  <h1>{{ titles[gender] }}</h1>
  <div class="product-grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
  </div>
</template>

<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem 1.5rem;
}
</style>
