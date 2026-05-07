<script lang="ts" setup>
import CommonButton from '@/components/CommonButton.vue'
import { onMounted, ref, watch } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { Size, Type } from '@/constants/common'
import BaseDialog from '@/components/BaseDialog.vue'
import { asset } from '@/utils/asset'

const formItem = ref<Item | null>()
const categories = ref<Category[]>([])
const loading = ref(false)
const isNew = ref(false)
const categoryStore = useCategoryStore()

const props = defineProps<{ item?: Item }>()

onMounted(() => {
  categories.value = categoryStore.categories
  checkAndLoadItem()
})

watch(
  () => props.item,
  () => {
    checkAndLoadItem()
  },
)

const emit = defineEmits<{
  (e: 'onCancel'): void
  (e: 'onSave', value: Item): void
}>()
const checkAndLoadItem = () => {
  if (props.item) {
    isNew.value = false
    formItem.value = { ...props.item }
  } else {
    isNew.value = true
    formItem.value = {
      item_id: 0,
      name: '',
      price: 0,
      barcode: '',
      category_id: 0,
      stock_quantity: 0,
      image: '/images/tiger.png',
    }
  }
}
</script>
<template>
  <BaseDialog @onCancel="emit('onCancel')">
    <div v-if="formItem">
      <div class="border-b flex justify-between items-center">
        <h2 class="text-xl font-semibold">
          {{ 'Item ID: ' + (isNew ? '#' : formItem.item_id) }}
        </h2>
      </div>
      <form @submit.prevent="emit('onSave', formItem)">
        <div class="space-y-6 mt-3">
          <div class="flex justify-center items-center">
            <img :src="asset(formItem.image)" class="w-30 h-30 object-contain" />
          </div>
          <div class="grid grid-cols-6 items-center gap-4">
            <label for="name" class="col-span-2 text-sm font-medium text-gray-900"> Name </label>
            <div class="col-span-4">
              <input type="text" id="name" v-model="formItem.name" />
            </div>
          </div>

          <div class="grid grid-cols-6 items-center gap-4">
            <label for="price" class="col-span-2 text-sm font-medium text-gray-900"> Price </label>
            <div class="col-span-4">
              <input type="number" id="price" v-model="formItem.price" />
            </div>
          </div>

          <div class="grid grid-cols-6 items-center gap-4">
            <label for="barcode" class="col-span-2 text-sm font-medium text-gray-900">
              Barcode
            </label>
            <div class="col-span-4">
              <input type="text" v-model="formItem.barcode" />
            </div>
          </div>

          <div class="grid grid-cols-6 items-center gap-4">
            <label for="stock" class="col-span-2 text-sm font-medium text-gray-900">
              Category
            </label>
            <div class="col-span-4">
              <select v-model="formItem.category_id">
                <option v-for="c in categories" :key="c.category_id" :value="c.category_id">
                  {{ c.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-6 items-center gap-4">
            <label for="stock" class="col-span-2 text-sm font-medium text-gray-900">
              Stock Quantity
            </label>
            <div class="col-span-4">
              <input type="number" v-model="formItem.stock_quantity" />
            </div>
          </div>
          <div class="grid grid-cols-6 items-center gap-6 justify-center">
            <div class="col-span-6 flex justify-center items-center gap-4">
              <CommonButton
                :htmlType="'button'"
                :btnType="Type.danger"
                :size="Size.md"
                @onClick="() => emit('onCancel')"
                >Cancel</CommonButton
              >

              <CommonButton :htmlType="'submit'" :btnType="Type.secondary" :size="Size.md">{{
                loading ? 'Saving...' : isNew ? 'Save' : 'Update'
              }}</CommonButton>
            </div>
          </div>
        </div>
      </form>
    </div>
  </BaseDialog>
</template>
<style scoped>
@reference '@/style.css';

input,
select {
  @apply block w-full rounded-md bg-white px-3 py-2 text-sm text-gray-900 outline outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600;
}

.btn-primary {
  @apply px-4 py-2 text-white;
}
</style>
