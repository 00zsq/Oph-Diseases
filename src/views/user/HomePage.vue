<script setup>
import { ref, onMounted } from 'vue'
import {
  fetchPatientAndDiseaseData, fetchUserAndRoleData,
  fetchDiagnosisRecordData, fetchOperateLogData
} from '@/api/userHome'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const token = ref(null)

const patientAndDiseaseData = ref(null)
const userAndRoleData = ref(null)
const diagnosisRecordData = ref(null)
const operateLogData = ref(null)

const fetchStatistics = async () => {
  try {
    const patientAndDiseaseRes = await fetchPatientAndDiseaseData(token.value)
    patientAndDiseaseData.value = patientAndDiseaseRes.data.data

    const userAndRoleRes = await fetchUserAndRoleData(token.value)
    userAndRoleData.value = userAndRoleRes.data.data

    const diagnosisRecordRes = await fetchDiagnosisRecordData(token.value)
    diagnosisRecordData.value = diagnosisRecordRes.data.data

    const operateLogRes = await fetchOperateLogData(token.value)
    operateLogData.value = operateLogRes.data.data

    renderCharts()
  } catch (error) {
    ElMessage({
      message: error.response?.data?.msg,
      type: 'error',
    })
  }
}

const renderCharts = () => {
  const patientAndDiseaseChart = echarts.init(document.getElementById('patientAndDiseaseChart'))
  const userAndRoleChart = echarts.init(document.getElementById('userAndRoleChart'))
  const diagnosisRecordChart = echarts.init(document.getElementById('diagnosisRecordChart'))
  const operateLogChart = echarts.init(document.getElementById('operateLogChart'))
  // 患者与疾病统计（使用疾病类型和患者数量）
  patientAndDiseaseChart.setOption({
    title: { text: '患者与疾病统计' },
    tooltip: {},
    xAxis: { 
      type: 'category', 
      data: patientAndDiseaseData.value.diseaseTypes, // 改用疾病类型数组
      axisLabel: {
        interval: 0, // 强制显示所有标签
        formatter: function (value) {
          const maxLength = 5; // 每行最多显示的字符数
          const lines = [];
          for (let i = 0; i < value.length; i += maxLength) {
            lines.push(value.slice(i, i + maxLength));
          }
          return lines.join("\n"); // 将每行拼接成最终的标签
        }
      }
    },
    yAxis: { type: 'value' },
    series: [{ 
      type: 'bar',
      data: patientAndDiseaseData.value.patientCounts // 改用患者数量数组
    }]
  })
  // 用户与角色统计（使用角色类型和用户数量）
  userAndRoleChart.setOption({
    title: { text: '用户与角色统计' },
    tooltip: {},
    xAxis: { 
      type: 'category', 
      data: userAndRoleData.value.roles // 改用角色数组
    },
    yAxis: { type: 'value' },
    series: [{ 
      type: 'bar',
      data: userAndRoleData.value.userCounts // 改用用户数量数组
    }]
  })
  // 诊断记录统计（使用日期和记录数量）
  diagnosisRecordChart.setOption({
    title: { text: '诊断记录统计' },
    tooltip: {},
    xAxis: { 
      type: 'category', 
      data: diagnosisRecordData.value.dates // 改用日期数组
    },
    yAxis: { type: 'value' },
    series: [{ 
      type: 'bar',
      data: diagnosisRecordData.value.recordCounts // 改用记录数量数组
    }]
  })
  // 操作日志统计（使用日期和日志数量）
  operateLogChart.setOption({
    title: { text: '操作日志统计' },
    tooltip: {},
    xAxis: { 
      type: 'category', 
      data: operateLogData.value.dates // 改用日期数组
    },
    yAxis: { type: 'value' },
    series: [{ 
      type: 'bar',
      data: operateLogData.value.logCounts // 改用日志数量数组
    }]
  })
}
onMounted(() => {
  const userData = JSON.parse(sessionStorage.getItem('userData'))
  if (userData) {
    token.value = userData.token
    fetchStatistics()
  } else {
    ElMessage({
      message: '未找到用户信息，请重新登录',
      type: 'error',
    })
    router.push('/login')
  }
})
</script>

<template>
  <div class="charts-container">
    <div id="patientAndDiseaseChart" class="chart"></div>
    <div id="userAndRoleChart" class="chart"></div>
    <div id="diagnosisRecordChart" class="chart"></div>
    <div id="operateLogChart" class="chart"></div>
  </div>
</template>

<style scoped>
.charts-container {
  background-color: white;
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>  