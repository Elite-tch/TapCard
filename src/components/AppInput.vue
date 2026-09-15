<template>
  <div class="flex flex-col gap-1.5 w-full">
    <div class="flex justify-between items-center">
      <label v-if="label" class="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {{ label }} <span v-if="required" class="text-rose-500">*</span>
      </label>
      <span v-if="maxlength" class="text-xs text-slate-400">
        {{ String(modelValue || '').length }}/{{ maxlength }}
      </span>
    </div>
    
    <div class="relative flex items-center">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :disabled="disabled"
        :class="[
          'w-full px-4 py-3 bg-white/50 border text-[#333] rounded-xl text-sm transition-all focus:outline-none focus:ring-0',
          error
            ? 'border-rose-400 focus:ring-rose-200 text-rose-900'
            : 'border-slate-200 focus:border-[#42b983] bg-transparent focus:ring-[#42b983]/20 text-[#333]',
        ]"
        @input="onInput"
      />
    </div>

    <p v-if="error" class="text-xs text-rose-500 font-medium">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-slate-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    type?: string
    error?: string
    hint?: string
    required?: boolean
    maxlength?: number
    disabled?: boolean
  }>(),
  {
    type: 'text',
    required: false,
    disabled: false,
  }
)

const emit = defineEmits(['update:modelValue'])

function onInput(e: any) {
  const value = e.detail?.value ?? e.target?.value ?? ''
  emit('update:modelValue', value)
}
</script>
