//知识库接口封装
import { http } from './request'
import type { KnowledgeDocument, KnowledgePayload } from '../types'

export function listKnowledge() {
  return http.get<KnowledgeDocument[]>('/knowledge')
}

export function createKnowledge(data: KnowledgePayload) {
  return http.post<KnowledgeDocument>('/knowledge', data)
}

export function updateKnowledge(id: number, form: KnowledgePayload) {
  return http.put<KnowledgeDocument>(`/knowledge/${id}`, form)
}

export function deleteKnowledge(id: number) {
  return http.delete<{ message: string }>(`/knowledge/${id}`)
}

export function uploadKnowledge(file: File, title?: string) {
  const formData = new FormData()
  formData.append('file', file)
  if (title) formData.append('title', title)
  return http.post<KnowledgeDocument>('/knowledge/upload', formData)
}
