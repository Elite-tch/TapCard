<template>
  <div class="flex flex-col h-screen bg-[#FDB623] overflow-hidden">

    <!-- Hero -->
    <div class="flex-1 flex flex-col items-center justify-center px-6 gap-4">

      <div class="w-20 h-20 flex mb- items-center justify-center text-4xl shadow-lg shadow-[#42b983]/20">
        <image src="/static/icon.png" mode="widthFix" style="width:100%" class="mx-auto"/>
    
      </div>
    </div>

     
    
    
    <!-- Buttons -->
     <div class="bg-[#333333] flex flex-col gap-5 rounded-t-[50px] py-6 ">
      <div class="bg-[#FDB623] w-[50%] h-1 mx-auto mt-3"></div>
      <div class="text-center flex flex-col gap-1">
        <h1 class="text-white text-3xl font-bold">Get Started</h1>
           <p class="text-md text-white leading-snug">
          Share your contact in seconds. One scan. Done.
        </p>
      </div> 
 <div class="px-6  flex flex-col gap-3">
      <AppButton variant="primary" class="flex gap-4" block size="lg" @click="goToLogin">
        Sign In <span class="text-3xl">→</span>
      </AppButton>
      
    </div>
     </div>
   

  </div>
</template>

<script setup lang="ts">
import AppButton from '../../components/AppButton.vue'

function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/login' })
}

function goToSignUp() {
  uni.navigateTo({ url: '/pages/auth/signup' })
}
</script>
