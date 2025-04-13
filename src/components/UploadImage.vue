<script setup>
import { ref } from 'vue'
import { useImageStore } from '@/stores/imageStore'
import { defineEmits } from 'vue'
import { ElMessage } from 'element-plus'

const store = useImageStore()
const selectedFiles = ref([])
const emit = defineEmits(['upload-success'])

const handleFileChange = (file, fileList) => {
  selectedFiles.value = fileList.map(f => ({
    name: f.name,
    status: f.status,
    url: URL.createObjectURL(f.raw),
    raw: f.raw
  }))
}

const handleRemove = (file, fileList) => {
  selectedFiles.value = fileList
}

// const handlePreview = (file) => {
  // console.log('Preview:', file)
// }

const beforeUpload = (file) => {
  const isLt1M = file.size / 1024 / 1024 < 1
  if (!isLt1M) {
    ElMessage({
      message: '上传图片大小不能超过 1MB!',
      type: 'error'
    })
  }
  return isLt1M
}

const handleUpload = async () => {
  if (selectedFiles.value.length === 0) {
    ElMessage({
      message: '请先上传图片',
      type: 'error'
    })
    return
  }

  const leftImages = []
  const rightImages = []

  selectedFiles.value.forEach((file, index) => {
    if (index % 2 === 0) {
      leftImages.push(file.raw)
    } else {
      rightImages.push(file.raw)
    }
  })

  if (leftImages.length === 0 || rightImages.length === 0) {
    ElMessage({
      message: '请至少上传一张左眼和一张右眼的图片',
      type: 'error'
    })
    return
  }

  try {
    await store.guestAnalyze(leftImages, rightImages)
    ElMessage({
      message: '图片上传成功',
      type: 'success'
    })  
    selectedFiles.value = []
    emit('upload-success')
  } catch (error) {
    ElMessage({
      message: '图片上传失败' + (error.response?.data?.message || error.message),
      type: 'error'
    })
    selectedFiles.value = selectedFiles.value.map(f => ({
      ...f,
      status: 'fail'
    }))
  }
}
</script>

<template>
  <div class="medical-upload-container">
    <div class="upload-card">
      <div class="upload-header">
        <h3>眼底影像分析</h3>
        <el-tag type="success">AI辅助诊断系统</el-tag>
      </div>
      
      <el-upload
        action="#"
        :auto-upload="false"
        list-type="picture-card"
        :on-change="handleFileChange"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :file-list="selectedFiles"
        :limit="4"
        multiple
        class="medical-upload"
      >
        <i class="el-icon-plus medical-upload-add"></i>
        <template #tip>
          <div class="upload-tips">
            <el-icon><info-filled /></el-icon>
            请上传清晰的眼底照片（支持JPG/PNG格式，单张≤1MB）
          </div>
        </template>
      </el-upload>

      <!-- 图片预览 -->
      <div class="image-grid">
        <div 
          v-for="(file, index) in selectedFiles" 
          :key="file.name"
          class="image-card"
          :class="{'highlight-left': index%2===0, 'highlight-right': index%2===1}"
        >
          <div class="eye-tag">{{ index%2 === 0 ? '左眼' : '右眼' }}</div>
          <img :src="file.url" class="preview-image" />
          <div class="image-footer">
            <span class="file-name">{{ file.name }}</span>
            <el-icon v-if="file.status === 'fail'" class="error-icon">
              <circle-close-filled />
            </el-icon>
          </div>
        </div>
      </div>

      <el-button 
        type="primary" 
        class="analysis-btn"
        @click="handleUpload"
        :disabled="selectedFiles.length === 0"
      >
        <el-icon><upload-filled /></el-icon>
        开始AI分析
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.medical-upload-container {
  padding: 24px;
  background: #f5f7fb;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.upload-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 48px); /* 适应浏览器窗口高度 */
  overflow: auto;
}

.upload-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 16px;
}

.upload-header h3 {
  margin: 0;
  color: #1a2d6d;
  font-size: 20px;
}

.medical-upload :deep(.el-upload) {
  border: 2px dashed #409EFF;
  border-radius: 8px;
  transition: all 0.3s;
}

.medical-upload :deep(.el-upload:hover) {
  border-color: #1a2d6d;
  transform: translateY(-2px);
}

.medical-upload-add {
  font-size: 28px;
  color: #409EFF;
}

.upload-tips {
  color: #909399;
  font-size: 14px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 24px;
  margin: 24px 0;
}

.image-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.image-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.highlight-left {
  border-left: 4px solid #409EFF;
}

.highlight-right {
  border-left: 4px solid #67C23A;
}

.eye-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(64, 158, 255, 0.9);
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1;
}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  background: #f8f9fa;
}

.image-footer {
  padding: 12px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.file-name {
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.error-icon {
  color: #f56c6c;
  margin-left: 8px;
}

.analysis-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  letter-spacing: 1px;
}
</style>