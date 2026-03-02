import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/order_view.vue'),
    },
    {
      path: '/history',
      component: () => import('../views/order_history_view.vue'),
    },
    {
      path: '/items',
      component: () => import('../views/item_view.vue'),
    },
  ],
})

export default router
