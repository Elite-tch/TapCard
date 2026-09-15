<template>
  <div class="min-h-screen bg-slate-50 flex flex-col justify-between p-6 max-w-md mx-auto">
    <!-- Skip button -->
    <div class="flex justify-end pt-4">
      <button
        v-if="currentSlide === 1"
        class="text-sm font-semibold text-slate-400 hover:text-slate-600 px-3 py-1.5"
        @click="completeOnboarding"
      >
        Skip
      </button>
    </div>

    <!-- Slide 1 -->
    <div v-if="currentSlide === 1" class="flex flex-col items-center text-center my-auto space-y-6">
      <div class="w-48 h-48 rounded-full bg-indigo-100 flex items-center justify-center text-6xl shadow-inner border-4 border-white">
        📲
      </div>
      <div class="space-y-3">
        <h1 class="text-2xl font-extrabold text-slate-900 leading-tight">
          Share your contact with one scan.
        </h1>
        <p class="text-sm text-slate-500 leading-relaxed px-4">
          Create your personal digital profile and let people instantly access your contact details and social links through one QR code.
        </p>
      </div>
    </div>

    <!-- Slide 2 -->
    <div v-else class="flex flex-col items-center text-center my-auto space-y-6">
      <div class="w-48 h-48 rounded-full bg-indigo-100 flex items-center justify-center text-6xl shadow-inner border-4 border-white">
        📇
      </div>
      <div class="space-y-3">
        <h1 class="text-2xl font-extrabold text-slate-900 leading-tight">
          One QR code. Everything about you.
        </h1>
        <p class="text-sm text-slate-500 leading-relaxed px-4">
          Add your WhatsApp, phone number, email, social links, bio and other details. Share them instantly whenever someone scans your QR code.
        </p>
      </div>

      <!-- Diagram -->
      <div class="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100">
        <span>Profile</span>
        <span>→</span>
        <span>QR Code</span>
        <span>→</span>
        <span>Scan</span>
        <span>→</span>
        <span>Contact</span>
      </div>
    </div>

    <!-- Footer & Indicators -->
    <div class="space-y-6 pb-6">
      <!-- Dots -->
      <div class="flex justify-center items-center gap-2">
        <span
          :class="[
            'h-2.5 rounded-full transition-all duration-300',
            currentSlide === 1 ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300',
          ]"
        ></span>
        <span
          :class="[
            'h-2.5 rounded-full transition-all duration-300',
            currentSlide === 2 ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300',
          ]"
        ></span>
      </div>

      <!-- Controls -->
      <div class="flex gap-3">
        <AppButton
          v-if="currentSlide === 2"
          variant="secondary"
          class="w-1/3"
          @click="currentSlide = 1"
        >
          Back
        </AppButton>
        <AppButton
          variant="primary"
          class="flex-1"
          @click="nextOrFinish"
        >
          {{ currentSlide === 1 ? 'Next' : 'Get Started' }}
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '../../components/AppButton.vue'

const currentSlide = ref(1)

function nextOrFinish() {
  if (currentSlide.value === 1) {
    currentSlide.value = 2
  } else {
    completeOnboarding()
  }
}

function completeOnboarding() {
  uni.setStorageSync('hasCompletedOnboarding', true)
  uni.reLaunch({ url: '/pages/auth/signup' })
}
</script>
