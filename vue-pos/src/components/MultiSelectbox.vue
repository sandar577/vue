<script lang="ts" setup>
import { computed, ref } from 'vue'

const open = ref(false)
const props = defineProps<{
  selected: number[]
  options: { id: number; value: string }[]
  label?: string
}>()

const selected = computed(() => props.selected ?? [])

const emit = defineEmits<{ (e: 'onSelect', selected: number[]): void }>()

const toggleDropdown = () => {
  open.value = !open.value
}

const toggleOption = (selectedId: number) => {
  let updated = selected.value
  if (updated.includes(selectedId)) {
    updated = selected.value.filter((id) => id !== selectedId)
  } else {
    updated.push(selectedId)
  }
  emit('onSelect', updated)
}

const toggleAll = () => {
  let updated = selected.value
  if (updated.length === props.options.length) {
    updated = []
  } else {
    updated = props.options.map((option) => option.id)
  }
  emit('onSelect', updated)
}
</script>
<template>
  <div class="w-64 relative" tabindex="0" @focusout="open = false">
    <div
      class="border border-gray-300 bg-white rounded-md p-3 flex flex-wrap gap-1 cursor-pointer"
      @click="toggleDropdown"
    >
      <span v-for="(selectedId, index) in selected" :key="selectedId" class="rounded text-sm">
        {{ options.find((option) => option.id === selectedId)?.value }}
        <span v-if="index !== selected.length - 1">, </span>
      </span>
      <span class="text-gray-400 text-sm" v-show="!selected.length">
        {{ props.label ?? 'Select Options ...' }}
      </span>
    </div>

    <div v-show="open" class="absolute mt-1 w-64 border border-gray-300 rounded bg-white shadow">
      <div class="p-2 hover:bg-gray-100 cursor-pointer flex" @click="toggleAll">
        <input type="checkbox" class="mx-2" :checked="selected.length === options.length" />
        <span class="text-sm">All</span>
      </div>
      <div
        v-for="option in options"
        :key="option.id"
        class="p-2 hover:bg-gray-100 cursor-pointer flex"
        @click="() => toggleOption(option.id)"
      >
        <input type="checkbox" class="mx-2" :checked="selected.includes(option.id)" />
        <span class="text-sm">{{ option.value }}</span>
      </div>
    </div>
  </div>
</template>
