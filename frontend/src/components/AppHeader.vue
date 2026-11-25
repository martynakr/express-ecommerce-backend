<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <header class="header">
    <RouterLink to="/" aria-label="NOVO home">
      <AppLogo />
    </RouterLink>

    <nav class="nav">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/womens" class="nav-link">Women</RouterLink>
      <RouterLink to="/mens" class="nav-link">Men</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  color: var(--color-muted);
  transition: color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: var(--color-text);
}

.nav-link.router-link-exact-active {
  text-decoration: underline;
  text-decoration-color: var(--color-accent);
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
}
</style>
