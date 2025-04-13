<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import UploadImage from '@/components/UploadImage.vue'
import ImageList from '@/components/ImageList.vue'
import CaseChart from '@/components/CaseChart.vue'
import { useImageStore } from '@/stores/imageStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const visitorName = ref('游客')
const showUpload = ref(true)
const store = useImageStore()

onMounted(() => {
  const name = sessionStorage.getItem('guestName')
  if (name) {
    visitorName.value = name
  } else {
    ElMessage({
      message: '请重新登录',
      type: 'error',
    })
    router.push('/login')
  }
})

const handleLogout = () => {
  ElMessage({
    message: '已退出登录',
    type: 'success',
  })
  sessionStorage.removeItem('guestName')
  router.push('/login')
}

const handleUploadSuccess = () => {
  showUpload.value = false
}
</script>

<template>
  <div class="visitor-page">
    <el-header v-once>
      <el-col :span="12" class="left">
        <img src="@/assets/logo.jpg" alt="Logo" class="logo" />
        <span class="system-name">智慧眼科医疗平台</span>
      </el-col>

      <el-col :span="12" class="right">
        <img src="@/assets/OIP-C.jpg" class="logo"/>
        <span>{{ visitorName }}</span>
      </el-col>
    </el-header>

    <el-main>
      <div v-if="showUpload">
        <UploadImage @upload-success="handleUploadSuccess" />
      </div>
      <div v-else>
        <ImageList :images="store.images" />
        <CaseChart :cases="store.cases" />
      </div>
    </el-main>

    <el-button 
      class="logout-button" 
      type="primary" 
      @click="handleLogout"
    >
      <el-icon><logout />退出</el-icon>
    </el-button>
  </div>
</template>

<style scoped>
.visitor-page {
  height: 100%;
  background-color: #f0f4f8; /* 淡蓝灰色背景 */
  position: relative;
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
  width: 95%;
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

.el-main {
  background-color: #f8f8f8; /* 奶白色背景 */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 95%;
  margin: 20px auto;
  height: calc(100vh - 120px); /* 适应浏览器窗口高度 */
  position: relative;
}

.logout-button {
  position: fixed;
  bottom: 60px;
  right: 80px;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 50px;
  text-align: center;
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
}
</style>