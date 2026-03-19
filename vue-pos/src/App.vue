<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
</script>

<template>
  <div class="h-screen bg-gray-100 flex">
    <Sidebar></Sidebar>
    <main class="flex-1 flex flex-col overflow-hidden">
      <div class="h-14 bg-white px-4 flex items-center justify-between border-b border-gray-300">
        <h1 class="text-xl font-bold">Vue POS</h1>
        <div class="text-sm text-gray-600">Cashier</div>
      </div>
      <router-view class="flex-1 overflow-auto"></router-view>
    </main>
  </div>
</template>

<style scoped></style>
