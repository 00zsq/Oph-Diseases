<script setup>
import { generateCurReport, downloadOneReport } from '@/api/userDiagnosis'
import { useUserStore } from '@/stores/userStore'
import { usePatientStore } from '@/stores/patientStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const patientStore = usePatientStore()

const generateReport = async (patient) => {
  if (!patient.language) {
    ElMessage({
      message: '请先选择报告语言',
      type: 'warning'
    })
    return
  }

  try {
    const res = await generateCurReport(patient.recordId, patient.language, userData.token)
    
    if (res.data.code === 1) {
      patient.reportId = res.data.data.id
      patient.reportGenerated = true
      ElMessage({
        message: '生成诊断报告成功',
        type: 'success'
      })
    } else {
      ElMessage({
        message: res.data.msg || '生成诊断报告失败，请检查网络连接',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: '生成诊断报告失败，请检查网络连接' + error.response?.data?.msg,
      type: 'error'
    })
  }
}

const downloadReport = async (patient) => {
  if (!patient.format) {
    ElMessage({
      message: '请先选择报告格式',
      type: 'warning'
    })
    return
  }

  try {
    const res = await downloadOneReport(patient.reportId, patient.format, userData.token)
    if (res.status === 200 && (
      res.headers['content-type']?.includes('application/pdf') ||
      res.headers['content-type']?.includes('image/png') ||
      res.headers['content-type']?.includes('text/html') )) {
      const blob = new Blob([res.data], { type: res.headers['content-type'] })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `report.${patient.format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      ElMessage({
        message: '下载诊断报告成功',
        type: 'success'
      })
    } else {
      ElMessage({
        message: res.data.msg || '下载诊断报告失败，请重新登陆',
        type: 'error'
      })
    } 
  } catch (error) {
    // console.error('下载报告错误:', error)
    ElMessage({
      message: '下载诊断报告失败，请检查网络连接' + error.response?.data?.msg,
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="container">
    <el-card class="report-card">
      <template #header>
          <h3 class="header">患者诊断报告管理</h3>
      </template>

      <div class="patient-list">
        <div class="patient-item header-item">
          <div class="patient-info">
            <div class="info-item id-card">身份证号</div>
            <div class="info-item">姓名</div>
            <div class="info-item">年龄</div>
            <div class="info-item">性别</div>
            <div class="info-item">语言</div>
            <div class="actions">选择操作</div>
          </div>
        </div>

        <div v-for="patient in patientStore.patients" :key="patient.idCard" class="patient-item">
          <div class="patient-info">
            <div class="info-item id-card">{{ patient.idCard }}</div>
            <div class="info-item">{{ patient.name }}</div>
            <div class="info-item">{{ patient.age }}岁</div>
            <div class="info-item">{{ patient.sex }}</div>
            
            <el-select 
              v-model="patient.language" 
              placeholder="选择语言"
              size="small"
              style="width: 100px">
              <el-option label="中文" value="ZH" />
              <el-option label="English" value="EN" />
            </el-select>

            <el-select 
              v-model="patient.format" 
              placeholder="选择格式"
              size="small"
              style="width: 100px"
              :disabled="!patient.reportGenerated">
              <el-option label="PDF" value="pdf" />
              <el-option label="PNG" value="png" />
              <el-option label="HTML" value="html" />
            </el-select>

            <div class="actions">
              <el-button 
                type="primary" 
                size="small"
                @click="generateReport(patient)"
                :loading="patient.generating">
                生成报告
              </el-button>
              <el-button 
                type="success" 
                size="small"
                :disabled="!patient.reportGenerated"
                @click="downloadReport(patient)">
                下载报告
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.container {
  /* padding: 20px; */
  margin-top: 20px;
  background: #f5f7fa;
  /* height: 100%; */
}

.header {
  font-size: 1.3rem;
}

.report-card {
  max-width: 100%;
  /* margin: 0 auto; */
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}


.patient-item {
  margin: 12px 0;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
}

.patient-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info-item {
  font-size: 14px;
  color: #606266;
  min-width: 120px;
}

.id-card {
  font-family: monospace;
  color: #409EFF;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.el-button {
  padding: 8px 16px;
}

.header-item {
  background: #f0f2f5;
  font-weight: bold;
}
</style>