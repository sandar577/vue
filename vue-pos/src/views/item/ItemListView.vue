<script lang="ts" setup>
import CommonButton from '@/components/CommonButton.vue'
import CustomTable from '@/components/CustomTable.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import ItemFormDialog from '@/views/item/ItemFormDialog.vue'
import ItemSearchPanel from '@/views/item/ItemSearchPanel.vue'
import { createToaster } from '@meforma/vue-toaster'

import { ref, h, onMounted } from 'vue'
import { Trash2, Edit2 } from 'lucide-vue-next'
import { useItemStore } from '@/stores/itemStore'
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '@/stores/categoryStore'
import { Size, Type } from '@/constants/common'
import { ItemFilter } from '@/models/ItemFilter'
import { asset } from '@/utils/asset'

const itemStore = useItemStore()
const { filteredItems } = storeToRefs(itemStore)
const categoryStore = useCategoryStore()
const isVisible = ref(false)
const itemToDelete = ref<Item>()
const showDialog = ref(false)
const selectedItem = ref<Item>()
const loading = ref(false)
const toaster = createToaster({})

const categories = ref<Category[]>([])
const headers = [
  {
    key: 'item_id',
    title: 'ID',
    isComponent: true,
    transform: (obj: Item) => {
      return h(
        'span',
        {
          class: 'text-blue-600 font-medium cursor-pointer',
          onClick: () => loadItemDialog(obj),
        },
        '#' + obj.item_id,
      )
    },
  },
  {
    key: 'image',
    title: 'Image',
    isComponent: true,
    transform: (obj: Item) => {
      return h('img', { src: asset(obj.image), class: 'w-10 h-10' })
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
        onClick: () => loadItemDialog(obj),
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
  itemStore.setFilter({} as ItemFilter)
})

const loadItemDialog = (item?: Item) => {
  showDialog.value = true
  selectedItem.value = item
}

const saveItem = (item: Item) => {
  loading.value = true
  setTimeout(() => {
    if (item.item_id === 0) {
      itemStore.addItem(item)
    } else {
      itemStore.updateItem(item)
    }
    loading.value = false
    toaster.success('Successfully saved!', {
      position: 'top',
    })
    showDialog.value = false
  }, 500)
}

const deleteItem = (item: Item) => {
  isVisible.value = true
  itemToDelete.value = item
}

const handleConfirmation = (isYes: boolean) => {
  isVisible.value = false
  if (isYes) {
    itemStore.removeItem(itemToDelete.value!)
  }
}

const onSearch = (itemFilter: ItemFilter) => {
  itemStore.setFilter(itemFilter)
}
</script>
<template>
  <CustomTable :data="filteredItems" :headers="headers" :id="'item_id'">
    <template #actions>
      <ItemSearchPanel @onSearch="onSearch"></ItemSearchPanel>
      <CommonButton :btnType="Type.primary" :size="Size.sm" @click="loadItemDialog()">
        + New
      </CommonButton>
      <ConfirmationDialog
        v-if="isVisible"
        :title="'Delete Item'"
        :action="'delete'"
        :actionBtnLabel="'Confirm'"
        @onConfirm="handleConfirmation"
      ></ConfirmationDialog>
    </template>
  </CustomTable>
  <ItemFormDialog
    v-if="showDialog"
    :item="selectedItem"
    @onCancel="showDialog = false"
    @onSave="saveItem"
  ></ItemFormDialog>
</template>
<style></style>
