import axios from 'axios'

const pendingRequests = new Map()

const instance = axios.create({
  baseURL: '',
  timeout: 1000000,
  headers: {},
})

instance.interceptors.request.use(
  (config) => {
    addPendingRequest(config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

instance.interceptors.response.use(
  (response) => {
    removePendingRequest(response.config)
    return response
  },
  (error) => {
    removePendingRequest(error.config || {})
    return Promise.reject(error)
  },
)

// 生成请求key
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

// 添加请求到pending
const addPendingRequest = (config) => {
  const requestKey = generateRequestKey(config)
  if (pendingRequests.has(requestKey)) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancel('请勿重复请求')
    })
  } else {
    pendingRequests.set(requestKey, true)
  }
}

// 移除pending中的请求
const removePendingRequest = (config) => {
  const requestKey = generateRequestKey(config)
  pendingRequests.delete(requestKey)
}

export default instance
