<script setup>
import { ref, onMounted } from 'vue'
import { updateUserSelfInfo, sendUserFeedback } from '@/api/userInfo'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const newUsername = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const feedbackContent = ref('')
const userId = ref(null)
const token = ref(null)

const emit = defineEmits(['username-change'])
const router = useRouter()

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const usernamePattern = /^[a-zA-Z0-9_]{4,16}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

onMounted(() => {
  if (userData) {
    newUsername.value = userData.username
    userId.value = userData.userId
    token.value = userData.token
    email.value = userData.email
  }
})

const handleSave = async () => {
  if (!usernamePattern.test(newUsername.value)) {
    ElMessage({
      message: '用户名格式不正确，必须是4到16个字符，只能包含字母、数字和下划线',
      type: 'warning'
    })
    return
  }
  if (!passwordPattern.test(password.value)) {
    ElMessage({
      message: '密码格式不正确，必须至少8个字符，包含一个数字、一个大写字母、一个小写字母和一个特殊字符',
      type: 'warning'
    })
    return
  }
  if (password.value !== confirmPassword.value) {
    ElMessage({
      message: '两次输入的密码不一致',
      type: 'warning'
    })
    return
  }
  if (!emailPattern.test(email.value)) {
    ElMessage({
      message: '邮箱格式不正确，请输入有效的邮箱地址',
      type: 'warning'
    })
    return
  }
  try {
    const response = await updateUserSelfInfo(newUsername.value, password.value, email.value, token.value)

    if (response.data.code === 1) {
      ElMessage({
        message: '用户信息已保存',
        type: 'success'
      })
      // 触发父组件更新用户名
      emit('username-change', newUsername.value)
      // 更新 sessionStorage 中的用户名
      const userData = JSON.parse(sessionStorage.getItem('userData'))
      userData.username = newUsername.value
      userData.email = email.value
      sessionStorage.setItem('userData', JSON.stringify(userData))
    } else if (response.data.code === 401) {
      ElMessage({
        message: response.data.msg || '登录已过期，请重新登录',
        type: 'warning'
      })
      sessionStorage.removeItem('userData')
      router.push('/login')
    } else {
      ElMessage({
        message: response.data.msg || '保存失败',
        type: 'warning'
      })
    }
  } catch (error) {
    if (error.response?.data?.code === 401) {
      ElMessage({
        message: error.response.data.msg || '登录已过期，请重新登录',
        type: 'error'
      })
      sessionStorage.removeItem('userData')
      router.push('/login')
    } else {
      ElMessage({
        message: error.response?.data?.msg || '保存失败',
        type: 'error'
      })
    }
  }
}

const handleFeedback = async () => {
  if (!feedbackContent.value) {
    ElMessage({
      message: '反馈内容不能为空',
      type: 'warning'
    })
    return
  }
  try {
    const response = await sendUserFeedback(feedbackContent.value, token.value)
    if (response.data.code === 1) {
      ElMessage({
        message: '反馈已提交',
        type: 'success'
      })
      feedbackContent.value = ''
    } else {
      ElMessage({
        message: response.data.msg || '反馈提交失败，请检查网络连接',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.response?.data?.msg || '反馈提交失败，请检查网络连接',
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="user-container">
    <!-- 用户信息卡片 -->
    <el-card class="user-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">个人信息设置</span>
        </div>
      </template>
      
      <el-form :model="form" label-position="top" class="compact-form">
        <el-form-item label="用户名" required>
          <el-input 
            v-model="newUsername" 
            placeholder="4-16位字母、数字或下划线"
            clearable
            suffix-icon="el-icon-user"
          />
        </el-form-item>

        <el-form-item label="电子邮箱" required>
          <el-input
            v-model="email"
            placeholder="example@domain.com"
            clearable
            suffix-icon="el-icon-message"
          />
        </el-form-item>

        <el-form-item label="新密码" required>
          <el-input
            v-model="password"
            type="password"
            show-password
            placeholder="至少8位，包含大小写和特殊字符"
          />
        </el-form-item>

        <el-form-item label="确认密码" required>
          <el-input
            v-model="confirmPassword"
            type="password"
            show-password
            placeholder="再次输入新密码"
          />
        </el-form-item>

        <div class="form-actions">
          <el-button 
            type="primary" 
            icon="el-icon-check" 
            @click="handleSave"
            :disabled="formIsValid"
          >
            保存更改
          </el-button>
        </div>
      </el-form>
    </el-card>

    <!-- 反馈卡片 -->
    <el-card class="feedback-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">意见反馈</span>
          <el-tag type="info" size="small">建议与问题</el-tag>
        </div>
      </template>

      <el-form label-position="top">
        <el-form-item>
          <el-input
            v-model="feedbackContent"
            type="textarea"
            :autosize="{ minRows: 4 }"
            placeholder="请输入您的宝贵意见或遇到的问题..."
            resize="none"
          />
        </el-form-item>
        <div class="form-actions">
          <el-button 
            type="success" 
            icon="el-icon-position" 
            @click="handleFeedback"
            :disabled="!feedbackContent"
          >
            提交反馈
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.user-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 15px;
}

.user-card,
.feedback-card {
  margin-bottom: 24px;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.user-card:hover,
.feedback-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.compact-form {
  padding: 0 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
  color: #5c6b7a;
}

.el-textarea ::placeholder {
  color: #c0c4cc;
  font-style: italic;
}

.el-button {
  border-radius: 8px;
  padding: 10px 24px;
  letter-spacing: 0.5px;
}

.el-button [class*=el-icon-] {
  margin-right: 6px;
}

.el-input{
  /* color: #c0c4cc; */
  font-size: 14px;
}
</style>