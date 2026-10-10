//Axio统一封装
import axios from 'axios'
// baseURL 走环境变量：开发读 .env.development(本机后端)，生产读 .env.production(/api 交 nginx 反代)
export const request = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL, timeout:
300000 })