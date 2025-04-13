<script setup>
import { computed } from 'vue'
import { useImageStore } from '@/stores/imageStore'

const imageStore = useImageStore()

const processedImages = computed(() => imageStore.processedImages)
</script>

<template>
  <div class="image-list">
    <el-row :gutter="20">
      <el-col 
        v-for="(image, index) in processedImages" 
        :key="'processed-' + index"
        :span="6"
        class="image-item"
      >
        <el-card>
          <!-- 拼接后的图片容器 -->
          <div class="merged-container">
            <img 
              :src="image.processedImgPaths[0]" 
              alt="左眼图片" 
              class="merged-image" 
            />
            <img 
              :src="image.processedImgPaths[1]" 
              alt="右眼图片" 
              class="merged-image" 
            />
          </div>
          
          <div class="image-info">
            <div class="image-name">左眼疾病: {{ image.leftDiseaseResult.join(', ') }}</div>
            <div class="confidence">置信度: {{ image.leftConfidence.map(c => c.toFixed(2) + '%').join(', ') }}</div>
          </div>
          
          <div class="image-info">
            <div class="image-name">右眼疾病: {{ image.rightDiseaseResult.join(', ') }}</div>
            <div class="confidence">置信度: {{ image.rightConfidence.map(c => c.toFixed(2) + '%').join(', ') }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* 拼接容器样式 */
.merged-container {
  width: 100%;
  height: 200px; /* 总高度为单张图片高度 */
  display: flex;
  flex-direction: row; /* 横向排列 */
}

/* 单张图片样式 */
.merged-image {
  width: 50%; /* 每张图片占容器的一半宽度 */
  height: 100%; /* 高度占满容器 */
  object-fit: contain; /* 保持图片比例 */
}

.image-item {
  margin-bottom: 20px;
}

.image-info {
  margin-top: 12px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>