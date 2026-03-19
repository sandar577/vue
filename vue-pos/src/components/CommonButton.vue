<script lang="ts" setup>
import { Size, Type } from '@/constants/common'

interface Props {
  btnType: Type
  size: Size
  active?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
}
const emit = defineEmits<{
  (e: 'onClick'): void
}>()
const props = withDefaults(defineProps<Props>(), {
  size: Size.md,
  btnType: Type.primary,
  htmlType: () => 'button',
})
</script>
<template>
  <div>
    <button
      :type="props.htmlType!"
      :class="[
        props.active ? 'btn-primary' : 'btn-' + props.btnType,
        'btn-' + props.size,
        $attrs.class,
      ]"
      @click="() => emit('onClick')"
    >
      <slot></slot>
    </button>
  </div>
</template>
<style scoped>
@reference '@/style.css';

.btn-primary {
  @apply bg-blue-600 text-white;
}
.btn-secondary {
  @apply bg-green-600 text-white;
}
.btn-danger {
  @apply bg-red-600 text-white;
}
.btn-light {
  @apply border border-blue-600 text-blue-600;
}
.btn-grey {
  @apply bg-gray-200;
}
.btn-xs {
  @apply px-2;
}
.btn-sm {
  @apply px-2 py-1;
}
.btn-md {
  @apply px-4 py-2;
}
.btn-lg {
  @apply px-6 py-3;
}
.btn-xl {
  @apply px-8 py-4;
}

button {
  @apply rounded cursor-pointer;
}
</style>
