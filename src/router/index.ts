import { createRouter, createWebHistory } from 'vue-router'
import PicsumGallery from '@/views/PicsumGallery.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/gallery',
    },
    {
      path: '/gallery',
      name: 'picsumGallery',
      component: PicsumGallery,
    },
  ],
})

export default router
