<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
    <div class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    <p class="text-xs font-semibold text-slate-500">Launching QR Contact Profile...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  const hasOnboarded = uni.getStorageSync('hasCompletedOnboarding')

  if (!hasOnboarded) {
    uni.reLaunch({ url: '/pages/onboarding/index' })
    return
  }

  await authStore.checkAuth()

  if (authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/home/index' })
  } else {
    uni.reLaunch({ url: '/pages/auth/welcome' })
  }
})
</script>
