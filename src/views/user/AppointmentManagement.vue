<script setup>
import { ref, onMounted } from 'vue'
import { getAppointments, doctorConfirmAppointment } from '@/api/userPatientInfo'
import { useUserStore } from '@/stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const { token } = userStore.getUserData()

// 响应式数据
const appointments = ref([])
const unconfirmedCount = ref(0)
const loading = ref(false)

// 状态映射配置
const statusMap = {
  PENDING: { text: '待确认', color: 'warning' },
  CONFIRMED: { text: '已确认', color: 'success' },
  CANCELLED: { text: '已取消', color: 'danger' }
}

// 获取预约列表
const fetchAppointments = async () => {
  try {
    loading.value = true
    const response = await await getAppointments(token)
    
    if (response.data.code === 1) {
      appointments.value = response.data.data
      updateUnconfirmedCount()
    }
  } catch (error) {
    ElMessage({
      message: '获取预约列表失败' + error.response?.data?.msg,
      type: 'error'
    })
  } finally {
    loading.value = false
  }
}

// 更新未确认计数
const updateUnconfirmedCount = () => {
  unconfirmedCount.value = appointments.value.filter(
    item => item.status === 'PENDING'
  ).length
}

// 确认预约
const confirmAppointment = async (appointmentId) => {
  try {
    const response = await doctorConfirmAppointment(appointmentId, token)
    
    if (response.data.code === 1) {
      appointments.value = appointments.value.filter(
        item => item.id !== appointmentId
      )
      updateUnconfirmedCount()
      ElMessage({
        message: '预约确认成功',
        type: 'success'
      })
    }
  } catch (error) {
    ElMessage({
      message: '确认预约失败' + error.response?.data?.msg,
      type: 'error'
    })
  }
}

// 获取实时排队人数
const fetchUnconfirmedCount = async () => {
    const { data } = ('/dsod/data/unconfirmed-count', {
      headers: { authentication: token }
    })
    
    data.code === 1 && (unconfirmedCount.value = data.data)
}

// 初始化数据获取
onMounted(() => {
  fetchAppointments()
  fetchUnconfirmedCount()
  // 设置定时刷新（根据需求调整间隔）
  // const timer = setInterval(fetchUnconfirmedCount, 30000)
  // onUnmounted(() => clearInterval(timer))
})
</script>

<template>
  <div class="management-container">
    <header class="header-section">
      <h2 class="title">预约管理</h2>
      <div class="stats-badge">
        <el-tag type="warning">待确认预约: {{ unconfirmedCount }}</el-tag>
      </div>
    </header>

    <section class="appointment-section">
      <el-table 
        :data="appointments" 
        v-loading="loading"
        class="data-table"
        stripe
      >
        <el-table-column prop="patientId" label="患者ID" width="120" />
        <el-table-column prop="doctorId" label="医生ID" width="120" />
        <el-table-column label="预约时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.appointmentTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.color" effect="plain">
              {{ statusMap[row.status]?.text || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button 
              v-if="row.status === 'PENDING'"
              type="primary" 
              size="small"
              @click="confirmAppointment(row.id)"
            >
              确认预约
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<style scoped>
.management-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}

.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 1.2em;
  background: #409eff;
  border-radius: 2px;
}

.stats-badge {
  display: flex;
  gap: 12px;
}

.data-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.data-table :deep(.el-table__cell) {
  padding: 12px 0;
}

.action-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>