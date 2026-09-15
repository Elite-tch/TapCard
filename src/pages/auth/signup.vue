<template>
  <div class="min-h-screen bg-[#FDB623] flex flex-col justify-between p-6 max-w-md mx-auto">
    <div class=" pt-12">
      <div class="flex justify-center ">
        <image src="/static/sign.png" mode="widthFix" style="width:60%" class="mx-auto"/>
      </div>
      <div class="space-y-1">
        <h1 class="text-4xl text-center font-black text-slate-900">Create Account</h1>
        <p class="text-lg text-center text-[#333333]">
          Build your digital profile and share your contact details.
        </p>
      </div>

      <div v-if="generalError" class="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
        {{ generalError }}
      </div>

      <form class=" flex flex-col">
        <AppInput
          v-model="fullName"
          label="Full Name"
          placeholder="e.g. John Doe"
          required
          :error="errors.fullName"
          class="mb-3"
        />

        <AppInput
          v-model="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
           class="mb-3"
          :error="errors.email"
        />

        <AppInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          required
           class="mb-3"
          :error="errors.password"
        />

        <AppInput
          v-model="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          required
          :error="errors.confirmPassword"
        />

        <AppButton
          variant="secondary"
          block
          size="lg"
          :loading="authStore.isLoading"
          class="mt-4"
          @click="handleSignUp"
        >
          Create Account
        </AppButton>
      </form>
    </div>

    <div class="text-center justify-center mt-3 text-md flex items-center text-slate-900">
      Already have an account?
      <span class="font-bold underline text-[#333333] active:opacity-70 ml-1 " @click="goToLogin">
          Create Account
        </span>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useProfileStore } from '../../stores/profile'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const fullName = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const generalError = ref('')

const errors = ref({
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

function validate(): boolean {
  let valid = true
  errors.value = { fullName: '', username: '', email: '', password: '', confirmPassword: '' }
  generalError.value = ''

  if (!fullName.value.trim()) {
    errors.value.fullName = 'Full name is required'
    valid = false
  }

  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
    valid = false
  }

  if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    valid = false
  }

  if (password.value !== confirmPassword.value) {
    errors.value.confirmPassword = 'Passwords do not match'
    valid = false
  }

  return valid
}

async function handleSignUp() {
  if (!validate()) return

  try {
    const autoUsername = email.value.trim().split('@')[0].replace(/[^a-z0-9_-]/g, '') + Math.floor(Math.random() * 1000)

    const isAvailable = await profileStore.checkUsername(autoUsername)
    // If somehow taken, just append more randomness
    const finalUsername = isAvailable ? autoUsername : autoUsername + Math.floor(Math.random() * 1000)

    await authStore.signUp({
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      username: finalUsername,
    })

    uni.showToast({ title: 'Account created!', icon: 'success' })
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (err: any) {
    generalError.value = err.message || 'Registration failed. Please try again.'
  }
}

function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/login' })
}
</script>
