<script setup lang="ts">
import { useRoute } from 'vue-router'
import CustomCard from '@/components/CustomCard.vue'
import { useOrderStore } from '@/stores/orderStore'
import { formatDate } from '@/utils/dateFormatter'

const orderStore = useOrderStore()
const route = useRoute()
const order = orderStore.getOrder(Number(route.params.id))
</script>
<template>
  <CustomCard :route="'/history'" :title="'Order ID: ' + order.order_id">
    <template #header>
      <span class="px-3 py-2 text-sm rounded-full bg-green-100 text-green-700">
        {{ order.status }}
      </span>
    </template>
    <div class="py-3 flex justify-between border-b">
      <p class="ext-sm">Date</p>
      <p class="font-medium">{{ formatDate(order.created_at) }}</p>
    </div>
    <div class="max-h-100 overflow-y-scroll pt-1">
      <table class="w-full">
        <thead class="border-b sticky top-0 bg-white">
          <tr>
            <th class="px-1">No.</th>
            <th class="text-left px-9 py-2">Item</th>
            <th class="text-left px-9 py-2">Price</th>
            <th class="text-left px-9 py-2">Qty</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in order.items" :key="item.item_id" class="border-b">
            <td class="px-1">{{ i + 1 }}</td>
            <td class="px-9 py-2">{{ item.name }}</td>
            <td class="px-9 py-2">{{ item.price_at_sale }}</td>
            <td class="px-9 py-2">{{ item.quantity }}</td>
            <td class="px-9 py-2 text-right">
              {{ item.price_at_sale * item.quantity }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-end mt-4 font-semibold text-lg">Total: {{ order.total_amount }}</div>
  </CustomCard>
</template>
