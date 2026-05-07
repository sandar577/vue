import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/menu',
    },
    {
      path: '/menu',
      component: () => import('@/views/pos/POSView.vue'),
    },
    {
      path: '/history',
      component: () => import('@/views/order/OrderHistoryListView.vue'),
    },
    {
      path: '/items',
      component: () => import('@/views/item/ItemListView.vue'),
    },
    // {
    //   path: '/history/:id',
    //   component: () => import('@/views/order/OrderDetailView.vue'),
    // },
    // {
    //   path: '/items/:id',
    //   component: () => import('@/views/item/ItemFormDialog.vue'),
    // },

    {
      path: '/charts',
      component: () => import('@/views/report/ChartView.vue'),
    },
  ],
})

export default router
