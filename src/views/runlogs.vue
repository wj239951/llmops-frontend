运行监测中心
<template>
<div>
    <h1>运行日志</h1>
    <div class="card">
      <el-select v-model="status" placeholder="状态筛选" clearable style="width: 140px" @change="onFilterChange">
        <el-option label="全部" value="" />
        <el-option label="成功" value="success" />
        <el-option label="失败" value="failed" />
      </el-select>
      <el-button style="margin-left: 8px" @click="load">刷新</el-button>
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
      <el-pagination
        style="margin-top: 12px; justify-content: flex-end"
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="page"
        @current-change="load"
      />
   </div>
  </div>
 </template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listLogs } from '../api/logs'
const rows = ref<any[]>([])
const total = ref(0)       // 总条数，分页条用
const page = ref(1)        // 当前页
const pageSize = ref(10)   // 每页条数
const status = ref('')     // 状态筛选，空=全部
async function load() {
  const params: any = { page: page.value, page_size: pageSize.value }
  if (status.value) params.status = status.value  // 选了才传，不传后端返回全部
  const data = (await listLogs(params)).data
  rows.value = data.items
  total.value = data.total
}
function onFilterChange() {  // 切换状态时回到第1页，避免停在空白页
  page.value = 1
  load()
}
onMounted(load)
</script>