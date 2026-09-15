<template>
  <div class="min-h-screen bg-slate-50 p-6 max-w-md mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
      <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-xs font-semibold text-slate-500">Loading digital profile...</p>
    </div>

    <!-- Profile Not Found / Unavailable -->
    <div v-else-if="!profile" class="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
      <div class="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl">
        🔍
      </div>
      <div class="space-y-1">
        <h2 class="text-xl font-bold text-slate-900">Profile Not Found</h2>
        <p class="text-xs text-slate-500 max-w-xs">
          This profile may have been removed or the link may be incorrect or set to private.
        </p>
      </div>
      <AppButton variant="primary" size="md" @click="goHome">
        Go Home
      </AppButton>
    </div>

    <!-- Public Profile Display -->
    <div v-else class="space-y-6 pt-4 pb-12">
      <PublicProfileCard :profile="profile" />
      
      <div class="text-center pt-6">
        <p class="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Powered by QR Contact</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { BackendService } from '../../services/backend'
import type { PublicUserProfile } from '../../types'
import PublicProfileCard from '../../components/PublicProfileCard.vue'
import AppButton from '../../components/AppButton.vue'

const isLoading = ref(true)
const profile = ref<PublicUserProfile | null>(null)

onMounted(async () => {
  let username = ''

  // #ifdef H5
  const urlParams = new URLSearchParams(window.location.search)
  username = urlParams.get('u') || ''
  if (!username) {
    const parts = window.location.pathname.split('/')
    const uIndex = parts.indexOf('u')
    if (uIndex !== -1 && parts[uIndex + 1]) {
      username = parts[uIndex + 1]
    }
  }
  // #endif

  if (!username) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1] as any
    if (currentPage && currentPage.$page && currentPage.$page.options) {
      username = currentPage.$page.options.u || currentPage.$page.options.username || ''
    }
  }

  if (username) {
    try {
      profile.value = await BackendService.getPublicProfileByUsername(username)
    } catch (e) {
      profile.value = null
    }
  }

  isLoading.value = false
})

function goHome() {
  uni.reLaunch({ url: '/pages/home/index' })
}
</script>
