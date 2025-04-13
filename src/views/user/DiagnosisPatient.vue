<script setup>
import { getFetchPatientInfoByRecordId } from '../../api/userDiagnosisInfo'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const patientInfo = ref(null)
const recordId = ref('')
const fetchPatientInfo = async () => {
  // console.log(userStore.token);
  if (!recordId.value) {
    ElMessage({
      message: '请输入诊断记录ID',
      type: 'warning'
    })
    return
  }

  if (!['DOCTOR', 'RESEARCHER'].includes(userData.role)) {
    ElMessage({
      message: '无操作权限：仅医生和研究员可查看患者信息',
      type: 'warning'
    })
    return
  }

  try {
    const response = await getFetchPatientInfoByRecordId(recordId.value, userData.token)
    // console.log('患者信息:', response.data.data);
    
    patientInfo.value = response.data.data
  } catch (error) {
    ElMessage({
      message: error.response?.data?.msg || '获取患者信息失败',
      type: 'error'
    })
  }
}
</script>

<!-- 患者信息查询优化示例 -->
<template>
  <div class="query-container">
    <h2 class="query-title">患者信息查询</h2>
    <div class="query-form">
      <el-input 
        v-model="recordId" 
        placeholder="请输入诊断记录ID"
        style="width: 300px; margin-right: 12px;"
        clearable
      />
      <el-button 
        type="primary" 
        @click="fetchPatientInfo"
        :loading="loading"
      >查询</el-button>
    </div>

    <el-card v-if="patientInfo" class="info-card">
      <div class="info-item">
        <span class="info-label">姓名：</span>
        <span class="info-value">{{ patientInfo.name || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">身份证号：</span>
        <span class="info-value">{{ patientInfo.idCard || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">年龄：</span>
        <span class="info-value">{{ patientInfo.age || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">性别：</span>
        <span class="info-value">{{ patientInfo.sex || '-' }}</span>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.query-container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.query-title {
  color: #303133;
  font-size: 18px;
  margin-bottom: 20px;
}

.query-form {
  margin-bottom: 24x;
  display: flex;
  align-items: center;
}

.info-card {
  margin-top: 20px;
  border-radius: 8px;
}

.info-item {
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  width: 100px;
  color: #909399;
  font-weight: 500;
}

.info-value {
  color: #606266;
  flex: 1;
}
</style>