<script setup>
import { ref, defineProps } from 'vue'
import { makeAppointment, updateAppointment } from '@/api/patient'
import dayjs from 'dayjs'
import { usePatientDiagnosisStore } from '@/stores/patientDiagnosisStore'
import { ElMessage } from 'element-plus'

// 获取患者数据
const patientDiagnosisStore = usePatientDiagnosisStore()
const patientData = patientDiagnosisStore.getPatientData()

// 接收 doctors 作为 props
const props = defineProps({
  doctors: {
    type: Array,
    required: true
  }
})

// 弹窗控制
const showAppointmentDialog = ref(false)
const showUpdateDialog = ref(false)
const showCancelDialog = ref(false)

// 预约表单数据
const appointmentForm = ref({
  doctorId: null,
  appointmentTime: ''
})

// 修改预约表单数据
const updateForm = ref({
  id: null,
  appointmentTime: ''
})

// 取消预约表单数据
const cancelForm = ref({
  id: null
})

// 预约医生
const handleAppointmentClick = (doctorId) => {
  appointmentForm.value.doctorId = doctorId
  showAppointmentDialog.value = true
}

const handleAppointment = async () => {
  try {
    const formattedTime = dayjs(appointmentForm.value.appointmentTime).format('YYYY-MM-DD HH:mm:ss')
    const response = await makeAppointment(appointmentForm.value.doctorId, formattedTime, patientData.token)
    if (response.data.code === 1) {
      ElMessage({
        message: '预约成功',
        type: 'success'
      })
      showAppointmentDialog.value = false
      const doctor = props.doctors.find(d => d.id === appointmentForm.value.doctorId)
      if (doctor) {
        doctor.appointmentStatus = 'pending' // 设置预约状态为 pending
      }
    } else {
      ElMessage({
        message: response.data.msg || '预约失败',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '预约失败',
      type: 'error'
    })
  }
}

// 修改预约
const handleUpdateClick = (doctorId) => {
  updateForm.value.id = doctorId
  showUpdateDialog.value = true
}

const handleUpdateAppointment = async () => {
  try {
    const formattedTime = dayjs(updateForm.value.appointmentTime).format('YYYY-MM-DD HH:mm:ss')
    const response = await updateAppointment(updateForm.value.id, formattedTime, 'PENDING', patientData.token)
    if (response.data.code === 1) {
      ElMessage({
        message: '修改预约成功',
        type: 'success'
      })
      showUpdateDialog.value = false
      const doctor = props.doctors.find(d => d.id === updateForm.value.id)
      if (doctor) {
        doctor.appointmentStatus = 'pending' // 设置预约状态为 pending
      }
    } else {
      ElMessage({
        message: response.data.msg || '修改预约失败',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '修改预约失败',
      type: 'error'
    })
  }
}

// 取消预约
const handleCancelClick = (doctorId) => {
  cancelForm.value.id = doctorId
  showCancelDialog.value = true
}

const handleCancelAppointment = async () => {
  try {
    const response = await updateAppointment(cancelForm.value.id, null, 'CANCELLED', patientData.token)
    if (response.data.code === 1) {
      ElMessage({
        message: '取消预约成功',
        type: 'success'
      })
      showCancelDialog.value = false
      const doctor = props.doctors.find(d => d.id === cancelForm.value.id)
      if (doctor) {
        doctor.appointmentStatus = 'cancelled' // 设置预约状态为 cancelled
      }
    } else {
      ElMessage({
        message: response.data.msg || '取消预约失败',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '取消预约失败',
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="appointment-container">
    <div class="header">
      <h2 class="page-title">🏥 医生预约管理</h2>
      <div class="desc">选择医生进行预约操作</div>
    </div>

    <el-row :gutter="24" class="doctor-list doctor-row">
      <el-col 
        v-for="doctor in props.doctors" 
        :key="doctor.id" 
        :xs="24" 
        :sm="12" 
        :md="8"
      >
        <el-card class="doctor-card" shadow="hover">
          <div class="card-content">
            <div class="doctor-avatar">
              <el-avatar :size="60" :src="doctor.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
            </div>
            <div class="doctor-info">
              <div class="info-item">
                <el-icon><Message /></el-icon>
                <span class="doctor-name">姓名：{{ doctor.username }}</span>
              </div>
              <div class="info-item">
                <el-icon><Message /></el-icon>
                <span>邮箱：{{ doctor.email }}</span>
              </div>
              <div class="info-item">
                <el-icon><Clock /></el-icon>
                <span>注册时间：{{ doctor.createTime }}</span>
              </div>
            </div>
            <div class="doctor-actions">
              <el-button 
                type="primary" 
                @click="handleAppointmentClick(doctor.id)"
                class="action-btn"
              >
                <el-icon><Calendar /></el-icon>
                <span class="btn-text">预约</span>
              </el-button>
              <el-button 
                type="warning" 
                :disabled="doctor.appointmentStatus !== 'pending'"
                @click="handleUpdateClick(doctor.id)"
                class="action-btn"
              >
                <el-icon><Edit /></el-icon>
                <span class="btn-text">修改</span>
              </el-button>
              <el-button 
                type="danger" 
                :disabled="doctor.appointmentStatus !== 'pending'"
                @click="handleCancelClick(doctor.id)"
                class="action-btn"
              >
                <el-icon><Close /></el-icon>
                <span class="btn-text">取消</span>
              </el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预约弹窗 -->
    <el-dialog 
      v-model="showAppointmentDialog" 
      title="📅 预约医生"
      width="500px"
      center
    >
      <el-form :model="appointmentForm" label-width="80px">
        <el-form-item label="预约时间">
          <el-date-picker
            v-model="appointmentForm.appointmentTime"
            type="datetime"
            placeholder="选择预约时间"
            style="width: 100%"
            :shortcuts="[ 
              { text: '1小时后', value: new Date(Date.now() + 3600 * 1000) },
              { text: '明天此时', value: new Date(Date.now() + 86400 * 1000) },
            ]"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAppointmentDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAppointment">
          确认预约
        </el-button>
      </template>
    </el-dialog>

    <!-- 修改预约弹窗 -->
    <el-dialog 
      v-model="showUpdateDialog" 
      title="🖊️ 修改预约"
      width="500px"
      center
    >
      <el-form :model="updateForm" label-width="80px">
        <el-form-item label="新时间">
          <el-date-picker
            v-model="updateForm.appointmentTime"
            type="datetime"
            placeholder="选择新的预约时间"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showUpdateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateAppointment">
          确认修改
        </el-button>
      </template>
    </el-dialog>

    <!-- 取消预约弹窗 -->
    <el-dialog 
      v-model="showCancelDialog" 
      title="❌ 确认取消"
      width="500px"
      center
    >
      <div>你确定要取消这个预约吗？</div>
      <template #footer>
        <el-button @click="showCancelDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCancelAppointment">
          确认取消
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.appointment-container {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.desc {
  color: #606266;
  font-size: 0.9rem;
}

.doctor-list {
  max-width: 1200px;
  margin: 0 auto;
}

.doctor-row {
  display: flex;
  /* justify-content: center; */
  max-width: 1400px;  /* 控制最大宽度 */
  /* margin: 0 auto;     水平居中 */
}

.doctor-card {
  margin-bottom: 1.5rem;
  border-radius: 12px;
  transition: transform 0.3s ease;
  /* width: 100%;        卡片占满列宽 */
  /* max-width: 380px;   控制卡片最大宽度 */
}

.doctor-card:hover {
  transform: translateY(-5px);
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.doctor-avatar {
  margin-bottom: 1rem;
}

.doctor-info {
  text-align: left;
  margin-bottom: 1.5rem;
  width: 100%; /* 使内容宽度填充父容器 */
}

.doctor-name {
  font-size: 1.2rem;
  color: #070707;
  /* margin-bottom: 0.8rem; */
  font-weight: bold;
}

.info-item {
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
  color: #606266;
  font-size: 0.9rem;
}

.info-item i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.doctor-actions {
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem;
}

.btn-text {
  font-size: 1rem;
  /* flex: 1; 使文字填充按钮空间 */
  /* text-align: center; 文字居中 */
  margin-right: 10px;
}

.el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}

.el-dialog__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

@media (max-width: 700px) {
  .appointment-container {
    padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
  }
  
  .doctor-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
  }
}
</style>