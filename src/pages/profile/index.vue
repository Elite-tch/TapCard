<template>
  <div class="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
      <AppAvatar
        :src="authStore.profile?.profilePhotoUrl"
        :name="authStore.profile?.fullName"
        size="xl"
        class="mx-auto text-white"
      />
      <div>
        <h1 class="text-2xl font-extrabold text-slate-900">{{ authStore.profile?.fullName }}</h1>
        <p class="text-md text-indigo-600 font-semibold mt-0.5">@{{ authStore.profile?.username }}</p>
        <p v-if="authStore.profile?.jobTitle" class="text-md text-slate-500 font-medium mt-1">
          {{ authStore.profile?.jobTitle }}
        </p>
      </div>

      <div class="flex gap-2 justify-center pt-2">
        <AppButton variant="primary" size="md" @click="goToEdit" class="flex gap-2 items-center">
         ✏️  Edit Profile
        </AppButton>
        <AppButton variant="secondary" size="md" @click="goToPreview" class="flex gap-2 items-center">
          👁️ Preview
        </AppButton>
      </div>
    </div>

    <!-- Contact Info Summary -->
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <h3 class="text-md font-bold uppercase tracking-wider text-slate-400">Contact Overview</h3>

      <div class="space-y-3 text-md">
        <div class="flex justify-between items-center py-1 border-b border-slate-50">
          <span class="text-slate-500">Email</span>
          <span class="font-medium text-slate-800">{{ authStore.profile?.email || 'Not set' }}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-slate-50">
          <span class="text-slate-500">Phone</span>
          <span class="font-medium text-slate-800">{{ authStore.profile?.phone || 'Not set' }}</span>
        </div>
        <div class="flex justify-between items-center py-1 border-b border-slate-50">
          <span class="text-slate-500">WhatsApp</span>
          <span class="font-medium text-slate-800">{{ authStore.profile?.whatsapp || 'Not set' }}</span>
        </div>
        <div class="flex justify-between items-center py-1">
          <span class="text-slate-500">Public Status</span>
          <span
            :class="[
              'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase',
              authStore.profile?.isPublic ? 'bg-[#FDB623] text-[#333333]/70' : 'bg-rose-100 text-rose-700',
            ]"
          >
            {{ authStore.profile?.isPublic ? 'Public' : 'Private' }}
          </span>
        </div>
      </div>
    </div>

    <BottomNavigation active-path="/pages/profile/index" />
  </div>
</template>

<script setup lang="ts">
import {useAuthStore} from '../../stores/auth'
import AppAvatar from '../../components/AppAvatar.vue'
import AppButton from '../../components/AppButton.vue'
import BottomNavigation from '../../components/BottomNavigation.vue'
const authStore = useAuthStore()

function goToEdit() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

function goToPreview() {
  uni.navigateTo({ url: '/pages/profile/preview' })
}
</script>
