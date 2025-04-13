<script setup>
import { getFetchPatients } from '@/api/userPatientInfo'
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const patients = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPatients = ref(0)
const loading = ref(false)

const fetchPatients = async (page = 1) => {
  loading.value = true
  try {
    const response = await getFetchPatients(page, pageSize.value, userData.token)
    patients.value = response.data.data.records
    totalPatients.value = response.data.data.total
    currentPage.value = page // 更新当前页码
  } catch (error) {
    // console.error('获取患者列表错误:', error)
    ElMessage({
      message: error.response?.data?.msg,
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchPatients(page)
}

onMounted(() => {
  fetchPatients()
})
</script>

<template>
  <el-card class="patient-list">
    <h3 class="list-title">患者信息总览</h3>
    
    <el-row :gutter="20">
      <el-col v-for="(patient) in patients" :key="patient.id" :span="12">
        <el-card class="patient-card">
          <div class="patient-info">
            <div class="info-item"><strong>患者ID:</strong> {{ patient.id }}</div>
            <div class="info-item"><strong>姓名:</strong> {{ patient.name }}</div>
            <div class="info-item"><strong>身份证号:</strong> {{ patient.idCard }}</div>
            <div class="info-item"><strong>年龄:</strong> {{ patient.age }}</div>
            <div class="info-item"><strong>性别: </strong>
              <el-tag :type="patient.sex === '男' ? 'primary' : 'danger'" effect="plain">
                {{ patient.sex }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
      background
      layout="prev, pager, next, total"
      :total="totalPatients"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
      class="list-pagination"
    />
  </el-card>
</template>

<style scoped>
.patient-list {
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.list-title {
  margin: 0 0 24px 0;
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.patient-card {
  padding: 16px; /* 调整卡片内边距 */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 20px; /* 增加卡片之间的间距 */
  transition: transform 0.3s, box-shadow 0.3s; /* 添加动画效果 */
}

.patient-card:hover {
  transform: translateY(-5px); /* 鼠标悬停时向上移动 */
  box-shadow: 0 4px 16px rgba(0,0,0,0.2); /* 鼠标悬停时增加阴影 */
}

.patient-info {
  font-size: 1rem; /* 调整字体大小 */
  line-height: 1.6;
}

.info-item {
  margin-bottom: 10px;
}

.list-pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination.is-background .btn-prev),
:deep(.el-pagination.is-background .btn-next) {
  border-radius: 8px;
  padding: 0 12px;
}

:deep(.el-pagination.is-background .el-pager li) {
  border-radius: 8px;
  margin: 0 4px;
}
</style>