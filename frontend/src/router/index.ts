import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProductListView from '@/views/ProductListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    {
      path: '/womens',
      component: ProductListView,
      props: { gender: 'WOMEN' },
    },
    {
      path: '/mens',
      component: ProductListView,
      props: { gender: 'MEN' },
    },
  ],
})

export default router
