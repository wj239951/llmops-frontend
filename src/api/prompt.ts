//prompt接口封装
import { request } from './request'
export function listPrompts() { return request.get('/prompts') }
export function createPrompt(data: any) { return request.post('/prompts', data) }
export function updatePrompt(id: number, data: any) { 
    return request.put(`/prompts/${id}`, data) }
export function deletePrompt(id: number) { return request.delete(`/prompts/${id}`) }
