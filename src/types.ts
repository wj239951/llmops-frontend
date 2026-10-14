// 与后端 Pydantic schema 对齐的前端类型定义。
// 后端序列化后日期字段是 ISO 字符串，这里统一用 string。

/** Prompt 模板（对应 PromptOut） */
export interface Prompt {
  id: number
  name: string
  description: string | null
  system_prompt: string
  model_provider: string
  model_name: string | null
  temperature: number
  top_p: number
  enabled: boolean
  created_at: string
  updated_at: string
}

/** 新建/修改 Prompt 的入参（对应 PromptCreate / PromptUpdate） */
export interface PromptPayload {
  name?: string
  description?: string | null
  system_prompt?: string
  model_provider?: string
  model_name?: string | null
  temperature?: number
  top_p?: number
  enabled?: boolean
}

/** 知识库文档（对应 KnowledgeOut） */
export interface KnowledgeDocument {
  id: number
  title: string
  content: string
  source: string | null
  created_at: string
}

/** 新建/修改知识库文档的入参（对应 KnowledgeCreate / KnowledgeUpdate） */
export interface KnowledgePayload {
  title?: string
  content?: string
  source?: string | null
}

/** 聊天请求（对应 ChatRequest） */
export interface ChatRequestPayload {
  query: string
  prompt_id?: number | null
  system_prompt?: string | null
  model_provider?: string | null
  model_name?: string | null
  temperature?: number
  top_p?: number
  use_rag?: boolean
  conversation_id?: string | null
  memory_enabled?: boolean
}

/** 引用来源（RAG 命中片段） */
export interface Source {
  title: string
  snippet: string
  source: string | null
  score?: number
}

/** 聊天返回（对应 ChatResponse） */
export interface ChatResponse {
  answer: string
  reasoning: string | null
  thought: string
  model_provider: string
  model_name: string
  total_tokens: number
  latency_ms: number
  conversation_id: string | null
  rag_status: 'off' | 'no_hit' | 'hit'
  sources: Source[]
}

/** 会话（对应 Conversation） */
export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

/** 会话内的一条消息（getMessages 返回项） */
export interface ChatMessage {
  user_input: string
  assistant_output: string
  model_provider: string
  model_name: string
  created_at: string
}

/** 运行日志条目（logs 接口返回项） */
export interface ChatLog {
  id: number
  user_input: string
  assistant_output: string
  model_provider: string
  model_name: string
  prompt_name: string | null
  total_tokens: number
  latency_ms: number
  status: string
  error_message: string | null
  created_at: string
}

/** 运行日志分页返回 */
export interface LogListResponse {
  items: ChatLog[]
  total: number
  page: number
  page_size: number
}

/** 运行日志查询参数 */
export interface LogQueryParams {
  page?: number
  page_size?: number
  status?: string
}
