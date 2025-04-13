<script setup>
import { fetchDiagnosisConfidence } from '@/api/userDiagnosisInfo'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const confidenceData = ref(null)
const recordId = ref('')
const loading = ref(false)

const fetchConfidenceData = async () => {
  if (!recordId.value.trim()) {
    ElMessage({
      message: '请输入有效的诊断记录ID',
      type: 'warning'
    })
    return
  }

  if (!['DOCTOR'].includes(userData.role)) {
    ElMessage({
      message: '无操作权限：仅医生可查看置信度',
      type: 'warning'
    })
    return
  }

  try {
    loading.value = true
    const response = await fetchDiagnosisConfidence(recordId.value, userData.token)
    confidenceData.value = response.data.data
  } catch (error) {
    ElMessage({
      message: '获取置信度数据错误' + error.response?.data?.msg,
      type: 'error'
    })
    // console.error('获取置信度数据错误:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="confidence-container">
    <div class="header">
      <h3 class="title">诊断置信度查询</h3>
      <div class="search-box">
        <el-input 
          v-model="recordId" 
          placeholder="请输入诊断记录ID" 
          clearable
          style="width: 300px; margin-right: 12px;"
          @keyup.enter="fetchConfidenceData"
        >
          <!-- <template #prefix> -->
            <!-- <el-icon><Search /></el-icon> -->
          <!-- </template> -->
        </el-input>
        <el-button 
          type="primary" 
          :loading="loading"
          @click="fetchConfidenceData"
        >查询</el-button>
      </div>
    </div>

    <el-card v-if="confidenceData" class="confidence-card">
      <div class="eye-section">
        <h3 class="eye-title"><el-icon><View /></el-icon> 左眼诊断结果</h3>
        <div class="confidence-list">
          <div 
            v-for="(item, index) in confidenceData['左眼']" 
            :key="'left-'+index"
            class="confidence-item"
          >
            <span class="disease-name">{{ item.split(':')[0] }}</span>
            <el-progress 
              :percentage="parseFloat(item.split(':')[1])" 
              :stroke-width="16"
              :color="percentage => percentage > 75 ? '#67c23a' : percentage > 50 ? '#e6a23c' : '#f56c6c'"
            />
          </div>
        </div>
      </div>

      <el-divider />

      <div class="eye-section">
        <h3 class="eye-title"><el-icon><View /></el-icon> 右眼诊断结果</h3>
        <div class="confidence-list">
          <div 
            v-for="(item, index) in confidenceData['右眼']" 
            :key="'right-'+index"
            class="confidence-item"
          >
            <span class="disease-name">{{ item.split(':')[0] }}</span>
            <el-progress 
              :percentage="parseFloat(item.split(':')[1])" 
              :stroke-width="16"
              :color="percentage => percentage > 75 ? '#67c23a' : percentage > 50 ? '#e6a23c' : '#f56c6c'"
            />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.confidence-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.header {
  margin-bottom: 24px;
  padding-bottom: 20px;
  /* border-bottom: 1px solid #ebeef5; */
}

.title {
  color: #303133;
  font-size: 18px;
  margin-bottom: 16px;
}

.search-box {
  display: flex;
  align-items: center;
}

.confidence-card {
  margin-top: 20px;
  border-radius: 8px;
}

.eye-section {
  padding: 16px 0;
}

.eye-title {
  color: #409eff;
  font-size: 16px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-list {
  display: grid;
  gap: 16px;
}

.confidence-item {
  display: flex;
  align-items: center;
  gap: 20px;
}

.disease-name {
  width: 120px;
  color: #606266;
  font-weight: 500;
}

:deep(.el-progress-bar) {
  flex: 1;
}
</style>