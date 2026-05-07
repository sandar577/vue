import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/constants/common'
import ItemJson from '@/data/items.json'
import { ItemFilter } from '@/models/ItemFilter'

export const useItemStore = defineStore('item', {
  state: () => ({
    itemsById: {} as Record<number, Item>,
    itemFilter: {} as ItemFilter,
  }),
  persist: true,
  actions: {
    loadItem() {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS)
      const tempItemsById = JSON.parse(data || '{}')
      if (Object.keys(tempItemsById).length > 0) {
        this.itemsById = tempItemsById.itemsById
      } else {
        this.itemsById = ItemJson.reduce(
          (acc, item) => {
            acc[item.item_id] = item
            return acc
          },
          {} as Record<number, Item>,
        )
      }
    },
    addItem(item: Item) {
      item.item_id = this.items[this.items.length - 1].item_id + 1
      this.itemsById[item.item_id] = item
      return item.item_id
    },
    updateItem(item: Item) {
      this.itemsById[item.item_id] = item
    },
    removeItem(item: Item) {
      delete this.itemsById[item.item_id]
    },
    setFilter(itemFilter: ItemFilter) {
      this.itemFilter = itemFilter
    },
  },
  getters: {
    items: (state) => Object.values(state.itemsById),
    getItem(state) {
      return (itemId: number) => state.itemsById[itemId]
    },
    groupByCategory(): Record<number, Item[]> {
      return this.items.reduce<Record<number, Item[]>>((acc, item) => {
        if (!acc[item.category_id]) {
          acc[item.category_id] = []
        }
        acc[item.category_id].push(item)
        return acc
      }, {})
    },
    filteredItems: (state) => {
      const items = Object.values(state.itemsById)
      const filter = state.itemFilter

      return items.filter((item) => {
        if (
          filter.item_id &&
          item.item_id !== Number(filter.item_id) &&
          !item.barcode.startsWith(filter.item_id)
        ) {
          return false
        }
        if (filter.itemName && !item.name.startsWith(filter.itemName)) {
          return false
        }
        if (
          filter.categories &&
          filter.categories.length > 0 &&
          !filter.categories.includes(item.category_id)
        ) {
          return false
        }
        return true
      })
    },
  },
})
