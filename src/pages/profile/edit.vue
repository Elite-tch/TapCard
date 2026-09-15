<template>
  <div class="min-h-screen bg-slate-50 pb-12 max-w-md mx-auto p-6 space-y-6">
    <div class="flex justify-between mb-4 items-center pt-2">
      <div>
        <h1 class="text-2xl font-black text-slate-900">Edit Profile</h1>
        <p class="text-xs text-slate-500">Update your digital identity and contact links.</p>
      </div>
      <AppButton variant="secondary" size="sm" @click="goToPreview">
        Preview
      </AppButton>
    </div>

    <form class="space-y-6 " @submit.prevent="handleSave">
      <!-- Section 1: Basic Information -->
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 class="text-xs font-bold uppercase text-center tracking-wider text-[#333333]">Basic Information</h2>

        <div class="flex flex-col items-center gap-3">
          <div class="relative cursor-pointer group" @click="handleImageUpload">
            <AppAvatar :src="form.profilePhotoUrl" :name="form.fullName" size="xl" class="text-white transition-opacity group-hover:opacity-80" />
            <div class="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span class="text-2xl">📷</span>
              <span class="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
            </div>
          </div>
          <p class="text-xs text-slate-400">Tap to upload a new photo</p>
        </div>

        <AppInput v-model="form.fullName" label="Full Name" required />
        <AppInput v-model="form.jobTitle" label="Job Title / Profession" placeholder="e.g. Software Engineer" />
        
        <div class="flex flex-col gap-1.5 w-full">
          <div class="flex justify-between items-center">
            <label class="text-xs font-semibold text-slate-700 uppercase tracking-wider">Bio</label>
            <span class="text-xs text-slate-400">{{ form.bio.length }}/160</span>
          </div>
          <textarea
            v-model="form.bio"
            maxlength="160"
            rows="3"
            placeholder="Write a short biography..."
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-900"
          ></textarea>
        </div>

        <AppInput v-model="form.location" label="Location" placeholder="e.g. Lagos, Nigeria" />
      </div>

      <!-- Section 2: Contact Information -->
      <div class="bg-white mt-4 p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 class="text-xs font-bold uppercase text-center tracking-wider text-[#333333]">Contact Information</h2>

        <AppInput v-model="form.phone" label="Phone Number" type="tel" placeholder="+234 xxx xxx xxxx" />
        <AppInput v-model="form.whatsapp" label="WhatsApp Number" type="tel" placeholder="+234 xxx xxx xxxx" />
        <AppInput v-model="form.email" label="Email Address" type="email" placeholder="john@example.com" />
        <AppInput v-model="form.website" label="Website URL" placeholder="https://yourwebsite.com" />
      </div>

      <!-- Section 3: Social Media Links -->
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[#333333] text-center">Social Links</h2>

        <AppInput v-model="socials.linkedin" label="LinkedIn URL" placeholder="https://linkedin.com/in/..." />
        <AppInput v-model="socials.x" label="X / Twitter URL" placeholder="https://x.com/..." />
        <AppInput v-model="socials.instagram" label="Instagram URL" placeholder="https://instagram.com/..." />
        <AppInput v-model="socials.facebook" label="Facebook URL" placeholder="https://facebook.com/..." />
        <AppInput v-model="socials.github" label="GitHub URL" placeholder="https://github.com/..." />
        <AppInput v-model="socials.tiktok" label="TikTok URL" placeholder="https://tiktok.com/@..." />
        <AppInput v-model="socials.youtube" label="YouTube URL" placeholder="https://youtube.com/@..." />
      </div>

      <!-- Section 4: Privacy Controls -->
      <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
        <h2 class="text-xs font-bold uppercase tracking-wider text-[#333333] text-center">Privacy Controls</h2>

        <div class="space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm font-medium text-slate-800">Public Profile Enabled</span>
            <switch :checked="form.isPublic" @change="handleToggle('isPublic', $event)" color="#FDB623" style="transform:scale(0.8); margin-right:-10px" />
          </div>

          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm font-medium text-slate-800">Show Phone Number Publicly</span>
            <switch :checked="form.publicPhone" @change="handleToggle('publicPhone', $event)" color="#FDB623" style="transform:scale(0.8); margin-right:-10px" />
          </div>

          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm font-medium text-slate-800">Show WhatsApp Publicly</span>
            <switch :checked="form.publicWhatsapp" @change="handleToggle('publicWhatsapp', $event)" color="#FDB623" style="transform:scale(0.8); margin-right:-10px" />
          </div>

          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm font-medium text-slate-800">Show Email Publicly</span>
            <switch :checked="form.publicEmail" @change="handleToggle('publicEmail', $event)" color="#FDB623" style="transform:scale(0.8); margin-right:-10px" />
          </div>

          <div class="flex justify-between items-center py-2">
            <span class="text-sm font-medium text-slate-800">Show Location Publicly</span>
            <switch :checked="form.publicLocation" @change="handleToggle('publicLocation', $event)" color="#FDB623" style="transform:scale(0.8); margin-right:-10px" />
          </div>
        </div>
      </div>

      <AppButton variant="primary" block size="md" :loading="profileStore.isSaving" @click="handleSave">
        Save Changes
      </AppButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useProfileStore } from '../../stores/profile'
import AppInput from '../../components/AppInput.vue'
import AppAvatar from '../../components/AppAvatar.vue'
import AppButton from '../../components/AppButton.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const form = reactive({
  fullName: '',
  jobTitle: '',
  bio: '',
  location: '',
  profilePhotoUrl: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  isPublic: true,
  publicPhone: true,
  publicWhatsapp: true,
  publicEmail: true,
  publicLocation: false,
})

const socials = reactive({
  linkedin: '',
  x: '',
  instagram: '',
  facebook: '',
  github: '',
  tiktok: '',
  youtube: '',
})

function handleToggle(key: keyof typeof form, event: any) {
  (form as any)[key] = event.detail.value
}

onMounted(() => {
  const p = authStore.profile
  if (p) {
    form.fullName = p.fullName || ''
    form.jobTitle = p.jobTitle || ''
    form.bio = p.bio || ''
    form.location = p.location || ''
    form.profilePhotoUrl = p.profilePhotoUrl || ''
    form.phone = p.phone || ''
    form.whatsapp = p.whatsapp || ''
    form.email = p.email || ''
    form.website = p.website || ''
    form.isPublic = p.isPublic ?? true
    form.publicPhone = p.publicPhone ?? true
    form.publicWhatsapp = p.publicWhatsapp ?? true
    form.publicEmail = p.publicEmail ?? true
    form.publicLocation = p.publicLocation ?? false

    if (p.socialLinks) {
      socials.linkedin = p.socialLinks.linkedin || ''
      socials.x = p.socialLinks.x || ''
      socials.instagram = p.socialLinks.instagram || ''
      socials.facebook = p.socialLinks.facebook || ''
      socials.github = p.socialLinks.github || ''
      socials.tiktok = p.socialLinks.tiktok || ''
      socials.youtube = p.socialLinks.youtube || ''
    }
  }
})

async function handleSave() {
  try {
    await profileStore.updateProfile({
      ...form,
      socialLinks: { ...socials },
    })
    uni.showToast({ title: 'Profile updated!', icon: 'success' })
  } catch (err: any) {
    uni.showToast({ title: err.message || 'Failed to save', icon: 'none' })
  }
}

function goToPreview() {
  uni.navigateTo({ url: '/pages/profile/preview' })
}

function handleImageUpload() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempPath = res.tempFilePaths[0] as string
      form.profilePhotoUrl = tempPath
      uni.showToast({ title: 'Photo updated locally', icon: 'none' })
    },
  })
}
</script>
