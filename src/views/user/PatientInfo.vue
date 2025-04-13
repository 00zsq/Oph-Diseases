<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const selectedRoute = ref(route.name)

const handleRouteChange = (routeName) => {
  selectedRoute.value = routeName
  router.push({ name: routeName })
}

onMounted(() => {
  router.push('/user/patientInfo/patientList')
})
</script>

<template>
  <div class="patient-info-container">
    <el-menu default-active="patientList" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="patientList" @click="handleRouteChange('patientList')">患者列表</el-menu-item>
      <el-menu-item index="patientRecords" @click="handleRouteChange('patientRecords')">诊断记录</el-menu-item>
      <el-menu-item index="appointmentManagement" @click="handleRouteChange('appointmentManagement')">预约管理</el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<style scoped>
.patient-info-container {
  padding: 20px;
  /* min-height: 100%; */
}

.el-menu-demo {
  margin-bottom: 20px;
}
</style>