<!-- PatientRecord.vue -->
<script setup>
import { ref } from 'vue'
import { getPatientRecords } from '@/api/userPatientInfo'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const records = ref([])
const patientId = ref('')
const loading = ref(false)

const fetchRecords = async () => {
  if (!patientId.value) {
    ElMessage({
      message: '请输入患者ID',
      type: 'warning'
    })
    return
  }

  loading.value = true
  try {
    const response = await getPatientRecords(patientId.value, userData.token)
    records.value = response.data.data
  } catch (error) {
    // console.error('获取诊断记录错误:', error)
    ElMessage({
      message: error.response?.data?.msg || '获取诊断记录失败',
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <el-card class="record-container">
    <div class="search-header">
      <h3 class="header-title">诊断记录查询</h3>
      <div class="search-box">
        <el-input
          v-model="patientId"
          placeholder="输入患者ID"
          style="width: 240px; margin-right: 12px;"
          clearable
        />
        <el-button 
          type="primary" 
          @click="fetchRecords"
          :loading="loading"
        >
          查询记录
        </el-button>
      </div>
    </div>

    <el-table 
      :data="records" 
      v-loading="loading"
      style="width: 100%; margin-top: 20px;"
      stripe
      height="400px"
    >
      <el-table-column prop="id" label="记录ID" width="120" />
      <el-table-column prop="imageId" label="图像ID" width="160" />
      <el-table-column prop="diagnosisTime" label="诊断时间" width="180">
        <template #default="{row}">
          {{ new Date(row.diagnosisTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="leftDiseaseResults" label="左眼诊断结果" min-width="200" />
      <el-table-column prop="rightDiseaseResults" label="右眼诊断结果" min-width="200" />
    </el-table>
  </el-card>
</template>

<style scoped>
.record-container {
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.4rem;
}

.search-box {
  display: flex;
  align-items: center;
}

:deep(.el-table__empty-block) {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>