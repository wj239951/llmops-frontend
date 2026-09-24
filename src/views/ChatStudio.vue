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
        title="默认走本地 Ollama + deepseek-r1:7b；选择 ChatGPT 时走 OpenAI API
Key。"
        type="info"
        show-icon
      />
      <el-form label-width="140px" style="margin-top: 18px">
        <el-form-item label="模型提供商">
          <el-select v-model="form.model_provider" style="width: 300px">
          <el-option label="本地 DeepSeek-R1:7b / Ollama" value="ollama" />
          <el-option label="ChatGPT / OpenAI Key" value="openai" />
        </el-select>
        </el-form-item>

        <el-form-item label="模型名称">
          <el-input v-model="form.model_name" style="width: 300px" />
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

           <el-form-item label="启用 RAG(检索增强索引)">
            <el-switch v-model="form.use_rag" />
           </el-form-item>
           <el-form-item label="开启会话记忆">
            <el-switch v-model="form.memory_enabled" />
           </el-form-item>
            <el-form-item label="聊天标识">
              <el-input v-model="form.conversation_id" style="width: 300px" />
           </el-form-item>
           <el-form-item label="用户输入">
            <el-input v-model="form.query" type="textarea" :rows="5" />
           </el-form-item>
          
        
           <el-button type="primary" :loading="loading" @click="submit">
            发送
           </el-button>
          </el-form>
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
</div>
</div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { sendChat } from '../api/chat'
import { listPrompts } from '../api/prompt'

const loading = ref(false)
const answer = ref('')
const reasoning = ref('')
const meta = ref('')
const thought = ref('')
const prompts = ref<any[]>([])
const form = reactive({
  query: '请介绍一下你自己',
  prompt_id: undefined as number | undefined,
  model_provider: 'ollama',
  model_name: 'deepseek-r1:7b',
  use_rag: false,
  memory_enabled: true,
  conversation_id: ''
})
watch(
    () => form.model_provider,
    (value) => {
form.model_name = value === 'ollama' ? 'deepseek-r1-local' : 'gpt-4o-mini'
    }
)
async function loadPrompts() {prompts.value = (await listPrompts()).data
}
async function submit() {
  loading.value = true
  answer.value = ''
  reasoning.value = ''
  thought.value = ''
  meta.value = ''

  try {
    const res = await sendChat(form)
    answer.value = res.data.answer
reasoning.value = res.data.reasoning || ''
thought.value = res.data.thought
meta.value = `${res.data.model_provider} / ${res.data.model_name} /
tokens=${res.data.total_tokens} / ${res.data.latency_ms}ms`
} catch (e: any) {
answer.value = '请求失败：' + (e.response?.data?.detail || e.message)
} finally {
loading.value = false
}
}
onMounted(loadPrompts)
</script>