<script setup lang="ts">
import { Size, Type } from '@/constants/common'
import CommonButton from '@/components/CommonButton.vue'
import { reactive } from 'vue'
import { OrderFilter } from '@/models/OrderFilter'
const orderFilter = reactive({} as OrderFilter)
const emit = defineEmits<{ (e: 'onSearch', orderFilter: OrderFilter): void }>()

const resetFilter = () => {
  orderFilter.order_id = ''
  orderFilter.order_item = ''
  orderFilter.startDate = ''
  orderFilter.endDate = ''
  emit('onSearch', orderFilter)
}

const emitSearch = () => {
  emit('onSearch', orderFilter)
}
</script>
<template>
  <div class="px-4 pt-2 flex flex-wrap gap-12">
    <input placeholder="Order ID" v-model="orderFilter.order_id" @input="emitSearch" />

    <input
      placeholder="Order Item ID or Name"
      v-model="orderFilter.order_item"
      @input="emitSearch"
    />

    <input type="date" v-model="orderFilter.startDate" @input="emitSearch" />

    <input type="date" v-model="orderFilter.endDate" @input="emitSearch" />

    <CommonButton :btnType="Type.secondary" :size="Size.md" @click="resetFilter"
      >Reset</CommonButton
    >
  </div>
</template>
<style scoped>
@reference '@/style.css';
input {
  @apply flex-1 w-full rounded-md bg-white px-10 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600;
}
</style>
