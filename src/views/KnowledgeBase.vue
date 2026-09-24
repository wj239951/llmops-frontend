RAG知识库中心
<template>
  <div>
    <h1>知识库</h1>
    <div class="card">
      <el-input v-model="form.title" placeholder="文档标题" style="margin-bottom:
10px" />
      <el-input v-model="form.content" type="textarea" :rows="8" placeholder="文档内
容" />
      <el-button type="primary" style="margin-top: 10px" @click="save">保存到本地
MySQL8.x</el-button>
    </div>
    <div class="card">
        <el-table :data="rows">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="source" label="来源" />
        <el-table-column prop="created_at" label="创建时间" />
      </el-table>
     </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createKnowledge, listKnowledge } from '..//api/knowledge.ts'
const rows = ref<any[]>([])
const form = reactive({
  title: 'LLMOps 说明',
  content: 'Prompt 管理、RAG、模型调用、日志监控、工具调用是工业 LLMOps 的核心能力。本地版使用Ollama 调用 deepseek-R1:7b，ChatGPT 保留 Key 模式。'
})
async function load() { rows.value = (await listKnowledge()).data }
async function save() { await createKnowledge(form); await load() }
onMounted(load)
</script>