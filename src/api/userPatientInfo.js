import request from '@/utils/request'

// 获取患者列表
export const getFetchPatients = (page, pageSize, token) => {
  return request.get(`/dsod/manage/page/allpatientlist?name&idCard&sex=&lage=&rage=&page=${page}&pageSize=${pageSize}`, {
    headers: {
      'authentication': token
    }
  })
}

// 通过id查询诊断记录
export const getPatientRecords = (patientId, token) => {
  return request.get(`/dsod/manage/page/record?id=${patientId}`, {
    headers: {
      'authentication': token
    }
  })
}

// 医生预约管理
export const getAppointments = (token) => {
  return request.get('/dsod/manage/appointment', {
    headers: {
      authentication: token
    }
  })
}

// 确认预约
export const doctorConfirmAppointment = (appointmentId, token) => {
  return request.get(`/dsod/manage/confirmappointment?id=${appointmentId}`, {
    headers: { authentication: token }
  })
}