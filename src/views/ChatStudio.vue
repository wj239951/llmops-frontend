平台核心页面


模型选择
Prompt选择
RAG开关
用户输入(将用户输入与历史会话一同喂给模型)
思考过程展示
最终回答展示
Token统计
耗时统计
<template>
  <div>
    <h1>Chat Studio</h1>

    <div class="card">
      <el-alert
        title="默认走本地 Ollama + deepseek-r1:7b；选择 DeepSeek 时走 DeepSeek 云端 API。"
        type="info"
        show-icon
      />
      <el-form label-width="140px" style="margin-top: 18px">
        <el-form-item label="模型提供商">
          <el-select v-model="form.model_provider" style="width: 300px">
          <el-option label="本地 DeepSeek-R1:7b / Ollama" value="ollama" />
          <el-option label="DeepSeek 云端 API" value="deepseek" />
        </el-select>
        </el-form-item>

        <el-form-item label="模型名称">
          <el-select v-model="form.model_name" style="width: 300px">
            <el-option v-for="m in modelOptions" :key="m" :label="m" :value="m" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择 Prompt">
          <el-select v-model="form.prompt_id" clearable style="width: 360px">
            <el-option
              v-for="p in prompts"
              :key="p.id"
              :label="p.name"
              :value="p.id"
              />
            </el-select>
           </el-form-item>

           <el-form-item label="启用 RAG">
            <el-switch v-model="form.use_rag" />
           </el-form-item>
            <el-form-item label="会话历史">
              <el-select v-model="form.conversation_id" clearable style="width: 300px" @change="switchConversation">
                <el-option
                  v-for="c in conversations"
                  :key="c.id"
                  :label="c.title + '  (' + c.created_at.replace('T', ' ').slice(0, 16) + ')'"
                  :value="c.id"
                />
              </el-select>
              <el-button type="primary" plain size="small" style="margin-left: 10px" @click="newConversation">
                新建会话
              </el-button>
              <el-button type="danger" plain size="small" style="margin-left: 6px" @click="deleteCurrentConversation">
                删除会话
              </el-button>
            </el-form-item>
            <el-form-item label="启用记忆">
              <el-switch v-model="form.memory_enabled" />
            </el-form-item>
           <el-form-item label="用户输入">
            <el-input v-model="form.query" type="textarea" :rows="5" />
           </el-form-item>
          
        
           <el-button type="primary" :loading="loading" @click="submit">
            发送
           </el-button>
          </el-form>
         </div>
         <div class="card" v-if="messages.length">
            <h3>历史消息</h3>
            <div v-for="(msg, i) in messages" :key="i" class="message-item">
              <div class="message-user"><strong>用户：</strong>{{ msg.user_input }}</div>
              <div class="message-assistant"><strong>助手：</strong>{{ msg.assistant_output }}</div>
            </div>
         </div>
         <div class="card" v-if="reasoning">
            <h3>思考过程</h3>
            <el-input
              v-model="reasoning"
              type="textarea"
              :rows="10"
              readonly
              
              />
            </div>
            <div class="card" v-if="answer">
                <h3>最终回答</h3>
                <el-input
                v-model="answer"
                type="textarea"
                :rows="8"
                readonly
                />
                <el-alert
                :title="thought"
                type="info"
                style="margin-top: 10px;"
                />
                <el-alert
:title="meta"
type="success"
style="margin-top: 10px"
/>
<div v-if="sources.length" style="margin-top: 12px">
  <el-button text type="primary" size="small" @click="sourcesExpanded = !sourcesExpanded">
    {{ sourcesExpanded ? '收起' : '展开' }} {{ sources.length }} 个参考来源
  </el-button>
  <div v-show="sourcesExpanded" style="margin-top: 8px">
    <div v-for="(s, i) in sources" :key="i" class="source-item">
      <span class="source-title">{{ s.title || '来源 ' + (i + 1) }}</span>
      <a v-if="s.source" :href="s.source" target="_blank" class="source-link">{{ s.source }}</a>
      <p v-if="s.snippet" class="source-snippet">{{ s.snippet }}</p>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { sendChat } from '../api/chat'
import { listPrompts } from '../api/prompt'
import { listConversations, createConversation, getMessages, deleteConversation } from '../api/conversations'

const loading = ref(false)
const answer = ref('')
const reasoning = ref('')
const meta = ref('')
const thought = ref('')
const sources = ref<any[]>([])
const sourcesExpanded = ref(false)
const prompts = ref<any[]>([])
const conversations = ref<any[]>([])
const messages = ref<any[]>([])
const form = reactive({
  query: '请介绍一下你自己',
  prompt_id: undefined as number | undefined,
  model_provider: 'ollama',
  model_name: 'deepseek-r1:7b',
  use_rag: true,
  memory_enabled: true,
  conversation_id: ''
})
const modelOptions = computed(() =>
  form.model_provider === 'ollama'
    ? ['deepseek-r1:7b']
    : ['deepseek-chat', 'deepseek-v4-pro', 'deepseek-flash']
)
watch(
    () => form.model_provider,
    (value) => {
      form.model_name = value === 'ollama' ? 'deepseek-r1:7b' : 'deepseek-v4-pro'
    }
)
async function loadPrompts() {prompts.value = (await listPrompts()).data
}
async function loadConversations() {
  conversations.value = (await listConversations()).data
}
async function newConversation() {
  const res = await createConversation()
  const newConv = res.data
  conversations.value.unshift(newConv)
  form.conversation_id = newConv.id
  messages.value = []
  answer.value = ''
  reasoning.value = ''
  thought.value = ''
  meta.value = ''
  sources.value = []
}
async function switchConversation() {
  if (!form.conversation_id) {
    messages.value = []
    return
  }
  try {
    const res = await getMessages(form.conversation_id)
    messages.value = res.data
  } catch (e: any) {
    messages.value = []
  }
}
async function deleteCurrentConversation() {
  if (!form.conversation_id) return
  await deleteConversation(form.conversation_id)
  form.conversation_id = ''
  messages.value = []
  answer.value = ''
  reasoning.value = ''
  thought.value = ''
  meta.value = ''
  sources.value = []
  await loadConversations()
}
async function submit() {
  loading.value = true
  answer.value = ''
  reasoning.value = ''
  thought.value = ''
  meta.value = ''
  sources.value = []
  sourcesExpanded.value = false

  try {
    const res = await sendChat(form)
    answer.value = res.data.answer
    reasoning.value = res.data.reasoning || ''
    thought.value = res.data.thought
    sources.value = res.data.sources || []
    meta.value = `${res.data.model_provider} / ${res.data.model_name} /
tokens=${res.data.total_tokens} / ${res.data.latency_ms}ms`
    await loadConversations()
    if (form.conversation_id) {
      await switchConversation()
    }
} catch (e: any) {
answer.value = '请求失败：' + (e.response?.data?.detail || e.message)
} finally {
loading.value = false
}
}
onMounted(() => { loadPrompts(); loadConversations() })
</script>

<style scoped>
.source-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}
.source-title {
  font-weight: 600;
  font-size: 14px;
}
.source-link {
  display: block;
  font-size: 12px;
  color: #409eff;
  word-break: break-all;
}
.source-snippet {
  font-size: 13px;
  color: #666;
  margin: 4px 0 0;
}
.message-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.message-user {
  margin-bottom: 6px;
  color: #333;
}
.message-assistant {
  color: #555;
  white-space: pre-wrap;
}
</style>