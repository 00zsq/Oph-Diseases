<script setup>
import { ref } from 'vue'
import { analyzeDiagnosis } from '@/api/userDiagnosis'
import caseChart from '@/components/CaseChart.vue'
import ImageList from '@/components/ImageList.vue'
import { useUserStore } from '@/stores/userStore'
import { useImageStore } from '@/stores/imageStore'
import { usePatientStore } from '@/stores/patientStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const userData = userStore.getUserData()

const imageStore = useImageStore()
const patientStore = usePatientStore()

// 患者信息模板
const createPatient = () => ({
  name: '',
  idCard: '',
  age: '',
  sex: '男',
  leftEye: null,
  rightEye: null
})

const patients = ref([createPatient()])
// 渲染
const chartData = ref([])
const imageData = ref([])

const previewImage = (file) => {
  return URL.createObjectURL(file)
}

// 文件上传处理
const handleEyeImage = (index, side, file) => {
  patients.value[index][`${side}Eye`] = file
}

// 提交验证逻辑
const validateSubmission = () => {
  const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/ // 18位身份证号正则表达式
  return patients.value.every((patient, index) => {
    const valid = Object.values(patient).every(v => {
      if (v === null) return false
      return typeof v === 'object' ? !!v.name : !!v
    })
    
    if (!valid) {
      ElMessage({
        message: `第 ${index + 1} 位患者信息不完整`,
        type: 'warning'
      })
      return false
    }

    if (!idCardRegex.test(patient.idCard)) {
      ElMessage({
        message: `第 ${index + 1} 位患者的身份证号无效`,
        type: 'warning'
      })
      return false
    }

    return true
  })
}

// 提交数据处理
const handleUpload = async () => {
  if (!validateSubmission()) return

  const formData = new FormData()
  const patientData = patients.value.map(p => ({
    name: p.name,
    idCard: p.idCard,
    age: p.age,
    sex: p.sex
  }))

  formData.append('patients', new Blob([JSON.stringify(patientData)], {
    type: 'application/json' // 关键修复点
  }), 'patients.json')

  patients.value.forEach((patient) => {
    formData.append(`leftImage`, patient.leftEye)
    formData.append(`rightImage`, patient.rightEye)
  })

  try {
    const res = await analyzeDiagnosis(formData, userData.token)
    if (res.data.code === 1) {
      ElMessage({
        message: '分析请求已提交',
        type: 'success'
      })
      const recordIds = res.data.data.map(item => item.recordId)
      const patientIds = res.data.data.map(item => item.patientId)
      // 将患者信息和返回的 recordId 和 patientId 存储到 patientStore 中
      patients.value.forEach((patient, index) => {
        const existingPatient = patientStore.findPatientByIdCard(patient.idCard)
        if (existingPatient) {
          // 更新已有患者的 recordId
          patientStore.updatePatient(existingPatient.patientId, recordIds[index])
        } else {
          // 添加新患者
          patientStore.addPatient({
            ...patient,
            recordId: recordIds[index],
            patientId: patientIds[index],
            reportId: null,
            reportGenerated: false
          })
        }
      })

      // 获取所有上传的左眼和右眼图片
      const leftImages = patients.value.map(patient => patient.leftEye)
      const rightImages = patients.value.map(patient => patient.rightEye)
      // 游客接口获取图片渲染
      const analyzeRes = await imageStore.guestAnalyze(leftImages, rightImages)
      if (analyzeRes.code === 1) {
        chartData.value = imageStore.cases
        imageData.value = imageStore.cases.map(c => ({
          leftImage: c.leftImage,
          rightImage: c.rightImage,
          disease_result: c.disease_result,
          confidence: c.confidence
        }))
      } else {
        ElMessage({
          message: analyzeRes.msg || '图片获取分析数据失败，请检查网络连接',
          type: 'warning'
        })
      }

      // 清除数据恢复默认
      patients.value = [createPatient()]
    } else {
      ElMessage({
        message: res.data.msg || '提交失败，请检查网络连接',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: '提交失败，请检查网络连接' + error.response?.data?.msg,
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="diagnosis-container">
    <el-card class="upload-card">
      <template #header>
        <div class="card-header">
          <h3>智能眼底分析</h3>
          <el-button 
            type="primary" 
            size="small"
            @click="patients.push(createPatient())">
            添加患者
          </el-button>
        </div>
      </template>

      <div v-for="(patient, index) in patients" :key="index" class="patient-card">
        <div class="patient-info">
          <el-input v-model="patient.name" placeholder="姓名" />
          <el-input v-model="patient.idCard" placeholder="身份证号" />
          <el-input-number v-model="patient.age" :min="0" :max="120" />
          <el-select v-model="patient.sex">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
          </el-select>
          <el-button 
            v-if="patients.length > 1"
            type="danger"
            @click="patients.splice(index, 1)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>

        <div class="eye-upload">
          <div class="upload-item">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(file) => handleEyeImage(index, 'left', file.raw)">
              <template #trigger>
                <el-button type="primary">上传左眼图像</el-button>
              </template>
            </el-upload>
            <img 
              v-if="patient.leftEye"
              :src="previewImage(patient.leftEye)"
              class="eye-preview" />
          </div>

          <div class="upload-item">
            <el-upload
              :auto-upload="false"
              :show-file-list="false"
              :on-change="(file) => handleEyeImage(index, 'right', file.raw)">
              <template #trigger>
                <el-button type="primary">上传右眼图像</el-button>
              </template>
            </el-upload>
            <img 
              v-if="patient.rightEye"
              :src="previewImage(patient.rightEye)"
              class="eye-preview" />
          </div>
        </div>
      </div>

      <el-button 
        type="success" 
        size="large"
        class="submit-btn"
        @click="handleUpload">
        开始智能分析
      </el-button>
    </el-card>

    <caseChart v-if="chartData.length" :data="chartData" />
    <ImageList v-if="imageData.length" :images="imageData" />
  </div>
</template>

<style scoped>
.diagnosis-container {
  background: #f0f2f5;
  margin-top: 20px;
}

.upload-card {
  width: 100%;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

.patient-card {
  margin: 16px 0;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.patient-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.eye-upload {
  display: flex;
  gap: 24px;
  margin-top: 12px;
}

.upload-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.eye-preview {
  width: 80px;
  height: 80px;
  border: 1px solid #ddd;
  display: block;
}

.eye-preview:hover {
  transform: scale(1.05);
  cursor: pointer;
}

.upload-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.eye-upload {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .eye-preview {
    width: 60px;
    height: 60px;
  }
}

.el-icon {
  margin-right: 5px;
}

.el-button--danger {
  padding: 8px 12px;
}
</style>