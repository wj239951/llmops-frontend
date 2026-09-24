//Axio统一封装
import axios from 'axios'
export const request = axios.create({ baseURL: 'http://127.0.0.1:8000/api', timeout:
300000 })