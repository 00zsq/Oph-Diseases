<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const selectedRoute = ref(route.name)

const handleRouteChange = (routeName) => {
  selectedRoute.value = routeName
  router.push({ path: `/user/diseaseDiagnosis/${routeName}` })
}

onMounted(() => {
  router.push('/user/diseaseDiagnosis/userDiagnosis')
})
</script>

<template>
  <div class="disease-diagnosis-container">
    <el-menu default-active="userDiagnosis" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="userDiagnosis" @click="handleRouteChange('userDiagnosis')">智能眼底分析</el-menu-item>
      <el-menu-item index="diagnosisReport" @click="handleRouteChange('diagnosisReport')">诊断报告</el-menu-item>
    </el-menu>
    
    <div class="content-wrapper">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.disease-diagnosis-container {
  padding: 20px;
  max-width: 100%;
}
</style>