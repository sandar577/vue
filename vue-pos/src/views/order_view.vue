<script lang="ts" setup>
const categories = ['All', 'Beer', 'Coffee', 'Juice', 'Food']
defineExpose({ categories })
</script>
<template>
  <div class="flex overflow-hidden p-4">
    <div class="flex flex-1 overflow-hidden gap-2 mb-2">
      <button
        v-for="cat in categories"
        :key="cat"
        class="px-4 py-2 bg-blue-600 text-white text-sm rounded"
      >
        {{ cat }}
      </button>
    </div>
  </div>
</template>
<style></style>
