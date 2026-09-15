<template>
  <div class="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto p-6 space-y-6">
    <div class="space-y-1 text-center pt-2">
      <h1 class="text-2xl font-black text-slate-900">Your QR Code</h1>
      <p class="text-md text-slate-500">
        Let people scan this code to immediately view your contact profile.
      </p>
    </div>

    <!-- QR Card -->
    <QRCodeCard
      v-if="publicUrl"
      :url="publicUrl"
      :name="authStore.profile?.fullName || ''"
      :title="authStore.profile?.jobTitle || ''"
      show-actions
    />

    <!-- Printable Contact Card Generator -->
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-xl">
          <Printer />
        </div> 
        <div>
          <h3 class="font-bold text-[#333] text-sm">Printable Contact Card</h3>
          <p class="text-xs text-slate-700">Generate a digital business card ready for printing.</p>
        </div>
      </div>

      <AppButton variant="primary" block size="md" @click="showPrintModal = true">
        View Printable Card
      </AppButton>
    </div>

    <!-- Printable Modal -->
    <div
      v-if="showPrintModal"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-6 border border-slate-100 text-center">
        <div class="space-y-2">
          <AppAvatar
            :src="authStore.profile?.profilePhotoUrl"
            :name="authStore.profile?.fullName"
            size="lg"
            class="mx-auto"
          />
          <h2 class="font-extrabold text-slate-900 text-lg">{{ authStore.profile?.fullName }}</h2>
          <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {{ authStore.profile?.jobTitle || 'Contact Identity' }}
          </p>
          <p v-if="authStore.profile?.bio" class="text-xs text-slate-500 italic px-2">
            "{{ authStore.profile?.bio }}"
          </p>
        </div>

        <div class="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
          <QRCodeCard
            :url="publicUrl"
            :name="authStore.profile?.fullName || ''"
            :show-actions="false"
          />
        </div>

        <p class="text-[10px] text-slate-400 font-mono">
          {{ publicUrl }}
        </p>

        <div class="grid grid-cols-2 gap-2 pt-2">
          <AppButton variant="secondary" size="sm" @click="showPrintModal = false">
            Close
          </AppButton>
          <AppButton variant="primary" size="sm" @click="triggerPrint">
            Print
          </AppButton>
        </div>
      </div>
    </div>

    <BottomNavigation active-path="/pages/qr/index" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { CONFIG } from '../../config'
import QRCodeCard from '../../components/QRCodeCard.vue'
import AppAvatar from '../../components/AppAvatar.vue'
import AppButton from '../../components/AppButton.vue'
import BottomNavigation from '../../components/BottomNavigation.vue'
const authStore = useAuthStore()
const showPrintModal = ref(false)

const publicUrl = computed(() => {
  if (!authStore.profile?.username) return ''
  return `${CONFIG.PUBLIC_PROFILE_BASE_URL}/${authStore.profile.username}`
})

function triggerPrint() {
  // #ifdef H5
  window.print()
  // #endif

  // #ifndef H5
  uni.showToast({ title: 'Ready to print', icon: 'success' })
  // #endif
}
</script>
