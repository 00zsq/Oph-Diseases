<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { usePatientDiagnosisStore } from '@/stores/patientDiagnosisStore'
import { ElMessage } from 'element-plus'

import {
  ArrowLeft,
  User,
  Key,
  Message,
  Tickets,
  Avatar,
  Reading,
  Position,
  Unlock
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const activeTab = ref('')
const patientDiagnosisStore = usePatientDiagnosisStore()
const userLoginForm = ref({
  username: '',
  password: ''
})
const userRegisterForm = ref({
  username: '',
  password: '',
  confirmPassword: '',
  role: 'HEALTHCARE',
  email: ''
})
const guestLoginForm = ref({
  guestName: ''
})
const patientLoginForm = ref({
  username: '',
  password: ''
})
const patientRegisterForm = ref({
  username: '',
  password: '',
  confirmPassword: ''
})

// 正则表达式
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const usernamePattern = /^[a-zA-Z0-9_]{4,16}$/

const handleUserLogin = async () => {
  if (userLoginForm.value.username && userLoginForm.value.password) {
    if (!usernamePattern.test(userLoginForm.value.username)) {
      ElMessage({
        message: '用户名格式不正确，必须是4到16个字符，只能包含字母、数字和下划线',
        type: 'warning',
      })
      return
    }
    if (!passwordPattern.test(userLoginForm.value.password)) {
      ElMessage({
        message: '密码格式不正确，必须至少8个字符，包含一个数字、一个大写字母、一个小写字母和一个特殊字符',
        type: 'warning',
      })
      return
    }
    try {
      const response = await userStore.login(userLoginForm.value.username, userLoginForm.value.password)
      if (response.data.code === 1) {
        ElMessage({
          message: '用户登录成功',
          type: 'success',
        })
        // 存储用户数据
        const userData = {
          userId: response.data.data.userId,
          username: response.data.data.username,
          token: response.data.data.token,
          email: response.data.data.email,
          role: response.data.data.role
        }
        sessionStorage.setItem('userData', JSON.stringify(userData))
        if (response.data.data.role === 'ADMIN') {
          router.push('/admin')
        } else {
          router.push('/user')
        }
      } else {
        ElMessage({
          message: response.msg || '登录失败',
          type: 'warning',
        })
      }
    } catch (error) {
      ElMessage({
        message: error.message || '登录失败',
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请输入用户名和密码',
      type: 'warning',
    })
  }
}

const handleUserRegister = async () => {
  if (userRegisterForm.value.username && userRegisterForm.value.password && userRegisterForm.value.confirmPassword && userRegisterForm.value.email) {
    if (!usernamePattern.test(userRegisterForm.value.username)) {
      ElMessage({
        message: '用户名格式不正确，必须是4到16个字符，只能包含字母、数字和下划线',
        type: 'warning',
      })
      return
    }
    if (!passwordPattern.test(userRegisterForm.value.password)) {
      ElMessage({
        message: '密码格式不正确，必须至少8个字符，包含一个数字、一个大写字母、一个小写字母和一个特殊字符',
        type: 'warning',
      })
      return
    }
    if (!emailPattern.test(userRegisterForm.value.email)) {
      ElMessage({
        message: '请输入有效的邮箱地址',
        type: 'warning',
      })
      return
    }
    if (userRegisterForm.value.password === userRegisterForm.value.confirmPassword) {
      try {
        const response = await userStore.register(userRegisterForm.value.username, userRegisterForm.value.password, userRegisterForm.value.role, userRegisterForm.value.email)
        if (response.data.code === 1) {
          ElMessage({
            message: '用户注册成功',
            type: 'success',
          })
          // 自动填充登录信息
          userLoginForm.value.username = userRegisterForm.value.username
          userLoginForm.value.password = userRegisterForm.value.password
          // 切换到用户登录页面
          activeTab.value = 'userLogin'
        } else {
          ElMessage({
            message: response.data.msg || '注册失败',
            type: 'warning',
          })
        }
      } catch (error) {
        ElMessage({
          message: error.message || '注册失败',
          type: 'error',
        })
      }
    } else {
      ElMessage({
        message: '两次输入的密码不一致',
        type: 'warning',
      })
    }
  } else {
    ElMessage({
      message: '请完整填写注册信息',
      type: 'warning',
    })
  }
}

const handleGuestLogin = () => {
  if (guestLoginForm.value.guestName) {
    ElMessage({
      message: '游客登录成功',
      type: 'success',
    })
    // 将游客名称存储到 sessionStorage
    sessionStorage.setItem('guestName', guestLoginForm.value.guestName)
    router.push('/visitor')
  } else {
    ElMessage({
      message: '请输入游客名称',
      type: 'warning',
    })
  }
}

const handlePatientLogin = async () => {
  if (patientLoginForm.value.username && patientLoginForm.value.password) {
    if (!usernamePattern.test(patientLoginForm.value.username)) {
      ElMessage({
        message: '用户名格式不正确，必须是4到16个字符，只能包含字母、数字和下划线',
        type: 'warning',
      })
      return
    }
    if (!passwordPattern.test(patientLoginForm.value.password)) {
      ElMessage({
        message: '密码格式不正确，必须至少8个字符，包含一个数字、一个大写字母、一个小写字母和一个特殊字符',
        type: 'warning',
      })
      return
    }
    try {
      const response = await patientDiagnosisStore.login(patientLoginForm.value.username, patientLoginForm.value.password)
      console.log(response)
      ElMessage({
        message: '患者登录成功',
        type: 'success',
      })
      router.push('/patient')
    } catch (error) {
      ElMessage({
        message: error.message || '登录失败',
        type: 'error',
      })
    }
  } else {
    ElMessage({
      message: '请输入患者名和密码',
      type: 'warning',
    })
  }
}

const handlePatientRegister = async () => {
  if (patientRegisterForm.value.username && patientRegisterForm.value.password && patientRegisterForm.value.confirmPassword) {
    if (!usernamePattern.test(patientRegisterForm.value.username)) {
      ElMessage({
        message: '用户名格式不正确，必须是4到16个字符，只能包含字母、数字和下划线',
        type: 'warning',
      })
      return
    }
    if (!passwordPattern.test(patientRegisterForm.value.password)) {
      ElMessage({
        message: '密码格式不正确，必须至少8个字符，包含一个数字、一个大写字母、一个小写字母和一个特殊字符',
        type: 'warning',
      })
      return
    }
    if (patientRegisterForm.value.password === patientRegisterForm.value.confirmPassword) {
      try {
        const response = await patientDiagnosisStore.register(patientRegisterForm.value.username, patientRegisterForm.value.password)
        if (response === 1) {
          ElMessage({
            message: '患者注册成功',
            type: 'success',
          }),
          // 自动填充登录信息
          patientLoginForm.value.username = patientRegisterForm.value.username
          patientLoginForm.value.password = patientRegisterForm.value.password
          // 切换到患者登录页面
          activeTab.value = 'patientLogin'
        }
        else {
          ElMessage({
            message: response.data.msg || '注册11失败',
            type: 'warning',
          })
        }
      } catch (error) {
        ElMessage({
          message: error.message || '注册失败',
          type: 'error',
        })
      }
    } else {
      ElMessage({
        message: '两次输入的密码不一致',
        type: 'warning',
      })
    }
  } else {
    ElMessage({
      message: '请完整填写注册信息',
      type: 'warning',
    })
  }
}
</script>

<template>
  <div class="page">
    <div class="container">
      <transition name="fade" mode="out-in">
        <div v-if="!activeTab" class="selection-container">
          <div class="grid">
            <el-card 
              v-for="(item, index) in [
                { label: '用户登录', icon: User, tab: 'userLogin' },
                { label: '用户注册', icon: Avatar, tab: 'userRegister' },
                { label: '游客登录', icon: Tickets, tab: 'guestLogin' },
                { label: '患者登录', icon: Reading, tab: 'patientLogin' },
                { label: '患者注册', icon: Position, tab: 'patientRegister' }
              ]" 
              :key="index"
              class="selection-card"
              shadow="hover"
              @click="activeTab = item.tab"
            >
              <component :is="item.icon" class="card-icon" />
              <h3 class="card-title">{{ item.label }}</h3>
            </el-card>
          </div>
        </div>

        <div v-else class="form-wrapper">
          <transition name="slide">
            <div class="form-container" v-if="activeTab">
              <div class="back-btn">
                <el-button 
                  :icon="ArrowLeft" 
                  type="text" 
                  circle 
                  @click="activeTab = ''"
                  class="back-button"
                />
              </div>

              <!-- 用户登录 -->
              <transition name="fade">
                <div v-if="activeTab === 'userLogin'" class="form-content">
                  <h2 class="form-title"><el-icon><User /></el-icon> 用户登录</h2>
                  <el-form>
                    <el-form-item>
                      <el-input
                        v-model="userLoginForm.username"
                        placeholder="用户名"
                        :prefix-icon="User"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="userLoginForm.password"
                        type="password"
                        placeholder="密码"
                        :prefix-icon="Unlock"
                        show-password
                        size="large"
                      />
                    </el-form-item>
                    <el-button 
                      type="primary" 
                      size="large" 
                      @click="handleUserLogin"
                      class="submit-btn"
                    >
                      立即登录
                    </el-button>
                  </el-form>
                </div>
              </transition>

              <!-- 用户注册 -->
              <transition name="fade">
                <div v-if="activeTab === 'userRegister'" class="form-content">
                  <h2 class="form-title"><el-icon><Avatar /></el-icon> 用户注册</h2>
                  <el-form>
                    <el-form-item>
                      <el-input
                        v-model="userRegisterForm.username"
                        placeholder="用户名"
                        :prefix-icon="User"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="userRegisterForm.password"
                        type="password"
                        show-password
                        placeholder="密码"
                        :prefix-icon="Key"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="userRegisterForm.confirmPassword"
                        type="password"
                        show-password
                        placeholder="确认密码"
                        :prefix-icon="Key"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-select 
                        v-model="userRegisterForm.role" 
                        placeholder="选择角色"
                        class="full-width"
                        size="large"
                      >
                        <el-option label="医生" value="DOCTOR" />
                        <el-option label="医疗保健" value="HEALTHCARE" />
                        <el-option label="机构" value="INSTITUTION" />
                        <el-option label="研究员" value="RESEARCHER" />
                        <el-option label="管理员" value="ADMIN" />
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="userRegisterForm.email"
                        type="email"
                        placeholder="电子邮箱"
                        :prefix-icon="Message"
                        size="large"
                      />
                    </el-form-item>
                    <el-button 
                      type="success" 
                      size="large" 
                      @click="handleUserRegister"
                      class="submit-btn"
                    >
                      立即注册
                    </el-button>
                  </el-form>
                </div>
              </transition>

              <!-- 游客登录 -->
              <transition name="fade">
                <div v-if="activeTab === 'guestLogin'" class="form-content">
                  <h2 class="form-title"><el-icon><Tickets /></el-icon> 游客登录</h2>
                  <el-form>
                    <el-form-item>
                      <el-input
                        v-model="guestLoginForm.guestName"
                        placeholder="游客名称"
                        :prefix-icon="Postcard"
                        size="large"
                      />
                    </el-form-item>
                    <el-button 
                      type="warning" 
                      size="large" 
                      @click="handleGuestLogin"
                      class="submit-btn"
                    >
                      游客访问
                    </el-button>
                  </el-form>
                </div>
              </transition>

              <!-- 患者登录 -->
              <transition name="fade">
                <div v-if="activeTab === 'patientLogin'" class="form-content">
                  <h2 class="form-title"><el-icon><Reading /></el-icon> 患者登录</h2>
                  <el-form>
                    <el-form-item>
                      <el-input
                        v-model="patientLoginForm.username"
                        placeholder="用户名"
                        :prefix-icon="User"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="patientLoginForm.password"
                        type="password"
                        placeholder="密码"
                        :prefix-icon="Unlock"
                        show-password
                        size="large"
                      />
                    </el-form-item>
                    <el-button 
                      type="primary" 
                      size="large" 
                      @click="handlePatientLogin"
                      class="submit-btn"
                    >
                      患者登录
                    </el-button>
                  </el-form>
                </div>
              </transition>

              <!-- 患者注册 -->
              <transition name="fade">
                <div v-if="activeTab === 'patientRegister'" class="form-content">
                  <h2 class="form-title"><el-icon><Position /></el-icon> 患者注册</h2>
                  <el-form>
                    <el-form-item>
                      <el-input
                        v-model="patientRegisterForm.username"
                        placeholder="用户名"
                        :prefix-icon="User"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="patientRegisterForm.password"
                        type="password"
                        show-password
                        placeholder="密码"
                        :prefix-icon="Key"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item>
                      <el-input
                        v-model="patientRegisterForm.confirmPassword"
                        type="password"
                        show-password
                        placeholder="确认密码"
                        :prefix-icon="Key"
                        size="large"
                      />
                    </el-form-item>
                    <el-button 
                      type="success" 
                      size="large" 
                      @click="handlePatientRegister"
                      class="submit-btn"
                    >
                      立即注册
                    </el-button>
                  </el-form>
                </div>
              </transition>
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 110vh;
  background-size: cover;
  background-position: top;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-image: url('@/assets/Login-bg.png');
}

.container {
  width: 90%;
  max-width: 1200px;
  padding: 20px;
}

.selection-container {
  animation: fadeIn 0.5s ease;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
  justify-content: center;
  max-width: 880px;
  margin: 0 auto;
}

.selection-card {
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.selection-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #409eff;
}

.card-title {
  font-size: 1rem;
  margin: 0;
  color: #2c3e50;
}

.form-wrapper {
  max-width: 400px;
  width: 90%;
  margin: 0 auto;
}

.form-container {
  background: rgba(255, 255, 255, 0.8);
  /* background: rgba(198, 229, 213, 0.85); */
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.form-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.5rem;
}

.back-button {
  position: absolute;
  left: 1rem;
  top: 1rem;
  color: #666;
}

.submit-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

/* 调整输入框样式 */
.el-input {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.el-input__wrapper {
  background: transparent !important;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1) !important;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #409eff !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .selection-card {
    padding: 1rem;
    min-height: 100px;
  }
  
  .card-icon {
    font-size: 1.5rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .selection-card {
    min-height: auto;
    padding: 1.2rem;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
}

/* 保持原有的动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  animation: slideIn 0.4s ease;
}

.slide-leave-active {
  animation: slideOut 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(50px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-50px);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>