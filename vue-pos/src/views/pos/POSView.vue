<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { Order } from '@/models/Order'
import { useItemStore } from '@/stores/itemStore'
import { useOrderStore } from '@/stores/orderStore'
import { createToaster } from '@meforma/vue-toaster'
import { useCategoryStore } from '@/stores/categoryStore'
import CommonButton from '@/components/CommonButton.vue'
import OrderPanel from '@/views/pos/OrderPanel.vue'
import { Size, Type } from '@/constants/common'
import { asset } from '@/utils/asset'

const itemStore = useItemStore()
const orderStore = useOrderStore()
const categoryStore = useCategoryStore()
const toaster = createToaster({})
const categories = ref<Category[]>([])
const items = ref<Item[]>([])
const display = ref<Item[]>([])
const loading = ref(false)
const itemsByCategory = ref<Record<number, Item[]>>({})
const activeCatId = ref()

const order = ref<Order>({
  order_id: 0,
  total_amount: 0,
  tax_amount: 0,
  discount_amount: 0,
  status: 'pending',
  created_at: '',
  items: [],
})

onMounted(() => {
  categoryStore.loadCategory()
  categories.value = categoryStore.categories
  itemStore.loadItem()
  items.value = itemStore.items
  itemsByCategory.value = itemStore.groupByCategory
  if (categories.value.length > 0) {
    selectCategory(categories.value[0].category_id)
  }
})

watch(activeCatId, () => {
  display.value = itemsByCategory.value[activeCatId.value]
})

const selectCategory = (catId: number) => {
  activeCatId.value = catId
}

const addToCart = (item: Item) => {
  const items = order.value.items
  const itemInCart = items.find((i) => i.item_id === item.item_id)
  if (itemInCart) {
    itemInCart.quantity += 1
  } else {
    items.push({
      item_id: item.item_id,
      name: item.name,
      quantity: 1,
      price_at_sale: item.price,
      subTotal: item.price,
      discount: 0,
      total: item.price,
      order_item_id: items.length,
    })
  }
}

const increase = (item: OrderItem) => {
  const items = order.value.items
  const itemInCart = items.find((i) => i.item_id === item.item_id)
  if (itemInCart) {
    itemInCart.quantity++
  }
}

const decrease = (item: OrderItem) => {
  const items = order.value.items
  const itemInCart = items.find((i) => i.item_id === item.item_id)
  if (itemInCart) {
    if (itemInCart.quantity > 1) {
      itemInCart.quantity--
    } else {
      order.value.items = items.filter((i) => i.item_id !== item.item_id)
    }
  }
}

const isInCart = (item: Item) => order.value.items.some((i) => i.item_id === item.item_id)

const saveOrder = async (totalAmount: number) => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    order.value.total_amount = totalAmount
    order.value.status = 'completed'
    order.value.created_at = new Date().toISOString()
    orderStore.addOrder(order.value)
    console.log('Order saved:', order.value)
    toaster.success('Successfully saved!', {
      position: 'top',
    })
    resetOrder()
  } finally {
    loading.value = false
  }
}

const resetOrder = () => {
  order.value = {
    order_id: 0,
    total_amount: 0,
    tax_amount: 0,
    discount_amount: 0,
    status: 'pending',
    created_at: '',
    items: [],
  }
  display.value = itemsByCategory.value[activeCatId.value]
}
</script>
<template>
  <div class="flex flex-1 overflow-hidden">
    <div class="flex flex-1 flex-col overflow-auto p-4">
      <div class="flex gap-2 mb-4">
        <CommonButton
          v-for="cat in categories"
          :key="cat.category_id"
          :active="activeCatId === cat.category_id"
          :size="Size.md"
          :btnType="Type.light"
          @onClick="() => selectCategory(cat.category_id)"
        >
          {{ cat.name }}</CommonButton
        >
      </div>
      <div class="grid grid-cols-4 gap-4 overflow-auto">
        <div
          v-for="item in display"
          :key="item.item_id"
          class="bg-white btn shadow p-3 hover:shadow-lg transition"
          :class="isInCart(item) ? 'border-2 border-blue-600' : ''"
          @click="() => addToCart(item)"
        >
          <img class="h-24 w-full object-contain rounded mb-2" :src="asset(item.image)" />
          <div class="font-medium text-sm">
            {{ item.name }}
          </div>
          <div class="text-red-500 font-bold text-sm">{{ item.price }}</div>
        </div>
      </div>
    </div>
    <OrderPanel
      :order="order"
      :loading="loading"
      @saveOrder="saveOrder"
      @increase="increase"
      @decrease="decrease"
    />
  </div>
</template>
<style scoped>
@reference '@/style.css';
.inactive {
  @apply bg-white text-blue-600 border-blue-600;
}
.btn-sm {
  @apply bg-gray-200 px-2;
}
</style>
