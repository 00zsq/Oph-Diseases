import request from '@/utils/request'

// 上传图片
export const guestAnalyze = (formData) => {
  return request.post('/dsod/guest/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}