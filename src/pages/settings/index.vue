<template>
  <div class="min-h-screen bg-slate-50 pb-24 max-w-md mx-auto p-6 space-y-6">
    <div class="space-y-1 pt-2">
      <h1 class="text-2xl font-black text-slate-900">Settings</h1>
      <p class="text-md text-slate-500">Manage your account preferences and security.</p>
    </div>

    <!-- Account Details -->
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <h3 class="text-md font-bold uppercase tracking-wider text-slate-400">Account</h3>

      <div class="space-y-3">
        <div class="flex justify-between items-center py-2 border-b border-slate-50">
          <span class="text-md font-medium text-slate-500">Email</span>
          <span class="text-md font-bold text-slate-800">{{ authStore.user?.email }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-slate-50">
          <span class="text-md font-medium text-slate-500">Username</span>
          <span class="text-md font-bold text-indigo-600">@{{ authStore.profile?.username }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Navigation Links -->
    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <h3 class="text-md font-bold uppercase tracking-wider text-slate-400">Preferences</h3>

      <button
        class="w-full flex justify-between items-center py-2.5 text-left border-b border-slate-50 hover:text-indigo-600"
        @click="goToEdit"
      >
        <span class="text-md font-bold text-slate-800">Edit Profile & Privacy</span>
        <span class="text-slate-400">→</span>
      </button>

      <button
        class="w-full flex justify-between items-center py-2.5 text-left border-b border-slate-50 hover:text-indigo-600"
        @click="changePassword"
      >
        <span class="text-md font-bold text-slate-800">Change Password</span>
        <span class="text-slate-400">→</span>
      </button>

      <button
        class="w-full flex justify-between items-center py-2.5 text-left hover:text-indigo-600"
        @click="resetOnboarding"
      >
        <span class="text-md font-bold text-slate-800">Replay Onboarding</span>
        <span class="text-slate-400">↺</span>
      </button>
    </div>

    <!-- Danger Zone -->
    <div class="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm space-y-4">
      <h3 class="text-md font-bold uppercase tracking-wider text-rose-500">Account Management</h3>

      <AppButton variant="secondary" block size="md" @click="handleLogout">
        Log Out
      </AppButton>

      <AppButton variant="danger" block size="md" @click="confirmDeleteAccount">
        Delete Account
      </AppButton>
    </div>

    <BottomNavigation active-path="/pages/settings/index" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'
import { BackendService } from '../../services/backend'
import AppButton from '../../components/AppButton.vue'
import BottomNavigation from '../../components/BottomNavigation.vue'

const authStore = useAuthStore()

function goToEdit() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}

function changePassword() {
  uni.showModal({
    title: 'Change Password',
    content: 'A password reset link will be sent to your registered email.',
    success(res) {
      if (res.confirm) {
        uni.showToast({ title: 'Reset link sent!', icon: 'success' })
      }
    }
  })
}

function resetOnboarding() {
  uni.removeStorageSync('hasCompletedOnboarding')
  uni.reLaunch({ url: '/pages/onboarding/index' })
}

async function handleLogout() {
  await authStore.logout()
  uni.reLaunch({ url: '/pages/auth/welcome' })
}

function confirmDeleteAccount() {
  uni.showModal({
    title: 'Delete Account?',
    content: 'This action cannot be undone. All your contact profile data and QR codes will be deleted.',
    confirmText: 'Delete',
    confirmColor: '#e11d48',
    async success(res) {
      if (res.confirm && authStore.user) {
        try {
          await BackendService.deleteAccount(authStore.user.id)
          await authStore.logout()
          uni.showToast({ title: 'Account deleted', icon: 'none' })
          uni.reLaunch({ url: '/pages/auth/welcome' })
        } catch (e: any) {
          uni.showToast({ title: e.message || 'Failed to delete account', icon: 'none' })
        }
      }
    }
  })
}
</script>
