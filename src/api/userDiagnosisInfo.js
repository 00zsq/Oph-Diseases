import request from '@/utils/request'

// 全部诊断记录
export const getFetchDiagnosisRecords = (page, pageSize, token) => {
  return request.get(`/dsod/manage/page/history?name=&sex&idCard&page=${page}&pageSize=${pageSize}`, {
    headers: {
      'authentication': token
    }
  })
}

// 通过诊断记录id查询患者信息
export const getFetchPatientInfoByRecordId = (recordId, token) => {
  return request.get(`/dsod/manage/selectbyrecordid?id=${recordId}`, {
    headers: {
      'authentication': token
    }
  })
}

// 置信度查询
export const fetchDiagnosisConfidence = (recordId, token) => {
  return request.get(`/dsod/manage/selectconfidence?id=${recordId}`, {
    headers: {
      'authentication': token
    }
  })
}