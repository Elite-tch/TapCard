<template>
  <div class="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto">
    <!-- Header -->
    <div class="bg-[#FDB623] text-white px-6 pb-6 pt-12 rounded-b-3xl shadow-lg space-y-4">
      <div class="flex justify-between items-center">
        <div>
           <h1 class="text-xl text-[#333333] font-bold">Good {{ greeting }}, {{ authStore.profile?.fullName || 'User' }} 👋</h1>
          <p class="text-[#333333]">Welcome to your digital contact identity</p>
          </div>
        <AppAvatar
          :src="authStore.profile?.profilePhotoUrl"
          :name="authStore.profile?.fullName"
          size="md"
          class=" bg-[#333333] text-white "
        />
      </div>
    </div> 

    <!-- Main Content -->
    <div class="p-6 space-y-6 -mt-4">
      <!-- QR Code Card -->
      <QRCodeCard
        v-if="publicUrl"
        :url="publicUrl"
        :name="authStore.profile?.fullName || ''"
        :title="authStore.profile?.jobTitle || ''"
        show-actions
      />

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-2 gap-3">
        <button
          class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-28 w-full hover:border-indigo-200 transition-all text-center"
          @click="viewPublicProfile"
        >
          <span class="text-2xl">👁️</span>
          <span class="text-md font-bold text-slate-800">Public Profile</span>
        </button>

        <button
          class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-28 w-full hover:border-indigo-200 transition-all text-center"
          @click="goToEdit"
        >
          <span class="text-2xl">✏️</span>
          <span class="text-md font-bold text-slate-800">Edit Profile</span>
        </button>

        <button
          class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-28 w-full hover:border-indigo-200 transition-all text-center"
          @click="scanQR"
        >
          <span class="text-2xl">📷</span>
          <span class="text-md font-bold text-slate-800">Scan QR Code</span>
        </button>

        <button
          class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-28 w-full hover:border-indigo-200 transition-all text-center"
          @click="previewProfile"
        >
          <span class="text-2xl">🔍</span>
          <span class="text-md font-bold text-slate-800">Preview Profile</span>
        </button>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNavigation active-path="/pages/home/index" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { CONFIG } from '../../config'
import AppAvatar from '../../components/AppAvatar.vue'
import QRCodeCard from '../../components/QRCodeCard.vue'
import BottomNavigation from '../../components/BottomNavigation.vue'
const authStore = useAuthStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
})

const publicUrl = computed(() => {
  if (!authStore.profile?.username) return ''
  return `${CONFIG.PUBLIC_PROFILE_BASE_URL}/${authStore.profile.username}`
})

function viewPublicProfile() {
  if (!authStore.profile?.username) return
  uni.navigateTo({ url: `/pages/public-profile/index?u=${authStore.profile.username}` })
}

function goToEdit() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

function previewProfile() {
  uni.navigateTo({ url: '/pages/profile/preview' })
}

function scanQR() {
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

onMounted(() => {
  authStore.checkAuth()
})
</script>
