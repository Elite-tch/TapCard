<template>
  <div
    :class="[
      'relative rounded-full overflow-hidden flex items-center justify-center bg-[#333333] text-slate-700 shadow-sm shrink-0',
      sizeClasses[size],
    ]"
  >
    <img
      v-if="src"
      :src="src"
      :alt="name"
      class="w-full h-full object-cover"
      @error="hasError = true"
    />
    <span v-else-if="name" class="font-bold uppercase ">
      {{ initials }}
    </span>
    <span v-else class="text-xl">👤</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    src?: string
    name?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    size: 'md',
  }
)

const hasError = ref(false)

const sizeClasses = {
  sm: 'w-10 h-10 text-xs',
  md: 'w-16 h-16 text-lg',
  lg: 'w-24 h-24 text-2xl',
  xl: 'w-32 h-32 text-3xl',
}

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.trim().split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`
  }
  return parts[0].slice(0, 2)
})
</script>
