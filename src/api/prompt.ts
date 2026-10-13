//prompt接口封装
import { http } from './request'
import type { Prompt, PromptPayload } from '../types'

export function listPrompts() {
  return http.get<Prompt[]>('/prompts')
}

export function createPrompt(data: PromptPayload) {
  return http.post<Prompt>('/prompts', data)
}

export function updatePrompt(id: number, data: PromptPayload) {
  return http.put<Prompt>(`/prompts/${id}`, data)
}

export function deletePrompt(id: number) {
  return http.delete<{ success: boolean }>(`/prompts/${id}`)
}
