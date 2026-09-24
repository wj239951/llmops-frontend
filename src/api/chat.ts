//聊天接口封装
import { request } from './request'
export function sendChat(data: any) { return request.post('/chat', data) }