# LKM Official Static

LKM 纯静态官网，基于 Astro 7 和 Tailwind CSS 4。该项目只负责可静态生成的官网、公告和双语资讯，不承载社区登录、实时数据或后台能力。

## 环境要求

- Node.js `>=24`
- pnpm `11`（以 `packageManager` 字段为准）

## 开发

```sh
pnpm install
pnpm dev
```

默认开发地址为 `http://127.0.0.1:4321`。如果动态前端同时运行，请为其中一个进程指定其他端口：

```sh
pnpm dev -- --port 4322
```

## 内容结构

```text
src/content/docs/
├── zh/   # 中文公告、介绍和新闻
└── en/   # 对应英文内容
```

同一内容的中英文文件应使用相同文件名。新增或更新内容时同时检查标题、发布日期、链接和两种语言的对应关系；历史新闻不应为了统一措辞而改写事实。

团队头像通过 `scripts/sync-team-avatars.mts` 同步。该脚本的源目录是 `../LKM-service/static/avatars/`，因此只能在包含后端仓库的编排检出（`LKM-Website`）里运行，独立 clone 本仓库时不可用——但头像产物已提交进 `public/images/avatars/` 与 `src/data/avatar-map.json`，构建与部署不依赖该脚本。不要直接修改生成产物或 `.astro/`、`dist/` 中的文件。

文章封面同样随仓库托管在 `public/images/covers/`：每篇文章一张 1200w 主图（`<name>.webp`）和一张 800w 缩略图（`<name>-800w.webp`），Markdown 的 `image` 指向站内路径。列表与移动端走 `srcset` 选缩略图，详情页 hero 再按视口取主图；图片失败时组件会先回退到主图，再失败则露出标题渐变占位。不要改回 `picsum.photos` 等外部图床——多一次 302 跳转和第三方可用性都会让图片偶发加载失败。

## 字体与排版

拉丁字符使用自托管的 Inter Latin 子集，中文由系统 CJK 字体（PingFang SC / Microsoft YaHei / Noto Sans CJK SC）渲染，不整体加载数 MB 的中文字体；字体文件、来源与 OFL 许可证见 [`public/fonts/README.md`](public/fonts/README.md)。

字号与行高 token 集中在 `src/styles/variables.css`（`--type-*`、`--leading-*`、`--tracking-*`），并在 `src/styles/tailwind.css` 中映射为 `text-body` / `text-lead` / `text-section` / `text-display` / `text-note` / `text-label`。中文正文行高 1.75、英文 1.68；新增页面优先复用这些工具类，不要再散写 `text-[17px]` 之类的固定字号。

## 命令

| 命令           | 用途                             |
| -------------- | -------------------------------- |
| `pnpm dev`     | 启动开发服务器                   |
| `pnpm build`   | 构建静态站到 `dist/`             |
| `pnpm preview` | 预览构建产物                     |
| `pnpm check`   | Astro、ESLint、Prettier 全量检查 |
| `pnpm test`    | 运行 Vitest                      |
| `pnpm fix`     | 自动修复 ESLint 和 Prettier 问题 |

## 交付前检查

```sh
pnpm check
pnpm test
pnpm build
```

构建成功后抽查首页、中文与英文内容路由、`robots.txt`、站点地图以及 404 页面。

## 部署

官网独立部署在一台服务器上（nginx 提供静态文件与 TLS + certbot 申请/续期证书），部署编排
自包含在本仓库的 `deploy/` 目录，不依赖任何其它仓库。完整步骤见 [`DEPLOYMENT.md`](./DEPLOYMENT.md)：

```sh
cd deploy
cp .env.example .env   # 填 LKM_SITE_DOMAIN / LKM_ACME_EMAIL
docker compose up -d --build
```
