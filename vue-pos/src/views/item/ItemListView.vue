<script lang="ts" setup>
import CommonButton from '@/components/CommonButton.vue'
import CustomTable from '@/components/CustomTable.vue'
import CustomModal from '@/components/CustomModal.vue'

import { ref, h, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import router from '@/router'
import { Trash2, Edit2 } from 'lucide-vue-next'
import { useItemStore } from '@/stores/itemStore'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'
import { Size, Type } from '@/constants/common'

const itemStore = useItemStore()
const { items } = storeToRefs(itemStore)
const categoryStore = useCategoryStore()
const isVisible = ref(false)
const itemToDelete = ref({} as Item)

const categories = ref<Category[]>([])
const headers = [
  {
    key: 'item_id',
    title: 'ID',
    isComponent: true,
    transform: (obj: Item) => {
      return h(
        RouterLink,
        { class: 'font-medium text-blue-600', to: `/items/${obj.item_id}` },
        () => '#' + obj.item_id,
      )
    },
  },
  {
    key: 'image',
    title: 'Image',
    isComponent: true,
    transform: (obj: Item) => {
      return h('img', { src: obj.image, class: 'w-10 h-10' })
    },
  },
  { key: 'name', title: 'Name' },
  { key: 'price', title: 'Price' },
  { key: 'barcode', title: 'Barcode' },
  {
    key: 'category_id',
    title: 'Category',
    transform: (obj: Item) => {
      return categories.value.find((c) => c.category_id === obj.category_id)?.name
    },
  },
  { key: 'stock_quantity', title: 'Stock' },
  {
    key: 'delete',
    title: '',
    isIcon: true,
    isComponent: true,
    transform: (obj: Item) => {
      return h(Trash2, {
        onClick: () => deleteItem(obj),
        class:
          'rounded-md hover:bg-gray-200 cursor-pointer hover:text-red-600 flex items-center justify-center',
        size: 17,
      })
    },
  },
  {
    key: 'edit',
    title: '',
    isComponent: true,
    isIcon: true,
    transform: (obj: Item) => {
      return h(Edit2, {
        onClick: () => router.push(`/items/${obj.item_id}`),
        class:
          'rounded-md hover:bg-gray-200 cursor-pointer hover:text-green-600 flex items-center justify-center',
        size: 17,
      })
    },
  },
]

onMounted(() => {
  itemStore.loadItem()
  categoryStore.loadCategory()
  categories.value = categoryStore.categories
})

const deleteItem = (item: Item) => {
  isVisible.value = true
  itemToDelete.value = item
  //itemStore.removeItem(item)
}

const handleConfirm = (value: boolean) => {
  isVisible.value = false
  if (value) {
    itemStore.removeItem(itemToDelete.value)
  }
}
</script>
<template>
  <CustomTable :data="items" :headers="headers" :id="'item_id'">
    <template #actions>
      <CommonButton
        :btnType="Type.primary"
        :size="Size.sm"
        :class="'mx-1'"
        @click="$router.push('/items/new')"
      >
        + New
      </CommonButton>
      <CustomModal
        v-if="isVisible"
        :title="'Delete Item'"
        :action="'delete'"
        :actionBtnLabel="'Confirm'"
        @onConfirm="handleConfirm"
      ></CustomModal>
    </template>
  </CustomTable>
</template>
<style></style>
