import axios from 'axios'

const pendingRequests = {}

const instance = axios.create({
  baseURL: '',
  timeout: 1000000,
  headers: {}
})

instance.interceptors.request.use(
  config => {
    addPendingRequest(config)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    removePendingRequest(response.config)
    return response
  },
  error => {
    removePendingRequest(error.config || {})
    return Promise.reject(error)
  }
)

// 生成请求key
const generateRequestKey = (config) => {
  const { method, url, params, data } = config
  return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`
}

// 添加请求到pending
const addPendingRequest = (config) => {
  const requestKey = generateRequestKey(config)
  if (pendingRequests[requestKey]) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      cancel('请勿重复请求')
    })
  } else {
    pendingRequests[requestKey] = true
  }
}

// 移除pending中的请求
const removePendingRequest = (config) => {
  const requestKey = generateRequestKey(config)
  delete pendingRequests[requestKey]
}

export default instance