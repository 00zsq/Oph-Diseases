<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout } from '@/api/admin'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()
const username = ref('管理员')
const token = ref(null)
const userData = userStore.getUserData()

onMounted(() => {
  if (userData) {
    username.value = userData.username
    token.value = userData.token
    // 默认跳转到用户管理页面
    
    router.push('/admin/user-management')
  } else {
    ElMessage({
      message: '未找到用户信息，请重新登录',
      type: 'error',
    })
    router.push('/login')
  }
})

const handleLogout = async () => {
  try {
    const response = await logout(userData.token)

    if (response.data.code === 1) {
      ElMessage({
        message: '已退出登录',
        type: 'success',
      })
      userStore.clearUserData()
      router.push('/login')
    } else if (response.data.code === 401) {
      ElMessage({
        message: response.data.msg || '退出登录失败',
        type: 'warning',
      })
    }
  } catch (error) {
    ElMessage({
      message: error.response?.data?.msg,
      type: 'warning',
    })
    userStore.clearUserData()
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
          <el-menu-item index="1" @click="router.push('/admin/user-management')">用户管理</el-menu-item>
          <el-menu-item index="2" @click="router.push('/admin/feedback-management')">反馈管理</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.head-page {
  height: 100%;
  background-color: #f0f4f8; /* 淡蓝灰色背景 */
}

.el-header {
  border-radius: 8px;
  background-color: #409EFF;
  color: white;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  width: 100%;
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
  display: flex;
  height: calc(100vh - 100px); 
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
  padding: 20px;
  width: 100%;
  margin-left: 20px;
  overflow: auto;
}
</style>