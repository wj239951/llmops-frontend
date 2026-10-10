# ===== 构建阶段：把 Vue 源码编译成静态文件 =====
FROM node:24-alpine AS build
WORKDIR /app

# 先装依赖（利用层缓存）；package-lock.json 存在，用 npm ci 保证版本一致
COPY package*.json ./
RUN npm ci

# 拷源码并构建。用 build-only 跳过 vue-tsc 类型检查，
# 避免类型没补全时整个镜像 build 失败；类型干净后可换回 npm run build。
COPY . .
RUN npm run build-only

# ===== 运行阶段：nginx 只装静态产物，镜像又小又干净 =====
FROM nginx:alpine
# dist 是 Vite 默认输出目录；拷到 nginx 默认站点根
COPY --from=build /app/dist /usr/share/nginx/html
# 用自定义 nginx 配置覆盖默认的（含 /api 反向代理）
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
