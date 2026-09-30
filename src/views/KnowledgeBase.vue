RAG知识库中心
<template>
  <div>
    <h1>知识库</h1>
    <div class="card">
      <el-input v-model="form.title" placeholder="文档标题" style="margin-bottom:
10px" />
      <el-input v-model="form.content" type="textarea" :rows="8" placeholder="文档内
容" />
      <el-button type="primary" style="margin-top: 10px" @click="save">{{ KnowledgeId ? '保存修改' : '新增文档' }}</el-button>
    </div>
    <div class="card">
        <el-table :data="rows">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="source" label="来源" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作1" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="editRow(row)">修改</el-button>
          </template>
        </el-table-column>
         <el-table-column label="操作2" width="120">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="deleteRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
     </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { createKnowledge, listKnowledge, updateKnowledge, deleteKnowledge } from '../api/knowledge'
const rows = ref<any[]>([])
const KnowledgeId = ref<number | null>(null) // 正在编辑的知识库ID
const form = reactive({
  title: 'LLMOps 说明',
  content: 'Prompt 管理、RAG、模型调用、日志监控、工具调用是工业 LLMOps 的核心能力。本地版使用Ollama 调用 deepseek-R1:7b，ChatGPT 保留 Key 模式。'
})
async function save() { 
  if (KnowledgeId.value) { // 修改
    await updateKnowledge(KnowledgeId.value, form)
  } else { // 新增
    await createKnowledge(form)
  }
  await load()
  KnowledgeId.value = null
  form.title = ''
  form.content = ''
}
async function editRow(row: any) {
  KnowledgeId.value = row.id       // 记住正在编辑这条
  form.title = row.title           // 逐个字段赋值，避免污染 id/created_at
  form.content = row.content
}
async function deleteRow(row: any) {
  await deleteKnowledge(row.id)
  await load()
}

    async function load() { rows.value = (await listKnowledge()).data }
      onMounted(load)
    </script>