<script setup lang="ts">
import { Order } from '@/models/Order'
import { onMounted, h, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Trash2 } from 'lucide-vue-next'
import CustomTable from '@/components/CustomTable.vue'
import { useOrderStore } from '@/stores/orderStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'

const isVisible = ref(false)
const orderToDelete = ref({} as Order)

const orderStore = useOrderStore()
const { orders } = storeToRefs(orderStore)

onMounted(() => {
  orderStore.loadOrder()
  //  orders = orderRef.orders.value
  console.log(orders)
})

const statusStyles: { [prop: string]: string } = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-700',
}

const formatDate = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString()
}

const deleteOrder = (order: Order) => {
  isVisible.value = true
  orderToDelete.value = order
}

const handleConfirm = (value: boolean) => {
  isVisible.value = false
  if (value) {
    orderStore.removeOrder(orderToDelete.value)
  }
}

const headers = [
  {
    key: 'order_id',
    title: 'Order #',
    isComponent: true,
    transform: (obj: Order) => {
      return h(
        RouterLink,
        { class: 'font-medium text-blue-600', to: `/history/${obj.order_id}` },
        () => '#' + obj.order_id,
      )
    },
  },
  {
    key: 'created_at',
    title: 'Date',
    transform: (obj: Order) => formatDate(obj.created_at),
  },
  {
    key: 'items',
    title: 'Items',
    isComponent: true,
    transform: (obj: Order) => {
      return h(
        'div',
        {
          class: 'max-w-xs truncate',
        },
        obj.items.map((i: OrderItem) => i.name).join(', ') || 'Deleted Item',
      )
    },
  },
  {
    key: 'total_amount',
    title: 'Total',
  },
  {
    key: 'status',
    title: 'Status',
    isComponent: true,
    transform: (obj: Order) => {
      return h(
        'span',
        {
          class:
            statusStyles[obj.status] +
              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium' ||
            'bg-gray-100 text-gray-800',
        },
        obj.status,
      )
    },
  },
  {
    key: 'action',
    title: '',
    isComponent: true,
    transform: (obj: Order) => {
      return h(Trash2, {
        class:
          'rounded-md hover:bg-gray-200 cursor-pointer hover:text-red-600 flex items-center justify-center',
        size: 17,
        onClick: () => deleteOrder(obj),
      })
    },
  },
]
</script>
<template>
  <CustomTable :data="orders" :headers="headers" :id="'order_id'"></CustomTable>
  <CustomModal
    v-if="isVisible"
    :title="'Delete Order'"
    :action="'delete'"
    :actionBtnLabel="'Confirm'"
    @onConfirm="handleConfirm"
  ></CustomModal>
</template>
<style scoped></style>
