<template>
  <div class="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow border border-slate-100 max-w-sm  mx-auto">
    <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center">
      <image v-if="qrDataUrl" :src="qrDataUrl" mode="aspectFit" style="width:224rpx;height:224rpx" />
      <div v-else class="w-56 h-56 flex items-center justify-center text-slate-400">
        Generating QR...
      </div>
    </div>

    <div class="text-center mt-2 mb-2">
      <p v-if="title" class="text-md text-indigo-600 font-medium">{{ title }}</p>
      <p class="text-md text-slate-400 mt-1 font-mono">Scan to connect</p>
    </div> 

    <div v-if="showActions" class="grid grid-cols-2 gap-2 w-full mt-2">
      <AppButton variant="secondary" size="md" @click="downloadQR" class="flex gap-2 items-center">
       Download
      </AppButton>
      <AppButton variant="primary" size="md" @click="shareQR" class="flex gap-2 items-center">
      Share
      </AppButton>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import QRCode from 'qrcode'
import AppButton from './AppButton.vue'

const props = withDefaults(
  defineProps<{
    url: string
    name: string
    title?: string
    showActions?: boolean
  }>(),
  {
    showActions: true,
  }
)

const qrDataUrl = ref('')

async function generateQR() {
  if (!props.url) return
  try {
    qrDataUrl.value = await QRCode.toDataURL(props.url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff',
      },
    })
  } catch (err) {
    console.error('Failed to generate QR code', err)
  }
}

function downloadQR() {
  if (!qrDataUrl.value) return
  // #ifdef H5
  const link = document.createElement('a')
  link.href = qrDataUrl.value
  link.download = `${props.name.toLowerCase().replace(/\s+/g, '_')}_qr.png`
  link.click()
  // #endif

  // #ifndef H5
  uni.showToast({ title: 'QR Code Saved', icon: 'success' })
  // #endif
}

function shareQR() {
  // #ifdef H5
  if (navigator.share) {
    navigator.share({
      title: `${props.name}'s Contact Profile`,
      text: `Scan or visit to get my contact info: ${props.name}`,
      url: props.url,
    }).catch(() => {})
  } else {
    copyLink()
  }
  // #endif

  // #ifndef H5
  copyLink()
  // #endif
}

function copyLink() {
  uni.setClipboardData({
    data: props.url,
    success() {
      uni.showToast({ title: 'Profile URL copied!', icon: 'success' })
    },
  })
}

onMounted(generateQR)
watch(() => props.url, generateQR)
</script>
