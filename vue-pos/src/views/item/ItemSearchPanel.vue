<script setup lang="ts">
import { Size, Type } from '@/constants/common'
import CommonButton from '@/components/CommonButton.vue'
import { computed, onMounted, reactive } from 'vue'
import MultiSelectbox from '@/components/MultiSelectbox.vue'
import { ItemFilter } from '@/models/ItemFilter'
import { useCategoryStore } from '@/stores/categoryStore'
const itemFilter = reactive({} as ItemFilter)
const emit = defineEmits<{ (e: 'onSearch', itemFilter: ItemFilter): void }>()
const categoryStore = useCategoryStore()

onMounted(() => {
  categoryStore.loadCategory()
})

const categoryOptions = computed(() =>
  categoryStore.categories.map((c) => ({
    id: c.category_id,
    value: c.name,
  })),
)

const resetFilter = () => {
  itemFilter.item_id = ''
  itemFilter.itemName = ''
  itemFilter.categories = []
  emit('onSearch', itemFilter)
}

const onSelect = (selected: number[]) => {
  itemFilter.categories = selected
  emitSearch()
}

const emitSearch = () => {
  emit('onSearch', itemFilter)
}
</script>
<template>
  <div class="px-4 pt-2 flex flex-wrap gap-12">
    <input placeholder="Item ID or Barcode" v-model="itemFilter.item_id" @input="emitSearch" />

    <input placeholder="Item Name" v-model="itemFilter.itemName" @input="emitSearch" />

    <MultiSelectbox
      :selected="itemFilter.categories"
      :options="categoryOptions"
      label="Select Category ..."
      @onSelect="onSelect"
    ></MultiSelectbox>

    <CommonButton :btnType="Type.secondary" :size="Size.md" @click="resetFilter"
      >Reset</CommonButton
    >
  </div>
</template>
<style scoped>
@reference '@/style.css';
input {
  @apply flex-1 w-full rounded-md bg-white px-10 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600;
}
</style>
