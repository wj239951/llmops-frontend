//会话管理接口封装
import { request } from './request'

export function listConversations() { return request.get('/conversations') }

export function createConversation() { return request.post('/conversations') }

export function getMessages(conversationId: string) {
  return request.get(`/conversations/${conversationId}/messages`)
}

export function deleteConversation(conversationId: string) {
  return request.delete(`/conversations/${conversationId}`)
}
