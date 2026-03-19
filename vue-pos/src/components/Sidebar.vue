<script setup lang="ts">
import { ShoppingCart, History, PackagePlus, ChartNoAxesCombined } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
const menu = [
  {
    name: 'Menu',
    icon: ShoppingCart,
    path: '/menu',
  },
  {
    name: 'Order',
    icon: History,
    path: '/history',
  },
  {
    name: 'Items',
    icon: PackagePlus,
    path: '/items',
  },
  {
    name: 'Charts',
    icon: ChartNoAxesCombined,
    path: '/charts',
  },
]
const route = useRoute()

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
<template>
  <aside class="w-20 bg-white flex flex-col py-6 items-center shadow-lg">
    <div class="mb-10">
      <div
        class="h-10 w-10 bg-blue-600 rounded-xl text-white justify-center items-center flex font-bold"
      >
        POS
      </div>
    </div>
    <nav class="flex flex-col gap-6">
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="item.path"
        :class="isActive(item.path) ? 'text-blue-600' : ''"
      >
        <component :is="item.icon" class="w-6 h-6"></component>
        <span class="text-xs mt-1">{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>
<style scoped></style>
