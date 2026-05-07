<script setup lang="ts">
import { Order } from '@/models/Order'

defineProps<{ order: Order }>()
</script>

<template>
  <div class="max-h-[400px] overflow-y-scroll pt-1">
    <table class="w-full">
      <thead class="border-b sticky top-0 bg-white">
        <tr>
          <th class="px-1">No.</th>
          <th class="text-left px-9 py-2">Item</th>
          <th class="text-left px-9 py-2">Price</th>
          <th class="text-left px-9 py-2">Qty</th>
          <th>Total</th>
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
</template>
