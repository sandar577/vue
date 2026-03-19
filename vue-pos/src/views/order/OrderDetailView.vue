<script setup lang="ts">
import { useRoute } from 'vue-router'
import CustomCard from '@/components/CustomCard.vue'
import { useOrderStore } from '@/stores/orderStore'
import { onMounted } from 'vue'

const orderStore = useOrderStore()
const route = useRoute()
const order = orderStore.getOrder(Number(route.params.id))

// onMounted(() => {
//   orderStore.loadOrder()
// })
const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString()
}
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
  <!-- <div class="p-4">
    <ArrowLeft class="w-6 h-6 cursor-pointer" @click="$router.push('/history')"></ArrowLeft>
  </div>
  <div class="max-w-3xl mx-auto mt-6 overflow-auto">
    <div class="p-20 bg-white shadow-md rounded-lg border border-gray-200">
      <div class="px-6 py-2 border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">Order #{{ order.id }}</h2>

        <span class="px-3 py-2 text-sm rounded-full bg-green-100 text-green-700">
          {{ order.status }}
        </span>
      </div>

      <div class="p-6 flex justify-between border-b">
        <p class="ext-sm">Date</p>
        <p class="font-medium">{{ formatDate(order.created_at) }}</p>
      </div>
      <div class="p-2">
        <div class="max-h-100 overflow-y-scroll">
          <table class="w-full">
            <thead class="border-b sticky top-0 bg-white">
              <tr>
                <th class="text-left px-9 py-2">Item</th>
                <th class="text-left px-9 py-2">Price</th>
                <th class="text-left px-9 py-2">Qty</th>
                <th class="text-right px-9 py-2">Total</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in order.items" :key="item.id" class="border-b">
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

        <div class="flex justify-end mt-4 font-semibold text-lg">
          Total: {{ order.total_amount }}
        </div>
      </div>
    </div>
  </div> -->
</template>
