import { defineStore } from 'pinia'
import { guestAnalyze } from '@/api/upImage'

export const useImageStore = defineStore('imageStore', {
  state: () => ({
    images: [],
    cases: [],
    processedImages: []
  }),
  actions: {
    async guestAnalyze(leftImages, rightImages) {
      try {
        const formData = new FormData()
        leftImages.forEach((image) => {
          formData.append('leftImage', image)
        })
        rightImages.forEach((image) => {
          formData.append('rightImage', image)
        })

        const response = await guestAnalyze(formData)

        // 添加调试日志
        // console.log('API响应数据:', response.data)

        // 安全处理响应数据
        this.processedImages = response.data.data.map(item => ({
          leftImage: item.leftImage,
          rightImage: item.rightImage,
          leftDiseaseResult: item.leftDiseaseResult,
          rightDiseaseResult: item.rightDiseaseResult,
          leftConfidence: item.leftConfidence,
          rightConfidence: item.rightConfidence,
          processedImgPaths: item.processedImgPaths
        }))

        // 处理病例数据
        const diseaseCounts = {}
        this.processedImages.forEach(image => {
          image.leftDiseaseResult.forEach(disease => {
            if (!diseaseCounts[disease]) {
              diseaseCounts[disease] = 0
            }
            diseaseCounts[disease] += 1
          })
          image.rightDiseaseResult.forEach(disease => {
            if (!diseaseCounts[disease]) {
              diseaseCounts[disease] = 0
            }
            diseaseCounts[disease] += 1
          })
        })

        this.cases = Object.keys(diseaseCounts).map(disease => ({
          disease,
          count: diseaseCounts[disease]
        }))

        return response.data
      } catch (error) {
        console.error('请求详情：', error.config)
        throw error
      }
    }
  }
})