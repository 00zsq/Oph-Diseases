import request from '@/utils/request'

// 修改个人信息
export const updateUserSelfInfo = (username, password, email, token) => {
  return request.post('/dsod/users/update/self', {
    username,
    password,
    email
  }, {
    headers: {
      'authentication': token,
      'Content-Type': 'application/json'
    }
  })
}

// 提交反馈
export const sendUserFeedback = (content, token) => {
  return request.post('/dsod/users/feedback', {
    content
  }, {
    headers: {
      'authentication': token,
      'Content-Type': 'application/json'
    }
  })
}