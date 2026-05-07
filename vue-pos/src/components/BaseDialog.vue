<script lang="ts" setup>
import { X } from 'lucide-vue-next'

const emit = defineEmits<{
  (e: 'onCancel'): void
}>()
</script>
<template>
  <div
    class="fixed inset-0 bg-gray-200/50 bg-opacity-50 flex items-center justify-center"
    @click="emit('onCancel')"
  >
    <div class="p-15 bg-white shadow-md rounded-lg border border-gray-200 relative" @click.stop>
      <X class="w-6 h-6 cursor-pointer absolute top-4 right-4" @click="emit('onCancel')"></X>
      <slot></slot>
    </div>
  </div>
</template>
<style scoped></style>
