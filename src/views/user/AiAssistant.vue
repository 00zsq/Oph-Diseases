<script setup>
import { ref, computed } from 'vue'
import { sendMessageToAI } from '@/api/ai'
import { useUserStore } from '@/stores/userStore'
import userAvatar from '@/assets/OIP-C.jpg'
import aiAvatar from '@/assets/XF.jpg'

const userStore = useUserStore()
const userData = userStore.getUserData()

const messages = ref([
  { role: 'assistant', content: '您好，我是您的AI助手，有什么可以帮您的吗？' }
])
const newMessage = ref('')

// 简易节流函数
let timeout = null
const throttle = (func, delay) => {
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

const sendMessage = async (message) => {
  if (message.trim()) {
    messages.value.push({ role: 'user', content: message })
    try {
      const response = await sendMessageToAI(message, userData.token)

      if (response) {
        messages.value.push({ role: 'assistant', content: response.data })
      } else {
        messages.value.push({ role: 'assistant', content: '抱歉，我无法理解您的问题。' })
      }
    } catch (error) {
      messages.value.push({ role: 'assistant', content: '请求失败，请稍后再试。错误类型' + error.message })
    }
    newMessage.value = ''
  }
}

const throttledSendMessage = throttle(sendMessage, 300)

const handleSendMessage = () => {
  throttledSendMessage(newMessage.value)
}

const isSendButtonActive = computed(() => newMessage.value.trim() !== '')
</script>

<template>
  <div class="ai-assistant">
    <div class="messages">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
        <div class="avatar">
          <img 
            v-if="message.role === 'user'"
            :src="userAvatar" 
            alt="用户头像"
            class="user-avatar"
          >
          <img
            v-else
            :src="aiAvatar"
            alt="AI头像"
            class="ai-avatar"
          >
        </div>
        <div class="bubble">
          <span>{{ message.content }}</span>
        </div>
      </div>
    </div>
    
    <div class="input-area">
      <el-input
        v-model="newMessage"
        placeholder="请输入消息..."
        class="message-input"
        @keyup.enter="handleSendMessage"
        clearable
      >
        <template #append>
          <el-button 
            type="primary" 
            @click="handleSendMessage"
            :disabled="!newMessage.trim()"
            :class="{ 'active-button': isSendButtonActive }"
          >
            发送
            <el-icon class="el-icon--right"><Promotion /></el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
  </div>
</template>

<style scoped>
.ai-assistant {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(135deg,
    hsl(0, 0%, 100%),
    hsl(235, 44%, 95%),
    hsl(223, 100%, 94%),
    hsl(226, 78%, 87%));
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.message {
  display: flex;
  gap: 12px;
  max-width: 100%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  flex-shrink: 0;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bubble {
  padding: 12px 16px;
  border-radius: 12px;
  line-height: 1.5;
  position: relative;
  max-width: 70%;
  word-break: break-word;
}

.message.user .bubble {
  background: #1890ff;
  color: white;
  border-radius: 12px 12px 0 12px;
}

.message.assistant .bubble {
  background: white;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px 12px 12px 0;
}

.input-area {
  padding: 16px 20px;
  background: white;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.05);
}

.message-input {
  border-radius: 20px;
  font-size: 16px;
  height: 6vh;
  overflow: hidden;
}

.message-input :deep(.el-input__wrapper) {
  border-radius: 20px 0 0 20px;
  padding-left: 20px;
}

.message-input :deep(.el-input-group__append) {
  border-radius: 0 20px 20px 0;
  padding: 0 12px;
}

.active-button {
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
}

/* 滚动条样式 */
.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>