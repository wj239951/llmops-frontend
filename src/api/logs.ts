//运行日志接口封装：分页查询 + 状态过滤
import { http } from './request'
import type { LogListResponse, LogQueryParams } from '../types'

export function listLogs(params?: LogQueryParams) {
  return http.get<LogListResponse>('/logs', { params })
}
