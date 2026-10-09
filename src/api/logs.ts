//运行日志接口封装
//查看日志
//分页查询
//状态过滤
import { request } from './request'
export function listLogs(params?: { page?: number; page_size?: number; status?: string }) {
  return request.get('/logs', { params })
}