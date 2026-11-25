<script setup lang="ts">
defineProps<{ stockQuantity: number }>()

const LOW_STOCK_THRESHOLD = 5
</script>

<template>
  <span v-if="stockQuantity === 0" class="badge sold-out">Sold out</span>
  <span v-else-if="stockQuantity < LOW_STOCK_THRESHOLD" class="badge low-stock">
    Only {{ stockQuantity }} left
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.sold-out {
  background: var(--color-text);
  color: var(--color-background);
}

.low-stock {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
</style>
