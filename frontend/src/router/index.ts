import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import WomensView from '@/views/WomensView.vue'
import MensView from '@/views/MensView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    {
      path: '/womens',
      component: WomensView,
    },
    {
      path: '/mens',
      component: MensView,
    },
  ],
})

export default router
