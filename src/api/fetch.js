import axios from 'axios'
import { ElMessage } from 'element-plus'
import _ from 'lodash'


const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
service.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use((response) => {
    const res = response.data
    return res
  }, (error) => {
    ElMessage.error(_.get(error, 'response.data.message') || error.message)
    return Promise.reject(error)
  }
)

export default service
