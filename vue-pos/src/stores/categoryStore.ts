import { STORAGE_KEYS } from '@/constants/common'
import { defineStore } from 'pinia'
import CategoryJson from '@/data/categories.json'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categoriesById: {} as Record<number, Category>,
  }),
  persist: true,
  actions: {
    loadCategory() {
      const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
      const tempCategoreisById = JSON.parse(data || '{}')
      if (Object.keys(tempCategoreisById).length > 0) {
        this.categoriesById = tempCategoreisById.categoriesById
      } else {
        this.categoriesById = CategoryJson.reduce(
          (acc, category) => {
            acc[category.category_id] = category
            return acc
          },
          {} as Record<number, Category>,
        )
      }
    },
  },
  getters: {
    categories: (state) => Object.values(state.categoriesById),
    getCategoryNames(): string[] {
      return this.categories.map((category) => category.name)
    },
    getCategoryNameById(state) {
      return (cat_id: number) => state.categoriesById[cat_id].name
    },
  },
})
