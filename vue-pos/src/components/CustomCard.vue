<script lang="ts" setup>
import { ArrowLeft } from 'lucide-vue-next'

interface Props {
  route: string
  title: string
}
const props = defineProps<Props>()
</script>
<template>
  <div class="p-3">
    <ArrowLeft class="w-6 h-6 cursor-pointer" @click="$router.push(props.route)"></ArrowLeft>
  </div>
  <div class="max-w-3xl mx-auto mt-4 overflow-auto">
    <div class="p-20 bg-white shadow-md rounded-lg border border-gray-200">
      <div class="py-2 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">{{ props.title }}</h2>
        <slot name="header"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<style scoped></style>
