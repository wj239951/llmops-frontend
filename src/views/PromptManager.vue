Prompt工程中心
<template>
  <div>
    <h1>Prompt 编排</h1>
    <div class="card">
        <el-form label-width="120px">
            <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
            <el-form-item label="描述"><el-input v-model="form.description" /></el-form-item>
                <el-form-item label="系统提示词"><el-input v-model="form.system_prompt"
                    type="textarea" :rows="5" /></el-form-item>
            <el-form-item label="模型提供商">
                <el-select v-model="form.model_provider" style="width: 260px">
                <el-option label="本地 Ollama" value="ollama" />
            <el-option label="ChatGPT / OpenAI" value="openai" />
            </el-select>
            </el-form-item>
            <el-form-item label="模型名称"><el-input v-model="form.model_name"
            style="width: 260px" /></el-form-item>
            <el-button type="primary" @click="save">新增 Prompt</el-button>
            </el-form>
            </div>
            <div class="card">
                <el-table :data="rows">
                <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="model_provider" label="提供商" width="130" />
            <el-table-column prop="model_name" label="模型" width="180" />
            <el-table-column prop="created_at" label="创建时间" />
            <el-table-column label="操作" width="120">
                <template #default="{ row }"><el-button type="danger" size="small"
            @click="remove(row.id)">删除</el-button></template>
            </el-table-column>
            </el-table>
            </div>
            </div>
            </template>
            <script setup lang="ts">
            import { onMounted, reactive, ref, watch } from 'vue'
            import { createPrompt, deletePrompt, listPrompts } from '../api/prompt'
            const rows = ref<any[]>([])
            const form = reactive({
                name: '本地工业助手',
            description: '面向工业 LLMOps 的本地 DeepSeek 助手',
            system_prompt: '你是工业 LLMOps 平台中的专业 AI Agent，请结合工程实践回答。',
            model_provider: 'ollama',
            model_name: 'deepseek-r1:7b'

            })
            watch(() => form.model_provider, (value) => { form.model_name = value === 'ollama' ?
            'deepseek-r1:7b' : 'gpt-4o-mini' })
            async function load() { rows.value = (await listPrompts()).data }
            async function save() { await createPrompt(form); await load() }
            async function remove(id: number) { await deletePrompt(id); await load() }
            onMounted(load)
            </script>