<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getFetchAppointments, getFetchReports, downloadReport } from '@/api/patient'
import { usePatientDiagnosisStore } from '@/stores/patientDiagnosisStore'
import { defineProps } from 'vue'
import { ElMessage } from 'element-plus'

// Props 定义
const props = defineProps({
  doctors: {
    type: Array,
    required: true
  }
})

// Store 初始化
const patientDiagnosisStore = usePatientDiagnosisStore()
const patientData = patientDiagnosisStore.getPatientData()

// 响应式数据
const appointments = ref([])
const reports = ref([])
const diagnosisInfo = ref({
  leftDiseaseResults: [],
  rightDiseaseResults: []
})

// 模拟诊断数据（实际开发中应通过SSE获取）
const mockDiagnosisData = [
  {
    leftDiseaseResults: ['糖尿病视网膜病变', '其他异常', '近视相关病变'],
    rightDiseaseResults: ['正常']
  },
  {
    leftDiseaseResults: ['正常'],
    rightDiseaseResults: ['青光眼', 'AMD', '其他异常']
  },
  {
    leftDiseaseResults: ['白内障', '近视相关病变'],
    rightDiseaseResults: ['高血压视网膜病变', '白内障', '其他异常']
  },
  {
    leftDiseaseResults: ['AMD', '糖尿病视网膜病变'],
    rightDiseaseResults: ['青光眼', '白内障', '其他异常']
  }
]

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * mockDiagnosisData.length)
  diagnosisInfo.value = mockDiagnosisData[randomIndex]
})

// 预约状态映射
const statusMap = {
  PENDING: { text: '待确认', color: 'warning' },
  CONFIRMED: { text: '已确认', color: 'success' },
  CANCELLED: { text: '已取消', color: 'danger' }
}

// 数据获取方法
const fetchAppointments = async () => {
  try {
    const { data } = await getFetchAppointments(patientData.token)
    if (data.code === 1) {
      appointments.value = data.data.map(appointment => ({
        ...appointment,
        doctorName: props.doctors.find(d => d.id === appointment.doctorId)?.username || '未知医生'
      }))
    } else {
      ElMessage({
        message: data.msg || '获取预约列表失败',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取预约列表失败',
      type: 'error'
    })
  }
}

const fetchReports = async () => {
  try {
    const { data } = await getFetchReports(patientData.token)
    if (data.code === 1) {
      reports.value = data.data.map(report => ({
        ...report,
        selectedFormat: 'PDF' // 默认格式
      }))
    } else {
      ElMessage({
        message: data.msg || '获取报告列表失败',
        type: 'warning'
      }) 
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取报告列表失败',
      type: 'error'
    })
  }
}

// 报告下载处理
const handleDownloadReport = async (reportId, format) => {
  try {
    const res = await downloadReport(reportId, format, patientData.token)

    const contentType = res.headers['content-type']

    if (res.status === 200) {
      if (contentType.includes('application/json')) {
        // 处理 JSON 错误信息
        const reader = new FileReader()
        reader.onload = () => {
          const errorData = JSON.parse(reader.result)
          ElMessage({
            message: errorData.msg || '下载诊断报告失败',
            type: 'error'
          })
        }
        reader.readAsText(res.data)
      } else {
        // 处理 Blob 数据
        const blob = new Blob([res.data], { type: contentType })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `report.${format.toLowerCase()}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        ElMessage({
          message: '下载诊断报告成功',
          type: 'success'
        })
      }
    } else {
      ElMessage({
        message: '下载诊断报告失败，请重新登录',
        type: 'error'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '下载诊断报告失败',
      type: 'error'
    })
  }
}

let eventSource = null

// 生命周期钩子
onMounted(() => {
  fetchAppointments()
  fetchReports()

  // 实际SSE实现示例（需要后端支持）
  eventSource = new EventSource('/dsod/data/monitor', {
    headers: { 'token': patientData.token }
  })

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data)
    diagnosisInfo.value = {
      leftDiseaseResults: data.leftDiseaseResults,
      rightDiseaseResults: data.rightDiseaseResults
    }
  }
})

onUnmounted(() => eventSource.close())

// 监听医生数据变化
watch(() => props.doctors, { immediate: true })
</script>

<template>
  <div class="report-container">
    <!-- 实时诊断信息 -->
    <section class="diagnosis-section">
      <h2 class="section-title">实时诊断信息</h2>
      <div class="diagnosis-results">
        <div class="eye-result">
          <h3>左眼诊断结果</h3>
          <p>{{ diagnosisInfo.leftDiseaseResults.join(', ') }}</p>
        </div>
        <div class="eye-result">
          <h3>右眼诊断结果</h3>
          <p>{{ diagnosisInfo.rightDiseaseResults.join(', ') }}</p>
        </div>
      </div>
    </section>

    <!-- 预约查询 -->
    <section class="appointment-section">
      <h2 class="section-title">预约查询</h2>
      <el-table :data="appointments" class="data-table">
        <el-table-column prop="doctorName" label="医生姓名" width="180" />
        <el-table-column prop="appointmentTime" label="预约时间" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.color">
              {{ statusMap[row.status]?.text }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <!-- 报告查询 -->
    <section class="report-section">
      <h2 class="section-title">报告查询</h2>
      <el-table :data="reports" class="data-table">
        <el-table-column prop="recordId" label="报告ID" width="120" />
        <el-table-column prop="createTime" label="报告时间" />
        <el-table-column label="操作" width="260">
          <template #default="{ row }">
            <div class="action-group">
              <el-select 
                v-model="row.selectedFormat" 
                placeholder="选择格式"
                class="format-select"
              >
                <el-option label="PDF" value="PDF" />
                <el-option label="PNG" value="PNG" />
                <el-option label="HTML" value="HTML" />
              </el-select>
              <el-button 
                type="primary" 
                @click="handleDownloadReport(row.recordId, row.selectedFormat)"
              >
                下载报告
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<style scoped>
.report-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-title {
  margin-bottom: 24px;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  border-left: 4px solid #409eff;
  padding-left: 12px;
}

.diagnosis-results {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.eye-result {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.eye-result h3 {
  margin: 0 0 8px 0;
  color: #606266;
  font-size: 16px;
}

.eye-result p {
  margin: 0;
  color: #409eff;
  font-weight: 500;
}

.data-table {
  margin-bottom: 32px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.format-select {
  width: 120px;
}
</style>