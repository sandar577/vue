<script setup lang="ts">
import Sidebar from './components/side_bar.vue'
</script>

<template>
  <div class="h-screen bg-gray-100 flex">
    <Sidebar></Sidebar>
    <main class="flex-1 overflow-hidden">
      <div class="h-16 bg-white shadow px-4 flex items-center justify-between">
        <h1 class="text-xl font-bold">Vue POS</h1>
        <div class="text-sm text-gray-600">Cashier</div>
      </div>
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped></style>
