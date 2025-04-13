import request from '@/utils/request'

// 上传分析
export const analyzeDiagnosis = (formData, token) => {
  return request.post('/dsod/diagnosis/analyze', formData, {
    headers: {
      'authentication': token,
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 生成报告
export const generateCurReport = (recordId, language, token) => {
  return request.post(`/dsod/reports/generate?recordId=${recordId}&language=${language}`, {}, {
    headers: {
      'authentication': token
    }
  })
}

// 下载报告
export const downloadOneReport = (reportId, format, token) => {
  return request.get(`/dsod/reports/download/${reportId}?format=${format}`, {
    headers: {
      'authentication': token,
    },
    responseType: 'blob' // 设置响应类型为 blob
  })
}