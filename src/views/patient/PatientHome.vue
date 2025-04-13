<script setup>
import { ref, onMounted } from 'vue'
import { logout } from '@/api/patient'
import { useRouter } from 'vue-router'
import { usePatientDiagnosisStore } from '@/stores/patientDiagnosisStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const patientDiagnosisStore = usePatientDiagnosisStore()
const patientData = patientDiagnosisStore.getPatientData()

const patientName = ref('患者')
const patientId = ref(null)
const token = ref(null)

onMounted(() => {
  if (patientData) {
    patientName.value = patientData.username
    patientId.value = patientData.userId
    token.value = patientData.token
    router.push('/patient/patientInfo')
  } else {
    ElMessage({
      message: '未找到患者信息，请重新登录',
      type: 'error',
    })
    router.push('/login')
  }
})

const handleLogout = async () => {  
  try {
    const response = await logout(token.value)
    if (response.data.code === 1) {
      ElMessage({
        message: '已退出登录',
        type: 'success',
      })
      sessionStorage.removeItem('patientData')
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
      type: 'error',
    })
    sessionStorage.removeItem('patientData')
    router.push('/login')
  }
}
</script>

<template>
  <div class="head-page">
    <el-header>
      <el-col :span="12" class="left">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
        <span class="system-name">智慧眼科医疗平台</span>
      </el-col>

      <el-col :span="12" class="right">
        <img src="@/assets/patient.jpg" class="logo" />
        <span>{{ patientName }}</span>
        <el-button type="primary" @click="handleLogout">退出登录</el-button>
      </el-col>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <el-menu default-active="1" class="el-menu-vertical-demo">
          <el-menu-item index="1" @click="router.push('/patient/patientInfo')">患者信息</el-menu-item>
          <el-menu-item index="2" @click="router.push('/patient/patientOperate')">预约诊断</el-menu-item>
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
  background-color: #f0f4f8; /* 淡蓝灰色背景 */
}

.el-header {
  border-radius: 8px;
  background-color: #409EFF;
  color: white;
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
  margin-left: 20px;
  overflow: auto;
  padding: 0;
}
</style>