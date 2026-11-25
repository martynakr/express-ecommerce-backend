<script setup lang="ts">
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import ProductImage from '@/components/ProductImage.vue'
import StockBadge from '@/components/StockBadge.vue'

defineProps<{ product: Product }>()
</script>

<template>
  <article class="card">
    <ProductImage :src="product.imageUrl" :alt="product.name" class="card-image">
      <StockBadge :stock-quantity="product.stockQuantity" />
    </ProductImage>

    <div class="details">
      <p class="category">{{ product.category.name }}</p>
      <h3 class="name">{{ product.name }}</h3>
      <p class="price">{{ formatPrice(product.priceCents) }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
}

.card-image {
  aspect-ratio: 4 / 5;
}

.card:hover :deep(img) {
  transform: scale(1.05);
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category {
  margin: 0;
  color: var(--color-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.name {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0;
}

.price {
  margin: 0;
  font-weight: 600;
}
</style>
