<template>
  <button
    :class="[
      'flex items-center justify-center font-medium rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
      variantClasses[variant],
      sizeClasses[size],
      block ? 'w-full' : '',
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
       <slot />
  </button>
</template>

<script setup lang="ts">
type Variant = 'primary' | 'secondary' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    block?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    block: false,
    loading: false,
    disabled: false,
  }
)

defineEmits(['click'])

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[#FDB623] !text-[#333333] hover:bg-[#FDB623]/90 shadow-md',
  secondary: 'bg-[#333333] !text-white hover:bg-[#333333]/90',
  outline: 'border-2 border-[#42b983] !text-[#42b983] hover:bg-[#42b983]/20',
  danger: 'bg-rose-600 !text-white hover:bg-rose-700 shadow-md shadow-rose-200',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-3 text-sm',
  lg: 'px-6 py-4 text-xl font-semibold',
}
</script>
