//知识库接口封装
import { request } from './request'
export function listKnowledge() { return request.get('/knowledge') }
export function createKnowledge(data: any) { return request.post('/knowledge', data) }
export function updateKnowledge(id: number, form: { title?: string; content?: string; source?: string }) { return request.put(`/knowledge/${id}`, form) }
export function deleteKnowledge(id: number) { return request.delete(`/knowledge/${id}`) }