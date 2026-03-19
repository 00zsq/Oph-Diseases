<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const userData = userStore.getUserData()

const nextAiBaseUrl = import.meta.env.VITE_NEXT_AI_BASE_URL || 'http://localhost:3000/ai'

const iframeUrl = computed(() => {
  const token = userData?.token || ''
  const separator = nextAiBaseUrl.includes('?') ? '&' : '?'
  return `${nextAiBaseUrl}${separator}token=${encodeURIComponent(token)}`
})
</script>

<template>
  <div class="ai-assistant-iframe-wrap">
    <iframe :src="iframeUrl" class="ai-assistant-iframe" title="AI助手" allow="clipboard-read; clipboard-write" />
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