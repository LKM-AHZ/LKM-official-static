# LKM 纯静态官网 Dockerfile: node 构建 → nginx 起静态文件
# 本镜像是官网独立部署栈(deploy/compose.yaml)的静态文件服务器：由该栈挂入的 nginx 站点
# 配置终结 TLS 并对外提供 80/443。
FROM node:24-alpine AS builder
WORKDIR /app
# 站点域名由部署侧 .env 通过 compose build args 注入；不设置时不生成依赖绝对域名的
# canonical / sitemap，构建仍可完成。
ARG LKM_SITE_DOMAIN=
ENV LKM_SITE_DOMAIN=${LKM_SITE_DOMAIN}
# pnpm 11 需要 workspace allowBuilds(esbuild) 与 .npmrc(node-linker=hoisted) 才能装依赖
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
# 全部源码与配置(src 内含 components/content/data/layouts/pages/styles)
COPY src/ ./src/
# public/ 由 Astro 原样复制进 dist（头像、文章封面、logo 等静态资源都在这里）。
# 漏掉这一行会让镜像里的站点只剩 HTML/CSS，所有本地图片 404——这类缺失在
# CI 的 pnpm build 里看不出来，因为 CI 是整仓 checkout，public/ 一直都在。
# robots.txt 已改为 src/pages/robots.txt.ts 在构建期按 LKM_SITE_DOMAIN 生成。
COPY public/ ./public/
COPY astro.config.ts tsconfig.json ./
RUN corepack enable && pnpm install --frozen-lockfile && pnpm run build

# 仅取构建产物, 用 nginx 直接 serve 静态文件
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80 443
