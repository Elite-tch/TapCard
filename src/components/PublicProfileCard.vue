<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl text-center space-y-4 relative overflow-hidden">
      
      <AppAvatar
        :src="profile.profilePhotoUrl"
        :name="profile.fullName"
        size="xl"
        class="mx-auto shadow-md text-white"
      />

      <div class="space-y-1">
        <h1 class="text-2xl font-black text-slate-900">{{ profile.fullName }}</h1>
        <p v-if="profile.jobTitle" class="text-sm font-semibold text-[#333333]">
          {{ profile.jobTitle }}
        </p>
        <p v-if="profile.location" class="text-md text-slate-600 font-medium">
          {{ profile.location }} 
        </p>
         <p v-if="profile.bio" class="text-md text-slate-600 leading-relaxed max-w-xs mx-auto">
        {{ profile.bio }}
      </p>
      </div>

     

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-3 pt-2">
        <AppButton variant="primary" block size="md" @click="handleSaveContact">
          Save Contact
        </AppButton>
        <AppButton variant="secondary" block size="md" @click="handleShare">
          Share Profile
        </AppButton>
      </div>
    </div>

    <!-- Direct Contact Links -->
    <div v-if="hasContactInfo" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-900">Contact Details</h3>

      <div class="grid grid-cols-1 gap-2">
        <SocialLink v-if="profile.whatsapp" platform="whatsapp" :url="`https://wa.me/${cleanPhone(profile.whatsapp)}`" />
        <SocialLink v-if="profile.phone" platform="phone" :url="`tel:${profile.phone}`" />
        <SocialLink v-if="profile.email" platform="email" :url="`mailto:${profile.email}`" />
        <SocialLink v-if="profile.website" platform="website" :url="profile.website" />
      </div>
    </div>

    <!-- Social Links -->
    <div v-if="hasSocialLinks" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400">Social Networks</h3>

      <div class="grid grid-cols-1 gap-2">
        <SocialLink v-if="profile.socialLinks.linkedin" platform="linkedin" :url="profile.socialLinks.linkedin" />
        <SocialLink v-if="profile.socialLinks.x" platform="x" :url="profile.socialLinks.x" />
        <SocialLink v-if="profile.socialLinks.instagram" platform="instagram" :url="profile.socialLinks.instagram" />
        <SocialLink v-if="profile.socialLinks.facebook" platform="facebook" :url="profile.socialLinks.facebook" />
        <SocialLink v-if="profile.socialLinks.github" platform="github" :url="profile.socialLinks.github" />
        <SocialLink v-if="profile.socialLinks.tiktok" platform="tiktok" :url="profile.socialLinks.tiktok" />
        <SocialLink v-if="profile.socialLinks.youtube" platform="youtube" :url="profile.socialLinks.youtube" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PublicUserProfile } from '../types'
import { downloadVCard } from '../utils/vcard'
import AppAvatar from './AppAvatar.vue'
import AppButton from './AppButton.vue'
import SocialLink from './SocialLink.vue'

const props = withDefaults(
  defineProps<{
    profile: PublicUserProfile
    isPreview?: boolean
  }>(),
  {
    isPreview: false,
  }
)

const hasContactInfo = computed(() => {
  return !!(props.profile.whatsapp || props.profile.phone || props.profile.email || props.profile.website)
})

const hasSocialLinks = computed(() => {
  const s = props.profile.socialLinks
  return !!(s.linkedin || s.x || s.instagram || s.facebook || s.github || s.tiktok || s.youtube)
})

function cleanPhone(phone: string) {
  return phone.replace(/[^0-9]/g, '')
}

function handleSaveContact() {
  downloadVCard(props.profile)
}

function handleShare() {
  const shareUrl = window.location.href
  // #ifdef H5
  if (navigator.share) {
    navigator.share({
      title: `${props.profile.fullName}'s Contact Profile`,
      url: shareUrl,
    }).catch(() => {})
  } else {
    uni.setClipboardData({ data: shareUrl })
  }
  // #endif

  // #ifndef H5
  uni.setClipboardData({ data: shareUrl })
  // #endif
}
</script>
