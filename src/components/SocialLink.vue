<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="flex items-center no-underline gap-3 p-3.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl transition-all cursor-pointer group"
  >
    <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
      {{ iconEmoji }}
    </div>
    <div class="flex gap-1 flex-col flex-1 min-w-0">
      <span class="text-md font-bold text-slate-800 uppercase tracking-wider no-underline group-hover:text-indigo-600">
        {{ platform }}
      </span>
      <span class="text-xs text-[#333333] truncate">
        {{ url }}
      </span>
    </div>
    <span class="text-slate-400 group-hover:text-indigo-600 transition-colors text-sm">↗</span>
  </a>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  platform: string
  url: string
}>()

const iconMap: Record<string, string> = {
  linkedin: '💼',
  x: '✖',
  twitter: '✖',
  instagram: '📷',
  facebook: '👥',
  tiktok: '🎵',
  github: '💻',
  youtube: '▶️',
  website: '🌐',
  whatsapp: '💬',
  phone: '📞',
  email: '✉️',
}

const iconEmoji = computed(() => {
  const key = props.platform.toLowerCase()
  return iconMap[key] || '🔗'
})
</script>
