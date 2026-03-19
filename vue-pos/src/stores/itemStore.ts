import { defineStore } from 'pinia'
import { STORAGE_KEYS } from '@/constants/common'
import ItemJson from '@/data/items.json'

export const useItemStore = defineStore('item', {
  state: () => ({
    itemsById: {} as Record<number, Item>,
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
  },
})
