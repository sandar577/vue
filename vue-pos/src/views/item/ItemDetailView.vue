<script lang="ts" setup>
import { useRoute } from 'vue-router'
import CustomCard from '@/components/CustomCard.vue'
import CommonButton from '@/components/CommonButton.vue'
import { onMounted, ref, watch } from 'vue'
import router from '@/router'
import { useItemStore } from '@/stores/itemStore'
import { createToaster } from '@meforma/vue-toaster'
import { useCategoryStore } from '@/stores/categoryStore'
import { Size, Type } from '@/constants/common'

const route = useRoute()
const item = ref<Item>()
const categories = ref<Category[]>([])
const loading = ref(false)
const isNew = ref(false)
const itemStore = useItemStore()
const categoryStore = useCategoryStore()

const toaster = createToaster({})

onMounted(() => {
  categories.value = categoryStore.categories
  checkAndLoadItem()
})

watch(
  () => route.params.id,
  () => {
    checkAndLoadItem()
  },
)

const checkAndLoadItem = () => {
  const id = route.params.id
  if (id === 'new') {
    isNew.value = true
    item.value = {
      item_id: 0,
      name: '',
      price: 0,
      barcode: '',
      category_id: 0,
      stock_quantity: 0,
      image: '/images/tiger.png',
    }
  } else {
    isNew.value = false
    item.value = { ...itemStore.getItem(+id) }
  }
}

const saveItem = () => {
  loading.value = true
  setTimeout(() => {
    let targetId
    if (isNew.value) {
      isNew.value = false
      targetId = itemStore.addItem(item?.value!)
    } else {
      itemStore.updateItem(item?.value!)
      targetId = item.value?.item_id
    }
    loading.value = false
    router.push(`/items/${targetId}`)
    toaster.success('<span class="font-bold items-center px-20">Successfully saved!<span>', {
      position: 'bottom-right',
    })
  }, 500)
}
</script>
<template>
  <CustomCard v-if="item" :route="'/items'" :title="'Item ID: ' + (isNew ? '#' : item.item_id)">
    <template v-if="!isNew" #header>
      <!-- <button class="bg-blue-600 text-white px-3 py-1 rounded" @click="$router.push('/items/new')">
        + New
      </button> -->
      <CommonButton :btnType="Type.primary" :size="Size.sm" @click="$router.push('/items/new')">
        + New
      </CommonButton>
    </template>
    <form @submit.prevent="saveItem">
      <div class="space-y-6 mt-3">
        <div class="flex justify-center items-center">
          <img :src="item.image" class="w-30 h-30 object-contain" />
        </div>
        <div class="grid grid-cols-6 items-center gap-4">
          <label for="name" class="col-span-2 text-sm font-medium text-gray-900"> Name </label>
          <div class="col-span-4">
            <input type="text" id="name" v-model="item.name" />
          </div>
        </div>

        <div class="grid grid-cols-6 items-center gap-4">
          <label for="price" class="col-span-2 text-sm font-medium text-gray-900"> Price </label>
          <div class="col-span-4">
            <input type="number" id="price" v-model="item.price" />
          </div>
        </div>

        <div class="grid grid-cols-6 items-center gap-4">
          <label for="barcode" class="col-span-2 text-sm font-medium text-gray-900">
            Barcode
          </label>
          <div class="col-span-4">
            <input type="text" v-model="item.barcode" />
          </div>
        </div>

        <div class="grid grid-cols-6 items-center gap-4">
          <label for="stock" class="col-span-2 text-sm font-medium text-gray-900"> Category </label>
          <div class="col-span-4">
            <select v-model="item.category_id">
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
            <input type="number" v-model="item.stock_quantity" />
          </div>
        </div>
        <div class="grid grid-cols-6 items-center gap-6 justify-center">
          <div class="col-span-6 flex justify-center items-center gap-4">
            <CommonButton
              :htmlType="'button'"
              :btnType="Type.danger"
              :size="Size.md"
              @onClick="() => $router.push('/items')"
              >Cancel</CommonButton
            >

            <CommonButton :htmlType="'submit'" :btnType="Type.secondary" :size="Size.md">{{
              loading ? 'Saving...' : isNew ? 'Save' : 'Update'
            }}</CommonButton>

            <!-- <button class="btn btn-primary bg-red-600" @click="() => $router.push('/items')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary bg-green-600">
              {{ loading ? 'Saving...' : isNew ? 'Save' : 'Update' }}
            </button> -->
          </div>
        </div>
      </div>
    </form>
  </CustomCard>
  <div v-else>Item Not Found</div>
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
