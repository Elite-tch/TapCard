<template>
  <div class="min-h-screen bg-slate-900 text-white p-6 max-w-md mx-auto flex flex-col justify-between">
    <div class="space-y-1 text-center pt-8">
      <h1 class="text-2xl font-black">Scan QR Code</h1>
      <p class="text-xs text-slate-400">Point your camera at a contact QR code to view their profile.</p>
    </div>

    <div class="flex flex-col items-center justify-center my-auto space-y-6">
      <div class="w-64 h-64 border-4 border-indigo-500 border-dashed rounded-3xl flex items-center justify-center bg-slate-800/50 p-6 text-center space-y-3">
        <div class="text-6xl animate-bounce">📷</div>
      </div>
      <AppButton variant="primary" size="lg" block @click="startScanner">
        Launch Camera Scanner
      </AppButton>
    </div>

    <BottomNavigation active-path="/pages/home/index" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppButton from '../../components/AppButton.vue'
import BottomNavigation from '../../components/BottomNavigation.vue'

function startScanner() {
  uni.scanCode({
    success(res) {
      if (res.result) {
        if (res.result.includes('/u/')) {
          const username = res.result.split('/u/')[1]?.split('?')[0]
          if (username) {
            uni.navigateTo({ url: `/pages/public-profile/index?u=${username}` })
            return
          }
        }
        uni.showModal({
          title: 'QR Code Result',
          content: `Scanned: ${res.result}`,
          showCancel: false,
        })
      }
    },
    fail() {
      uni.showToast({ title: "This QR code isn't a supported profile QR code.", icon: 'none' })
    }
  })
}

onMounted(startScanner)
</script>
