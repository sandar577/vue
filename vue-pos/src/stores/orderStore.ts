import { OrderFilter } from './../models/OrderFilter'
import { STORAGE_KEYS } from '@/constants/common'
import { Order } from '@/models/Order'
import { defineStore } from 'pinia'
import { useItemStore } from './itemStore'
import { useCategoryStore } from './categoryStore'

export const useOrderStore = defineStore('order', {
  state: () => ({
    ordersById: {} as Record<number, Order>,
    orderFilter: {} as OrderFilter,
  }),
  persist: true,
  actions: {
    loadOrder(orderFilter?: OrderFilter) {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
      const tempData = JSON.parse(data || '{}')
      if (Object.keys(tempData).length > 0) {
        this.ordersById = tempData.ordersById
      }
      if (orderFilter) {
        this.ordersById = Object.values(tempData.ordersById)
      }
    },
    addOrder(order: Order) {
      this.loadOrder()
      if (this.orders && this.orders.length > 0) {
        order.order_id = this.orders[this.orders.length - 1].order_id + 1
        this.ordersById[order.order_id] = order
      } else {
        order.order_id = 1
        this.ordersById[order.order_id] = order
      }
    },
    updateOrder(order: Order) {
      this.ordersById[order.order_id] = order
    },
    removeOrder(order: Order) {
      console.log('Order to delete: ', order)
      delete this.ordersById[order.order_id]
    },
    getOrderItemsByCategory(): Record<string, number> {
      const orderItemCountByCategory = {} as Record<string, number>
      const itemStore = useItemStore()
      itemStore.loadItem()

      const categoryStore = useCategoryStore()
      categoryStore.loadCategory()
      categoryStore.getCategoryNames.forEach((categoryName) => {
        orderItemCountByCategory[categoryName] = 0
      })
      this.orders.forEach((order) => {
        order.items.forEach((orderItem) => {
          const item = itemStore.getItem(orderItem.item_id)
          const categoryName = categoryStore.getCategoryNameById(item.category_id)
          orderItemCountByCategory[categoryName] += orderItem.quantity
        })
      })
      return orderItemCountByCategory
    },
    getTopSellingItems(limit: number): Record<string, number> {
      const orderItemByItemName = {} as Record<string, number>
      const itemStore = useItemStore()
      itemStore.loadItem()
      this.orders.forEach((order) => {
        order.items.forEach((orderItem) => {
          const item = itemStore.getItem(orderItem.item_id)
          if (orderItemByItemName[item.name]) {
            orderItemByItemName[item.name] += orderItem.quantity
          } else {
            orderItemByItemName[item.name] = orderItem.quantity
          }
        })
      })
      return Object.fromEntries(
        Object.entries(orderItemByItemName)
          .sort((a, b) => b[1] - a[1])
          .splice(0, limit),
      )
    },
    setFilters(orderFilter: OrderFilter) {
      this.orderFilter = { ...orderFilter }
    },
  },
  getters: {
    orders: (state) => Object.values(state.ordersById),
    getOrder(state) {
      return (orderId: number) => state.ordersById[orderId]
    },
    filteredOrders: (state) => {
      const orders = Object.values(state.ordersById)
      const filter = state.orderFilter

      return orders.filter((order) => {
        if (filter.order_id && order.order_id !== Number(filter.order_id)) {
          return false
        }
        if (
          filter.order_item &&
          !order.items.some((item) => item.name.startsWith(filter.order_item)) &&
          !order.items.some((item) => item.item_id === Number(filter.order_item))
        ) {
          return false
        }
        if (filter.startDate && new Date(order.created_at) <= new Date(filter.startDate)) {
          return false
        }
        if (filter.endDate && new Date(order.created_at) <= new Date(filter.endDate)) {
          return false
        }
        return true
      })
    },
  },
})
