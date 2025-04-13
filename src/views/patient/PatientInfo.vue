<script setup>
import { ref } from 'vue'
import { updatePatientInfo, bindPatientInfo } from '@/api/patient'
import { usePatientDiagnosisStore } from '@/stores/patientDiagnosisStore'
import { ElMessage } from 'element-plus'

// 获取患者数据
const patientDiagnosisStore = usePatientDiagnosisStore()
const patientData = patientDiagnosisStore.getPatientData()

// 表单数据
const updateForm = ref({
  username: patientData ? patientData.username : '',
  password: ''
})

const bindForm = ref({
  idCard: '',
  age: '',
  sex: ''
})

// 正则表达式
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
const usernamePattern = /^[a-zA-Z0-9_]{4,16}$/
const idCardPattern = /^\d{15}|\d{18}$/

// 更新患者信息
const handleUpdate = async () => {
  if (!usernamePattern.test(updateForm.value.username)) {
    ElMessage({
      message: '用户名格式不正确，必须是4到16个字符，只能包含字母、数字和下划线',
      type: 'warning'
    })
    return
  }
  if (!passwordPattern.test(updateForm.value.password)) {
    ElMessage({
      message: '密码格式不正确，必须至少8个字符，包含一个数字、一个大写字母、一个小写字母和一个特殊字符',
      type: 'warning'
    })
    return
  }
  try {
    const response = await updatePatientInfo(updateForm.value.username, updateForm.value.password, patientData.token)
    if (response.data.code === 1) {
      ElMessage({
        message: '患者信息更新成功',
        type: 'success'
      })
      // 更新本地存储的患者数据
      patientDiagnosisStore.setPatientData(updateForm.value.username)
    } else {
      ElMessage({
        message: response.data.msg || '更新失败',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '更新失败',
      type: 'error'
    })
  }
}

// 绑定患者信息
const handleBind = async () => {
  if (!idCardPattern.test(bindForm.value.idCard)) {
    ElMessage({
      message: '身份证号格式不正确',
      type: 'warning'
    })
    return
  }
  try {
    const response = await bindPatientInfo(updateForm.value.username, bindForm.value.idCard,
      bindForm.value.age, bindForm.value.sex, patientData.token)
    if (response.data.code === 1) {
      ElMessage({
        message: '患者信息绑定成功',
        type: 'success'
      })
    } else {
      ElMessage({
        message: response.data.msg || '绑定失败',
        type: 'warning'
      })
    }
  } catch (error) {
    ElMessage({
      message: error.message || '绑定失败',
      type: 'error'
    })
  }
}
</script>

<template>
  <div class="patient-info-container">
    <!-- 更新信息表单 -->
    <el-card shadow="hover" class="form-card">
      <h2 class="section-title">患者信息更新</h2>
      <el-form :model="updateForm" label-position="top" class="responsive-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="updateForm.username" 
                placeholder="4-16位字母/数字/下划线"
                prefix-icon="el-icon-user"
                clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="updateForm.password"
                type="password"
                placeholder="至少8位含大小写字母+数字+特殊字符"
                prefix-icon="el-icon-lock"
                show-password>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button 
          type="primary" 
          class="submit-btn"
          @click="handleUpdate">
          <i class="el-icon-upload"></i> 更新信息
        </el-button>
      </el-form>
    </el-card>

    <!-- 绑定信息表单 -->
    <el-card shadow="hover" class="form-card">
      <h2 class="section-title">患者信息绑定</h2>
      <el-form :model="bindForm" label-position="top" class="responsive-form">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="身份证号">
              <el-input
                v-model="bindForm.idCard"
                placeholder="请输入18位身份证号"
                prefix-icon="el-icon-postcard">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="年龄">
              <el-input-number 
                v-model="bindForm.age"
                :min="0" 
                :max="120"
                controls-position="right">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="性别">
              <el-select 
                v-model="bindForm.sex" 
                placeholder="请选择"
                popper-class="gender-select">
                <el-option label="男" value="男">
                  <i class="el-icon-male"></i> 男
                </el-option>
                <el-option label="女" value="女">
                  <i class="el-icon-female"></i> 女
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button 
          type="success" 
          class="submit-btn"
          @click="handleBind">
          <i class="el-icon-connection"></i> 立即绑定
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.patient-info-container {
  max-width: 1200px;
  margin: 20px auto;
  /* padding: 20px; */
}

.form-card {
  margin-bottom: 30px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.section-title {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 25px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.responsive-form {
  padding: 20px;
}

::v-deep .el-form-item__label {
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

::v-deep .el-input__inner {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

::v-deep .el-input__inner:focus {
  border-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409EFF, #3375b9);
  transition: all 0.3s ease;
}

.gender-select {
  .el-icon-male { color: #409EFF; margin-right: 8px; }
  .el-icon-female { color: #f56c6c; margin-right: 8px; }
}

@media (max-width: 768px) {
  .patient-info-container {
    padding: 10px;
  }
  
  .form-card {
    margin-bottom: 20px;
  }
  
  ::v-deep .el-form-item__label {
    font-size: 14px;
  }
}
</style>