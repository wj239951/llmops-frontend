//知识库接口封装
import { request } from './request'
export function listKnowledge() { return request.get('/knowledge') }
export function createKnowledge(data: any) { return request.post('/knowledge', data) }