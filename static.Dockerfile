# LKM 纯静态官网 Dockerfile: node 构建 → nginx 起静态文件
# 本镜像是官网独立部署栈(deploy/compose.yaml)的静态文件服务器：由该栈挂入的 nginx 站点
# 配置终结 TLS 并对外提供 80/443。
FROM node:24-alpine AS builder
WORKDIR /app
# pnpm 11 需要 workspace allowBuilds(esbuild) 与 .npmrc(node-linker=hoisted) 才能装依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# 全部源码与配置(src 内含 components/content/data/layouts/pages/styles)
COPY src/ ./src/
COPY astro.config.ts tsconfig.json ./
RUN corepack enable && pnpm install --frozen-lockfile && pnpm run build

# 仅取构建产物, 用 nginx 直接 serve 静态文件
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 443
