//路由管理
// URL映射
// 页面切换
// 菜单跳转
import { createRouter, createWebHistory } from 'vue-router'
import ChatStudio from '../views/ChatStudio.vue'
import PromptManager from '../views/PromptManager.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import RunLogs from '../views/runlogs.vue'
export default createRouter({
history: createWebHistory(),
routes: [
{ path: '/', component: ChatStudio },
{ path: '/prompts', component: PromptManager },
{ path: '/knowledge', component: KnowledgeBase },
{ path: '/logs', component: RunLogs }
]
})