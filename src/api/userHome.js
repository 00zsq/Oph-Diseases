import request from '@/utils/request'

// 诊断记录病
export const fetchPatientAndDiseaseData = (token) => {
  return request.get('/dsod/statistics/patientAndDisease', {
    headers: {
      'authentication': token
    }
  })
}

// 用户分类
export const fetchUserAndRoleData = (token) => {
  return request.get('/dsod/statistics/userAndRole', {
    headers: {
      'authentication': token
    }
  })
}

// 诊断记录数目
export const fetchDiagnosisRecordData = (token) => {
  return request.get('/dsod/statistics/diagnosisRecord', {
    headers: {
      'authentication': token
    }
  })
}

// 操作日志数目
export const fetchOperateLogData = (token) => {
  return request.get('/dsod/statistics/operateLog', {
    headers: {
      'authentication': token
    }
  })
}