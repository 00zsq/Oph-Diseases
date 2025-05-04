<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/admin'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const router = useRouter()
const username = ref('默认用户名')
const userId = ref(null)
const token = ref(null)

onMounted(() => {
  if (userData) {
    username.value = userData.username
    userId.value = userData.userId
    token.value = userData.token
    // console.log('用户信息：', userData);
    
    router.push('/user/Home')
  } else {
    ElMessage({
      message: '未找到用户信息，请重新登录',
      type: 'error',
    })
    router.push('/login')
  }
})

// const handleUsernameChange = (newUsername) => {
  // username.value = newUsername
  // const userData = JSON.parse(sessionStorage.getItem('userData'))
  // userData.username = newUsername
  // sessionStorage.setItem('userData', JSON.stringify(userData))
// }

const handleLogout = async () => {
  try {
    const response = await logout(token.value)

    if (response.data.code === 1) {
      ElMessage({
        message: '已退出登录',
        type: 'success',
      })
      sessionStorage.removeItem('userData')
      router.push('/login')
    } else if (response.data.code === 401) {
      // alert(response.data.msg || '登录已过期，请重新登录')
      ElMessage({
        message: response.data.msg || '退出登录失败',
        type: 'warning',
      })
      // sessionStorage.removeItem('userData')
    // router.push('/login')
    }
  } catch (error) {
    ElMessage({
      message: error.response?.data?.msg,
      type: 'error',
    })
    sessionStorage.removeItem('userData')
    router.push('/login')
  }
}

import logoPath from '@/assets/logo.jpg'
import userAver from '@/assets/OIP-C.jpg'
</script>

<template>
  <div class="head-page">
    <el-header>
      <el-col :span="12" class="left">
        <img v-lazy="logoPath" alt="Logo" class="logo" />
        <span class="system-name">智慧眼科医疗平台</span>
      </el-col>

      <el-col :span="12" class="right">
        <img v-lazy="userAver" class="logo" />
        <span>{{ username }}</span>
        <el-button type="primary" @click="handleLogout">退出登录</el-button>
      </el-col>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="router.push('/user/Home')">首页</el-menu-item>
          <el-menu-item index="2" @click="router.push('/user/ai-assistant')">AI助手</el-menu-item>
          <el-menu-item index="3" @click="router.push('/user/diseaseDiagnosis')">病情诊断</el-menu-item>
          <!-- <el-menu-item index="4" @click="router.push('/user/diagnosis-report')">诊断报告</el-menu-item> -->
          <el-menu-item index="4" @click="router.push('/user/patientInfo')">患者信息</el-menu-item> 
          <el-menu-item index="5" @click="router.push('/user/DiagnosisInfo')">诊断信息</el-menu-item> 
          <el-menu-item index="6" @click="router.push('/user/info')">用户信息</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <RouterView/>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.head-page {
  /* height: 100%; */
  background-color: #f0f4f8; /* 淡蓝灰色背景 */
}

.el-header {
  border-radius: 8px;
  background-color: #409EFF;
  color: white;
  /* padding: 0 20px; */
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;
  /* margin-bottom: 16px; */
}

.el-header .left {
  display: flex;
  align-items: center;
}

.el-header .logo {
  height: 40px;
  margin-right: 10px;
  border-radius: 100%;
}

.el-header .system-name {
  font-size: 24px;
  font-weight: bold;
}

.el-header .right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.el-header .right .el-avatar {
  margin-right: 10px;
}

.el-container {
  margin-top: 20px;
  /* display: flex; */
  height: calc(100vh - 100px); /* 适应浏览器窗口高度 */
}

.el-aside {
  background-color: #fff;
  border-right: 1px solid #ebeef5;
  border-radius: 10px;
}

.el-main {
  background-color: #f8f8f8; /* 奶白色背景 */
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  /* padding: 20px; */
  /* width: 100%; */
  margin-left: 20px;
  overflow: auto;
  padding: 0;
  /* background: transparent; */
}
</style>