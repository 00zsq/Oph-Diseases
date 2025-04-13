import request from '@/utils/request'

// 患者登录
export const patientLogin = (username, password) => {
  const response = request.post('/dsod/patients/login', {
    username,
    password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}

// 患者注册
export const patientRegister = (username, password) => {
  const response = request.post('/dsod/patients/register', {
    username,
    password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}

// 用户登录
export const userLogin = (username, password) => {
  const response = request.post('/dsod/users/login', {
    username,
    password
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}

// 用户注册
export const userRegister = (username, password, role, email) => {
  const response = request.post('/dsod/users/register', {
    username,
    password,
    role,
    email
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}