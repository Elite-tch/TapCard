import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BackendService } from '../services/backend'
import type { UserProfile } from '../types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: string; email: string } | null>(null)
  const profile = ref<UserProfile | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(true)

  async function checkAuth() {
    isLoading.value = true
    try {
      const session = await BackendService.getCurrentSession()
      if (session) {
        user.value = { id: session.userId, email: session.profile.email }
        profile.value = session.profile
        isAuthenticated.value = true
      } else {
        user.value = null
        profile.value = null
        isAuthenticated.value = false
      }
    } catch (e) {
      user.value = null
      profile.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  async function login(email: string, pass: string) {
    isLoading.value = true
    try {
      const res = await BackendService.login(email, pass)
      user.value = res.user
      profile.value = res.profile
      isAuthenticated.value = true
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function signUp(data: {
    fullName: string
    email: string
    password: string
    username: string
  }) {
    isLoading.value = true
    try {
      const res = await BackendService.signUp(data)
      user.value = res.user
      profile.value = res.profile
      isAuthenticated.value = true
      return res
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    isLoading.value = true
    try {
      await BackendService.logout()
      user.value = null
      profile.value = null
      isAuthenticated.value = false
    } finally {
      isLoading.value = false
    }
  }

  function setProfile(updated: UserProfile) {
    profile.value = updated
  }

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    checkAuth,
    login,
    signUp,
    logout,
    setProfile,
  }
})
