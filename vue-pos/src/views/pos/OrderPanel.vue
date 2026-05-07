<script lang="ts" setup>
import { Size, Type } from '@/constants/common'
import { Order } from '@/models/Order'
import CommonButton from '@/components/CommonButton.vue'
import { computed } from 'vue'

interface Props {
  order: Order
  loading: boolean
}
const props = defineProps<Props>()
const totalAmount = computed(() => {
  return props.order.items.reduce((sum, item) => {
    return sum + item.price_at_sale * item.quantity
  }, 0)
})

const totalQty = computed(() => {
  return props.order.items.reduce((sum, item) => {
    return sum + item.quantity
  }, 0)
})

const emit = defineEmits<{
  (e: 'saveOrder', totalAmount: number): void
  (e: 'increase', item: OrderItem): void
  (e: 'decrease', item: OrderItem): void
}>()
</script>
<template>
  <div class="w-96 shawdow-lg bg-white flex flex-col">
    <div class="p-4 border-b font-bold text-lg">Order</div>
    <div class="overflow-auto flex-1 p-4">
      <div
        v-for="item in props.order.items"
        :key="item.item_id"
        class="flex justify-between items-center mb-3"
      >
        <div>
          <div class="text-sm font-medium">{{ item.name }}</div>
          <div class="text-xs text-gray-500">{{ item.price_at_sale }} x {{ item.quantity }}</div>
        </div>
        <div class="flex gap-2 items-center">
          <CommonButton :btnType="Type.grey" :size="Size.xs" @click="() => emit('decrease', item)"
            >-</CommonButton
          >
          <CommonButton :btnType="Type.grey" :size="Size.xs" @click="() => emit('increase', item)"
            >+</CommonButton
          >
        </div>
      </div>
    </div>
    <div class="border-t p-4">
      <div class="flex justify-between font-bold text-lg mb-4">
        <span>Total Qty:</span>
        <span>{{ totalQty }}</span>
      </div>
      <div class="flex justify-between font-bold text-lg mb-4">
        <span>Total:</span>
        <span>{{ totalAmount }}</span>
      </div>
      <div>
        <CommonButton
          :btnType="Type.secondary"
          :size="Size.xl"
          :class="'flex-1 w-full'"
          @click="() => emit('saveOrder', totalAmount)"
        >
          {{ props.loading ? 'Saving...' : 'Check out' }}
        </CommonButton>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
