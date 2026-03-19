<script lang="ts" setup>
interface Props {
  headers: any[]
  data: any[]
  id: string
}
const props = defineProps<Props>()
</script>
<template>
  <div class="flex flex-1 flex-col overflow-auto px-4 pt-1">
    <div class="flex justify-end mb-2">
      <slot name="actions"></slot>
      <span
        class="inline-block bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full shadow-sm text-sm"
      >
        Total Count: {{ props.data.length }}
      </span>
    </div>
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr class="border-b border-default bg-white">
          <th class="px-1">No.</th>
          <th
            v-for="header in props.headers"
            :class="header.isIcon ? '' : 'px-6 py-5 text-left text-sm font-bold text-gray-700'"
            :key="header.key"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100 bg-white">
        <tr
          v-for="(obj, i) in props.data"
          :key="obj[props.id]"
          class="transition-colors even:bg-white odd:bg-gray-100 border-b border-default"
        >
          <td class="px-1 text-center">{{ i + 1 }}</td>
          <td
            v-for="header in props.headers"
            :key="header.key"
            :class="header.isIcon ? '' : 'px-5 py-3 whitespace-nowrap text-left text-gray-900'"
          >
            <component v-if="header.isComponent" :is="header.transform(obj)" />
            <span v-else>
              {{ header.transform ? header.transform(obj) : obj[header.key] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
