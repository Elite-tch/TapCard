<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-[#333333] backdrop-blur-md border-t border-slate-200 px-6 py-2">
    <div class="max-w-md mx-auto flex justify-around items-center">
      <div
        v-for="item in navItems"
        :key="item.path"
        :class="[
          'flex flex-col items-center gap-1 cursor-pointer py-1 px-3 rounded-xl transition-all',
          activePath === item.path ? 'text-[#FDB623] font-bold scale-105' : 'text-slate-100 font-medium hover:text-slate-600',
        ]"
        @click="navigate(item.path)"
      >
        <span class="text-xl leading-none">{{ item.icon }}</span>
        <span class="text-md tracking-tight mt-1">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  activePath: string
}>()

const navItems = [
  { label: 'Home', icon: '🏠', path: '/pages/home/index' },
  { label: 'QR Code', icon: '⊡', path: '/pages/qr/index' },
  { label: 'Profile', icon: '👤', path: '/pages/profile/index' },
  { label: 'Settings', icon: '⚙️', path: '/pages/settings/index' },
]

function navigate(path: string) {
  uni.switchTab({ url: path }).catch(() => {
    uni.navigateTo({ url: path })
  })
}
</script>
