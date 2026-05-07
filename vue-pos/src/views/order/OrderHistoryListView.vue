<script setup lang="ts">
import { Order } from '@/models/Order'
import { onMounted, h, ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import CustomTable from '@/components/CustomTable.vue'
import { useOrderStore } from '@/stores/orderStore'
import { storeToRefs } from 'pinia'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import OrderDetailDialog from '@/views/order/OrderDetailDialog.vue'
import OrderSearchPanel from '@/views/order/OrderSearchPanel.vue'
import { formatDate } from '@/utils/dateFormatter'
import { OrderFilter } from '@/models/OrderFilter'

const isVisible = ref(false)
const orderToDelete = ref<Order>()
const selectedOrder = ref<Order>()
const showOrderDialog = ref(false)

const orderStore = useOrderStore()
const { filteredOrders } = storeToRefs(orderStore)
onMounted(() => {
  orderStore.loadOrder()
  orderStore.setFilters({} as OrderFilter)
})

const statusStyles: { [prop: string]: string } = {
  completed: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-700',
}

const deleteOrder = (order: Order) => {
  isVisible.value = true
  orderToDelete.value = order
}

const handleConfirmation = (isYes: boolean) => {
  isVisible.value = false
  if (isYes) {
    orderStore.removeOrder(orderToDelete.value!)
  }
}

const loadOrderDialog = (order: Order) => {
  selectedOrder.value = order
  showOrderDialog.value = true
}

const headers = [
  {
    key: 'order_id',
    title: 'Order #',
    isComponent: true,
    transform: (obj: Order) => {
      return h(
        'span',
        { class: 'font-medium text-blue-600 cursor-pointer', onClick: () => loadOrderDialog(obj) },
        '#' + obj.order_id,
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
    key: 'total_qty',
    title: 'Total Qty',
    isComponent: true,
    transform: (obj: Order) => {
      return h(
        'div',
        {
          class: 'max-w-xs truncate',
        },
        obj.items.reduce((sum, item) => sum + item.quantity, 0),
      )
    },
  },
  {
    key: 'total_amount',
    title: 'Total Amount',
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

const onSearch = (orderFilter: OrderFilter) => {
  orderStore.setFilters(orderFilter)
}
</script>
<template>
  <CustomTable :data="filteredOrders" :headers="headers" :id="'order_id'">
    <template #actions> <OrderSearchPanel @onSearch="onSearch"></OrderSearchPanel> </template
  ></CustomTable>
  <ConfirmationDialog
    v-if="isVisible"
    :title="'Delete Order'"
    :action="'delete'"
    :actionBtnLabel="'Confirm'"
    @onConfirm="handleConfirmation"
  ></ConfirmationDialog>
  <OrderDetailDialog
    v-if="showOrderDialog"
    :order="selectedOrder"
    @onCancel="showOrderDialog = false"
  ></OrderDetailDialog>
</template>
<style scoped></style>
