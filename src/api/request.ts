// Axios 统一封装
import axios, { type AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// baseURL 走环境变量：开发读 .env.development(本机后端)，生产读 .env.production(/api 交 nginx 反代)
export const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 120000,
})

// 请求拦截器：统一带 token（为将来加鉴权预留）
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器：统一拆 .data + 统一错误处理
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 用户主动取消（AbortController）不是错误，静默返回，交给调用方处理
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }
    const detail = error.response?.data?.detail || error.message || '请求失败'
    ElMessage.error(detail)
    return Promise.reject(error)
  },
)

// 泛型封装：拦截器已把 AxiosResponse 拆成裸数据，这里把返回类型也对齐成 T
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request.get<T, T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request.post<T, T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request.put<T, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request.delete<T, T>(url, config),
}
