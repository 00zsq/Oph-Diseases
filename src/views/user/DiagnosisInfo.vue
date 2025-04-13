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
  router.push('/user/diagnosisInfo/diagnosisList')
})
</script>

<template>
  <div class="diagnosis-info-container">
    <el-menu default-active="diagnosisList" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="diagnosisList" @click="handleRouteChange('diagnosisList')">诊断记录</el-menu-item>
      <el-menu-item index="diagnosisPatient" @click="handleRouteChange('diagnosisPatient')">患者信息</el-menu-item>
      <el-menu-item index="diagnosisConfidence" @click="handleRouteChange('diagnosisConfidence')">置信度</el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<style scoped>
.diagnosis-info-container {
  padding: 20px;
  /* min-height: 100%; */
}

.el-menu-demo {
  margin-bottom: 20px;
}
</style>