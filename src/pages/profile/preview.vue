<template>
  <div class="min-h-screen bg-slate-50 pb-12 max-w-md mx-auto p-6 space-y-6">
    <div class="flex justify-between items-center pt-2">
      <h1 class="text-xl font-black text-slate-900">Profile Preview</h1>
      <AppButton variant="secondary" size="sm" @click="goBack">
        Back to Edit
      </AppButton>
    </div>

    <!-- Public View Simulation -->
    <PublicProfileCard v-if="publicProfile" :profile="publicProfile" is-preview />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import PublicProfileCard from '../../components/PublicProfileCard.vue'
import AppButton from '../../components/AppButton.vue'
import type { PublicUserProfile } from '../../types'

const authStore = useAuthStore()

const publicProfile = computed<PublicUserProfile | null>(() => {
  const p = authStore.profile
  if (!p) return null

  return {
    username: p.username,
    fullName: p.fullName,
    profilePhotoUrl: p.profilePhotoUrl,
    jobTitle: p.jobTitle,
    bio: p.bio,
    location: p.publicLocation ? p.location : undefined,
    email: p.publicEmail ? p.email : undefined,
    phone: p.publicPhone ? p.phone : undefined,
    whatsapp: p.publicWhatsapp ? p.whatsapp : undefined,
    website: p.website,
    socialLinks: p.socialLinks || {},
    updatedAt: p.updatedAt,
  }
})

function goBack() {
  uni.navigateBack()
}
</script>
