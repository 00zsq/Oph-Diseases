import request from '@/utils/request'

// 患者预约
export const makeAppointment = (doctorId, appointmentTime, token) => {
  return request.post('/dsod/patients/appointment', {
    doctorId,
    appointmentTime
  }, {
    headers: {
      'token': token,
      'Content-Type': 'application/json'
    }
  })
}

// 患者修改预约
export const updateAppointment = (id, appointmentTime, status, token) => {
  return request.post('/dsod/patients/updateAppointment', {
    id,
    appointmentTime,
    status
  }, {
    headers: {
      'token': token,
      'Content-Type': 'application/json'
    }
  })
}

// 退出
export const logout = (token) => {
  return request.get('/dsod/patients/logout', {
    headers: {
      'token': token
    }
  })
}

// 更新患者密码
export const updatePatientInfo = (username, password, token) => {
  return request.post('/dsod/patients/update', {
    username,
    password
  }, {
    headers: {
      'token': token,
      'Content-Type': 'application/json'
    }
  })
}

// 绑定患者信息
export const bindPatientInfo = (name, idCard, age, sex, token) => {
  return request.post('/dsod/patients/bind', {
    name,
    idCard,
    age,
    sex
  }, {
    headers: {
      'token': token,
      'Content-Type': 'application/json'
    }
  })
}

// 获取医生信息
export const getDoctorInfo = (token) => {
  return request.get('/dsod/patients/doctorinfo', {
    headers: {
      'token': token
    }
  })
}

// 获取预约列表
export const getFetchAppointments = (token) => {
  return request.get('/dsod/patients/appointmentList', {
    headers: {
      'token': token
    }
  })
}

// 获取报告列表
export const getFetchReports = (token) => {
  return request.get('/dsod/patients/report', {
    headers: {
      'token': token
    }
  })
}

// 下载报告
export const downloadReport = (reportId, format, token) => {
  return request.get(`/dsod/patients/download/${reportId}?format=${format}`, {
    headers: {
      'token': token
    },
    responseType: 'blob'
  })
}