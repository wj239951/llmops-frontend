//聊天接口封装
import { http } from './request'
import type { ChatRequestPayload, ChatResponse } from '../types'

export function sendChat(data: ChatRequestPayload, signal?: AbortSignal) {
  return http.post<ChatResponse>('/chat', data, { signal })
}
