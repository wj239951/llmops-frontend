//Prompt工程中心
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
            <el-form-item>
            <el-form-item label="模型名称"><el-input v-model="form.model_name"
            style="width: 260px" /></el-form-item>
            <el-button type="primary" @click="save">{{ editingId ? '保存当前修改' : '新增Prompt' }}</el-button>
            </el-form-item>
            </el-form>
            </div>
            <div class="card">
                <el-table :data="rows">
                <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="model_provider" label="提供商" width="130" />
            <el-table-column prop="model_name" label="模型" width="180" />
            <el-table-column prop="created_at" label="创建时间" />

            <el-table-column label="操作1" width="120">
                <template #default="{ row }"><el-button type="primary" size="small"
            @click="editRow(row)">修改</el-button></template>
            </el-table-column>


            <el-table-column label="操作2" width="120">
                <template #default="{ row }"><el-button type="danger" size="small" @click="remove(row.id)">删除</el-button></template>
            </el-table-column>
            </el-table>
            </div>
            </div>
            </template>
            <script setup lang="ts">
            import { onMounted, reactive, ref, watch } from 'vue'
            import { createPrompt, deletePrompt, listPrompts, updatePrompt } from '../api/prompt'//多引入updataPrompt
            const rows = ref<any[]>([])
            const editingId = ref<number | null>(null)// 正在编辑的 Prompt ID
            const form = reactive({
                name: '本地工业助手',
            description: '面向工业 LLMOps 的本地 DeepSeek 助手',
            system_prompt: '你是工业 LLMOps 平台中的专业 AI Agent，请结合工程实践回答。',
            model_provider: 'ollama',
            model_name: 'deepseek-r1:7b'

            })
            watch(() => form.model_provider, (value) => { form.model_name = value === 'ollama' ? 'deepseek-r1:7b' : 'gpt-4o-mini' })
            async function load() { rows.value = (await listPrompts()).data }
            async function save() { 
                if (editingId.value) { // 修改
                    await updatePrompt(editingId.value, form)
                } else { // 新增
                    await createPrompt(form)
                }
                await load()
                editingId.value = null
                form.name = ''
                form.description = ''
                form.system_prompt = ''
                form.model_provider = 'ollama'
                form.model_name = 'deepseek-r1:7b'
             }
            async function editRow(row: any) {
              Object.assign(form, row)      // 把这一行的数据拷进 form
              editingId.value = row.id       // 记住正在编辑这条
            }

                async function remove(id: number) { await deletePrompt(id); await load() }
                onMounted(load)
            </script>