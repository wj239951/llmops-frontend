# LLOPMS — 工业 LLMOps 平台

面向工业场景的本地大模型运维平台，支持 RAG 知识库问答、Prompt 模板管理、对话日志追踪。

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Element Plus + Vite |
| 后端 | Python FastAPI + SQLAlchemy + Pydantic |
| 数据库 | MySQL 8.x |
| 向量库 | Chroma（bge-m3 embedding） |
| 本地模型 | Ollama + deepseek-r1:7b |
| 云端模型 | OpenAI API（gpt-4o-mini） |

## 项目结构

```
LLOPMS/
├── frontend/          # Vue 3 前端
│   └── src/
│       ├── api/       # 接口封装
│       ├── views/     # 页面组件
│       └── router/    # 路由
├── backend/           # FastAPI 后端（独立仓库）
│   └── app/
│       ├── api/       # 路由层
│       ├── services/  # 业务逻辑（chat / rag / llm / prompt）
│       ├── models/    # SQLAlchemy 模型
│       ├── schemas/   # Pydantic 请求/响应
│       └── core/      # 配置、数据库连接
└── README.md
```

## 快速启动

### 后端

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# 配置 .env（MySQL 地址、Ollama 地址、OpenAI Key）
uvicorn app.main:app --reload
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## 功能模块

- **Chat Studio** — 选择模型/Prompt/RAG 开关，发送问题，展示思考过程 + 最终回答 + Token 统计
- **Prompt Manager** — Prompt 模板 CRUD，可绑定模型和参数
- **Knowledge Base** — 知识库文档管理，增删改自动同步 Chroma 向量库
- **Run Logs** — 对话日志查看，含状态、耗时、Token 消耗

## RAG 检索增强生成

### 流程

```
用户提问
  │
  ▼
┌─────────────────────────────────┐
│  1. 向量检索（Chroma + bge-m3）  │  ← 将问题编码为向量，找最相似的 top-k 文档
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│  2. 拼接上下文                    │  ← 将检索到的文档标题+内容拼进 prompt
│     "请基于以下知识库内容回答..."  │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────
│  3. 调用大模型生成回答            │  ← Ollama / OpenAI
└──────────────┬──────────────────┘
               │
               ▼
─────────────────────────────────┐
│  4. 返回 answer + sources        │  ← 回答 + 引用来源（前端可折叠展示）
└─────────────────────────────────┘
```

### 关键设计

- **Embedding 模型**：bge-m3（中文友好，Ollama 本地部署）
- **向量库**：Chroma，用 MySQL 文档 ID 作为 Chroma 文档 ID，保证双向一致
- **自动同步**：知识库增/删/改时，`rag_service` 自动同步 Chroma 集合，无需手动重建索引
- **来源溯源**：`/chat` 接口返回 `sources` 字段（title + snippet + source 链接），前端回答卡片底部可折叠展示参考来源

### 向量检索 vs 关键词检索

早期版本使用 jieba 分词 + LIKE 关键词匹配，存在以下问题：

| 对比项 | 关键词检索 | 向量检索 |
|---|---|---|
| 语义理解 | 无，必须字面匹配 | 有，"润滑脂"能匹配到"润滑油"相关文档 |
| 召回率 | 低，漏掉同义表述 | 高，基于语义相似度 |
| 排序 | 简单计数 | 余弦相似度，更准确 |

向量检索代码保留在 `rag_service.py`，关键词检索已注释保留作对比参考。

## 许可证

MIT
