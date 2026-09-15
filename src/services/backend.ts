import { createClient } from '@supabase/supabase-js'
import { CONFIG } from '../config'
import type { UserProfile, PublicUserProfile } from '../types'

const hasValidSupabase =
  CONFIG.SUPABASE_URL.startsWith('https://') &&
  !CONFIG.SUPABASE_URL.includes('your-supabase-id')

export const supabase = hasValidSupabase
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY)
  : null

const LOCAL_USERS_KEY = 'qr_app_users'
const LOCAL_PROFILES_KEY = 'qr_app_profiles'
const LOCAL_SESSION_KEY = 'qr_app_session'

function getLocalProfiles(): Record<string, UserProfile> {
  try {
    const raw = uni.getStorageSync(LOCAL_PROFILES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (e) {
    return {}
  }
}

function saveLocalProfiles(profiles: Record<string, UserProfile>) {
  uni.setStorageSync(LOCAL_PROFILES_KEY, JSON.stringify(profiles))
}

function filterPublicProfile(profile: UserProfile): PublicUserProfile | null {
  if (!profile.isPublic) return null

  return {
    username: profile.username,
    fullName: profile.fullName,
    profilePhotoUrl: profile.profilePhotoUrl,
    jobTitle: profile.jobTitle,
    bio: profile.bio,
    location: profile.publicLocation ? profile.location : undefined,
    email: profile.publicEmail ? profile.email : undefined,
    phone: profile.publicPhone ? profile.phone : undefined,
    whatsapp: profile.publicWhatsapp ? profile.whatsapp : undefined,
    website: profile.website,
    socialLinks: profile.socialLinks || {},
    updatedAt: profile.updatedAt,
  }
}

export const BackendService = {
  async checkUsernameAvailability(username: string): Promise<boolean> {
    const cleanUsername = username.trim().toLowerCase()
    if (!cleanUsername) return false

    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .single()
      return !data && !error
    }

    const profiles = getLocalProfiles()
    return !Object.values(profiles).some(
      (p) => p.username.toLowerCase() === cleanUsername
    )
  },

  async signUp(data: {
    fullName: string
    email: string
    password: string
    username: string
  }): Promise<{ user: { id: string; email: string }; profile: UserProfile }> {
    const isAvailable = await this.checkUsernameAvailability(data.username)
    if (!isAvailable) {
      throw new Error('Username is already taken. Please try another one.')
    }

    if (supabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })
      if (authError) throw new Error(authError.message)
      if (!authData.user) throw new Error('Registration failed.')

      const newProfile: UserProfile = {
        id: authData.user.id,
        email: data.email,
        username: data.username.toLowerCase(),
        fullName: data.fullName,
        publicPhone: true,
        publicWhatsapp: true,
        publicEmail: true,
        publicLocation: false,
        socialLinks: {},
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert(newProfile)

      if (profileError) throw new Error(profileError.message)

      return { user: { id: authData.user.id, email: data.email }, profile: newProfile }
    }

    // Local Storage Fallback Mode
    const userId = 'user_' + Date.now()
    const profiles = getLocalProfiles()

    const newProfile: UserProfile = {
      id: userId,
      email: data.email,
      username: data.username.toLowerCase(),
      fullName: data.fullName,
      publicPhone: true,
      publicWhatsapp: true,
      publicEmail: true,
      publicLocation: false,
      socialLinks: {},
      isPublic: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    profiles[userId] = newProfile
    saveLocalProfiles(profiles)
    uni.setStorageSync(LOCAL_SESSION_KEY, userId)

    return { user: { id: userId, email: data.email }, profile: newProfile }
  },

  async login(email: string, password: string): Promise<{ user: { id: string; email: string }; profile: UserProfile }> {
    if (supabase) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw new Error(authError.message)
      if (!authData.user) throw new Error('Login failed.')

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (profileError || !profile) throw new Error('Profile not found.')

      return { user: { id: authData.user.id, email: authData.user.email || email }, profile }
    }

    // Local Fallback
    const profiles = getLocalProfiles()
    const found = Object.values(profiles).find((p) => p.email.toLowerCase() === email.toLowerCase())
    if (!found) {
      throw new Error('Invalid email or password.')
    }

    uni.setStorageSync(LOCAL_SESSION_KEY, found.id)
    return { user: { id: found.id, email: found.email }, profile: found }
  },

  async logout(): Promise<void> {
    if (supabase) {
      await supabase.auth.signOut()
    }
    uni.removeStorageSync(LOCAL_SESSION_KEY)
  },

  async getCurrentSession(): Promise<{ userId: string; profile: UserProfile } | null> {
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      if (!data.session?.user) return null

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single()

      if (!profile) return null
      return { userId: data.session.user.id, profile }
    }

    const userId = uni.getStorageSync(LOCAL_SESSION_KEY)
    if (!userId) return null

    const profiles = getLocalProfiles()
    const profile = profiles[userId]
    if (!profile) return null

    return { userId, profile }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const updatedAt = new Date().toISOString()

    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updatedAt })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw new Error(error.message)
      return data
    }

    const profiles = getLocalProfiles()
    if (!profiles[userId]) throw new Error('Profile not found')

    const updated = {
      ...profiles[userId],
      ...updates,
      updatedAt,
    }

    profiles[userId] = updated
    saveLocalProfiles(profiles)
    return updated
  },

  async getPublicProfileByUsername(username: string): Promise<PublicUserProfile | null> {
    const cleanUsername = username.trim().toLowerCase()

    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername)
        .single()

      if (error || !data) return null
      return filterPublicProfile(data)
    }

    const profiles = getLocalProfiles()
    const match = Object.values(profiles).find(
      (p) => p.username.toLowerCase() === cleanUsername
    )
    if (!match) return null

    return filterPublicProfile(match)
  },

  async deleteAccount(userId: string): Promise<void> {
    if (supabase) {
      await supabase.from('profiles').delete().eq('id', userId)
      await supabase.auth.signOut()
    }
    const profiles = getLocalProfiles()
    delete profiles[userId]
    saveLocalProfiles(profiles)
    uni.removeStorageSync(LOCAL_SESSION_KEY)
  }
}
