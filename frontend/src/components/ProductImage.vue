<script setup lang="ts">
defineProps<{
  src: string | null
  alt: string
}>()
</script>

<template>
  <div class="product-image">
    <img v-if="src" :src="src" :alt="alt" class="image" />
    <div v-else class="placeholder">No image</div>

    <div class="overlay">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.product-image {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: var(--color-surface);
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1.5rem;
  transition: transform 0.4s ease;
}

.placeholder {
  display: grid;
  place-items: center;
  height: 100%;
  color: var(--color-muted);
  font-size: 0.875rem;
}

.overlay {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
}
</style>
