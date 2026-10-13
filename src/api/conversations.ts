//会话管理接口封装
import { http } from './request'
import type { ChatMessage, Conversation } from '../types'

export function listConversations() {
  return http.get<Conversation[]>('/conversations')
}

export function createConversation() {
  return http.post<Conversation>('/conversations')
}

export function getMessages(conversationId: string) {
  return http.get<ChatMessage[]>(`/conversations/${conversationId}/messages`)
}

export function deleteConversation(conversationId: string) {
  return http.delete<{ deleted: string }>(`/conversations/${conversationId}`)
}
