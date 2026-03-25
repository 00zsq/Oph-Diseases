<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const userData = userStore.getUserData()

const nextAiBaseUrl = import.meta.env.VITE_NEXT_AI_BASE_URL || 'http://localhost:3000/ai'
const iframeRef = ref(null)

const iframeUrl = computed(() => nextAiBaseUrl)

const iframeOrigin = computed(() => {
  try {
    return new URL(nextAiBaseUrl, window.location.origin).origin
  } catch {
    return ''
  }
})

const postTokenToIframe = () => {
  const token = userData?.token || ''
  if (!token || !iframeOrigin.value || !iframeRef.value?.contentWindow) {
    return
  }

  iframeRef.value.contentWindow.postMessage(
    {
      type: 'AUTH_TOKEN',
      token,
      source: 'oph-diseases-web',
      timestamp: Date.now(),
    },
    iframeOrigin.value,
  )
}

const handleIframeMessage = (event) => {
  if (event.origin !== iframeOrigin.value) {
    return
  }

  if (event.data?.type === 'REQUEST_AUTH_TOKEN') {
    postTokenToIframe()
  }
}

const handleIframeLoad = () => {
  postTokenToIframe()
}

watch(
  () => userData?.token,
  () => {
    postTokenToIframe()
  },
)

onMounted(() => {
  window.addEventListener('message', handleIframeMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleIframeMessage)
})
</script>

<template>
  <div class="ai-assistant-iframe-wrap">
    <iframe ref="iframeRef" :src="iframeUrl" class="ai-assistant-iframe" title="AI助手"
      allow="clipboard-read; clipboard-write" referrerpolicy="no-referrer"
      sandbox="allow-scripts allow-forms allow-popups allow-downloads allow-same-origin" @load="handleIframeLoad" />
  </div>
</template>

<style scoped>
.ai-assistant-iframe-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 180px);
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(135deg,
      hsl(0, 0%, 100%),
      hsl(235, 44%, 95%),
      hsl(223, 100%, 94%),
      hsl(226, 78%, 87%));
}

.ai-assistant-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
</style>