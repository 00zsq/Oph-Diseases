<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getDoctorInfo } from '@/api/patient'
import { usePatientDiagnosisStore } from '@/stores/patientDiagnosisStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const selectedRoute = ref(route.name)

const patientDiagnosisStore = usePatientDiagnosisStore()
const patientData = patientDiagnosisStore.getPatientData()

const doctors = ref([])

const fetchDoctors = async () => {
  try {
    const response = await getDoctorInfo(patientData.token)
    if (response.data.code === 1) {
      doctors.value = response.data.data.map(doctor => ({
        ...doctor,
        appointmentStatus: null // 添加预约状态属性
      }))
    } else {
      ElMessage({
        message: response.data.msg || '获取医生信息失败',
        type: 'warning',
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '获取医生信息失败',
      type: 'error',
    })
  }
}

onMounted(() => {
  fetchDoctors()
  router.push('/patient/patientOperate/patientAppointment')
})

const handleRouteChange = (routeName) => {
  selectedRoute.value = routeName
  router.push({ name: routeName })
}
</script>

<template>
  <div class="patient-operate-container">
    <el-menu :default-active="selectedRoute" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="patientAppointment" @click="handleRouteChange('patientAppointment')">预约</el-menu-item>
      <el-menu-item index="patientReport" @click="handleRouteChange('patientReport')">报告</el-menu-item>
    </el-menu>
    <router-view :doctors="doctors"></router-view>
  </div>
</template>

<style scoped>
.patient-operate-container {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
</style>