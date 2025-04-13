import request from '@/utils/request'

// 退出
export const logout = (token) => {
  return request.post('/dsod/users/logout', {}, {
    headers: {
      'authentication': token
    }
  })
}

// 反馈
export const getFetchFeedbacks = (page, pageSize, token) => {
  return request.get(`/dsod/manage/feedback`, {
    params: {
      page,
      pageSize
    },
    headers: {
      'authentication': token
    }
  })
}

// 用户列表
export const getFetchUsers = (page, pageSize, token) => {
  return request.get(`/dsod/manage/page/alluserlist`, {
    params: {
      username: '',
      role: '',
      page,
      pageSize
    },
    headers: {
      'authentication': token
    }
  })
}

// 通过id查询用户
export const getFetchUserById = (id, token) => {
  return request.get(`/dsod/manage/select/id`, {
    params: { id },
    headers: {
      'authentication': token
    }
  })
}

// AOP日志
export const getFetchLogs = (params, token) => {
  return request.get(`/dsod/manage/operateLog`, {
    params,
    headers: {
      'authentication': token
    }
  })
}

// 角色列表
export const getFetchRoles = (token) => {
  return request.get(`/dsod/manage/role`, {
    headers: {
      'authentication': token
    }
  })
}

// 修改用户信息
export const postUpdateUser = (user, token) => {
  return request.post(`/dsod/users/update/admin`, user, {
    headers: {
      'authentication': token,
      'Content-Type': 'application/json'
    }
  })
}