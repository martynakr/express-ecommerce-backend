<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <main class="container">
    <RouterView />
  </main>
</template>

<style scoped>
.container {
  width: 80%;
  margin-inline: auto;
}
</style>
