<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Order } from '../models/Order'
import { useItemStore } from '@/stores/itemStore'
import { useOrderStore } from '@/stores/orderStore'
import { createToaster } from '@meforma/vue-toaster'
import { useCategoryStore } from '@/stores/categoryStore'
import CommonButton from '@/components/CommonButton.vue'
import { Size, Type } from '@/constants/common'

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

const total_amount = computed(() => {
  return order.value.items.reduce((sum, item) => {
    return sum + item.price_at_sale * item.quantity
  }, 0)
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

// const groupByCategory = () => {
//   itemsByCategory.value = items.value.reduce<Record<number, Item[]>>((acc, item) => {
//     if (!acc[item.category_id]) {
//       acc[item.category_id] = []
//     }
//     acc[item.category_id].push(item)
//     return acc
//   }, {})
// }

const selectCategory = (catId: number) => {
  activeCatId.value = catId
  // display.value = itemsByCategory.value[activeCatId.value]
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

const saveOrder = async () => {
  loading.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    order.value.total_amount = total_amount.value
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
          <img class="h-24 w-full object-contain rounded mb-2" :src="item.image" />
          <div class="font-medium text-sm">
            {{ item.name }}
          </div>
          <div class="text-red-500 font-bold text-sm">{{ item.price }}</div>
        </div>
      </div>
    </div>
    <div class="w-96 shawdow-lg bg-white flex flex-col">
      <div class="p-4 border-b font-bold text-lg">Order</div>
      <div class="overflow-auto flex-1 p-4">
        <div
          v-for="item in order.items"
          :key="item.item_id"
          class="flex justify-between items-center mb-3"
        >
          <div>
            <div class="text-sm font-medium">{{ item.name }}</div>
            <div class="text-xs text-gray-500">{{ item.price_at_sale }} x {{ item.quantity }}</div>
          </div>
          <div class="flex gap-2 items-center">
            <CommonButton :btnType="Type.grey" :size="Size.xs" @onClick="() => decrease(item)"
              >-</CommonButton
            >
            <CommonButton :btnType="Type.grey" :size="Size.xs" @onClick="() => increase(item)"
              >+</CommonButton
            >
          </div>
        </div>
      </div>
      <div class="border-t p-4">
        <div class="flex justify-between font-bold text-lg mb-4">
          <span>Total:</span>
          <span>{{ total_amount }}</span>
        </div>
        <div>
          <CommonButton
            :btnType="Type.secondary"
            :size="Size.xl"
            :class="'flex-1 w-full'"
            @onClick="saveOrder"
          >
            {{ loading ? 'Saving...' : 'Check out' }}
          </CommonButton>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
@reference '@/style.css';
/* .btn-category {
  @apply px-4 py-2 text-sm border border-blue-600 whitespace-nowrap;
}*/
.inactive {
  @apply bg-white text-blue-600 border-blue-600;
}
.btn-sm {
  @apply bg-gray-200 px-2;
}
</style>
