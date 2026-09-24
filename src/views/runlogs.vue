运行监测中心
<template>
<div>
    <h1>运行日志</h1>
    <div class="card">
    <el-button @click="load">刷新</el-button>
      <el-table :data="rows" style="margin-top: 12px">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="model_provider" label="模型商" width="120" />
        <el-table-column prop="model_name" label="模型" width="170" />
        <el-table-column prop="user_input" label="用户输入" />
        <el-table-column prop="total_tokens" label="Tokens" width="90" />
        <el-table-column prop="latency_ms" label="耗时ms" width="90" />
        <el-table-column prop="status" label="状态" width="90" />
        <el-table-column prop="created_at" label="时间" width="190" />
    </el-table>
   </div>
  </div>
 </template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listLogs } from '../api/logs'
const rows = ref<any[]>([])
async function load() { rows.value = (await listLogs()).data }
onMounted(load)
</script>