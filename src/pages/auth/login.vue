<template>
  <div class="min-h-screen bg-[#FDB623] flex flex-col">
    <!-- Main Content -->
    <div class="px-6 pt-20 flex flex-col gap-8 pb-10">
      <!-- Welcome Text -->

      <div>
        <image src="/static/log.png" mode="widthFix" style="width:100%" />      
      </div>
      <div class="flex flex-col gap-2 text-center">
        <h2 class="text-4xl font-extrabold text-[#333] tracking-tight">Welcome Back</h2>
        <p class="text-lg text-[#333] leading-snug px-4">
          Enter your credentials to manage your digital contact profile.
        </p>
      </div>

      

      <!-- Form -->
      <form class="flex flex-col gap-5">
        <div class="flex flex-col gap-4">
          <AppInput
            v-model="email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            required
            :error="errors.email"
          />

          <AppInput
            v-model="password"
            label="Password"
            type="password"
            placeholder="Your password"
            required
            :error="errors.password"
          />
        </div>

        <div class="flex justify-end mt-[-8px]">
          <span class="text-md underline font-semibold text-[#333333] active:opacity-70 py-2 mt-2" @click="forgotPassword">
            Forgot password?
          </span>
        </div>

        <AppButton 
          variant="secondary"
          block
          size="lg"
          :loading="authStore.isLoading"
          class="mt-2 flex gap-3 text-white"
          @click="handleLogin"
        >
          Log In <span class="text-3xl text-white"> →</span>
        </AppButton>
         <div v-if="generalError" class="p-3 text-xs text-rose-600 font-medium">
        {{ generalError }}
      </div>
      </form>

     
      <!-- Footer moved up close to the login button -->
      <div class="text-center text-xs text-slate-700 mt-2"> 
        Don't have an account?
        <span class="font-bold underline text-[#333333] active:opacity-70 ml-1 inline-block" @click="goToSignUp">
          Create Account
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import AppInput from '../../components/AppInput.vue'
import AppButton from '../../components/AppButton.vue'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const generalError = ref('')
const errors = ref({ email: '', password: '' })

function validate(): boolean {
  let valid = true
  errors.value = { email: '', password: '' }
  generalError.value = ''

  if (!email.value.trim()) {
    errors.value.email = 'Please enter your email'
    valid = false
  }

  if (!password.value) {
    errors.value.password = 'Please enter your password'
    valid = false
  }

  return valid
}

async function handleLogin() {
  if (!validate()) return

  try {
    await authStore.login(email.value.trim(), password.value)
    uni.showToast({ title: 'Welcome back!', icon: 'success' })
    uni.reLaunch({ url: '/pages/home/index' })
  } catch (err: any) {
    generalError.value = err.message || 'Something went wrong. Please check your credentials.'
  }
}

function forgotPassword() {
  uni.showModal({
    title: 'Password Reset',
    content: 'Please enter your email to receive a password reset link.',
    editable: true,
    placeholderText: 'Enter your email',
    success(res) {
      if (res.confirm && res.content) {
        uni.showToast({ title: 'Reset email sent!', icon: 'success' })
      }
    }
  })
}

function goToSignUp() {
  uni.navigateTo({ url: '/pages/auth/signup' })
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}
</script>
