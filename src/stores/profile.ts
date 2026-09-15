import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BackendService } from '../services/backend'
import { useAuthStore } from './auth'
import type { UserProfile } from '../types'

export const useProfileStore = defineStore('profile', () => {
  const isSaving = ref(false)
  const errorMessage = ref('')

  async function updateProfile(updates: Partial<UserProfile>) {
    const authStore = useAuthStore()
    if (!authStore.profile) throw new Error('Not authenticated')

    isSaving.value = true
    errorMessage.value = ''
    try {
      const updated = await BackendService.updateProfile(authStore.profile.id, updates)
      authStore.setProfile(updated)
      return updated
    } catch (e: any) {
      errorMessage.value = e.message || 'Failed to update profile'
      throw e
    } finally {
      isSaving.value = false
    }
  }

  async function checkUsername(username: string): Promise<boolean> {
    return BackendService.checkUsernameAvailability(username)
  }

  return {
    isSaving,
    errorMessage,
    updateProfile,
    checkUsername,
  }
})
