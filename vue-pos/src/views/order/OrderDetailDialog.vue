<script setup lang="ts">
import { Order } from '@/models/Order'
import { computed, onMounted, ref, watch } from 'vue'
import BaseDialog from '@/components/BaseDialog.vue'
import OrderItemsTable from '@/views/order/OrderItemsTable.vue'
import { formatDate } from '@/utils/dateFormatter'

const props = defineProps<{ order?: Order }>()
const localOrder = ref<Order>()

const totalQty = computed(() => {
  return localOrder.value?.items.reduce((sum, item) => {
    return sum + item.quantity
  }, 0)
})

const emit = defineEmits<{ (e: 'onCancel'): void }>()

onMounted(() => {
  localOrder.value = props.order
})

watch(
  () => props.order,
  () => {
    localOrder.value = props.order
  },
)
</script>
<template>
  <BaseDialog @onCancel="emit('onCancel')">
    <div v-if="localOrder">
      <div class="py-3 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">{{ 'Order ID: ' + localOrder.order_id }}</h2>

        <span class="px-3 py-2 text-sm rounded-full bg-green-100 text-green-700">
          {{ localOrder.status }}
        </span>
      </div>
      <div class="py-3 flex justify-between border-b">
        <p class="ext-sm">Date</p>
        <p class="font-medium">{{ formatDate(localOrder.created_at) }}</p>
      </div>
      <OrderItemsTable :order="localOrder"></OrderItemsTable>
      <div class="flex justify-between mt-4 font-semibold text-lg">
        <span class="mr-4">Total Qty: {{ totalQty }}</span>
        Total: {{ localOrder.total_amount }}
      </div>
    </div>
  </BaseDialog>
</template>
