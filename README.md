# LKM Official Static

LKM 纯静态官网，基于 Astro 7 和 Tailwind CSS 4。该项目只负责可静态生成的官网、公告和双语资讯，不承载社区登录、实时数据或后台能力。

## 环境要求

- Node.js `>=24`
- pnpm `11`（以 `packageManager` 字段为准）

## 开发

```sh
pnpm install
cp .env.example .env   # 可选：填写 LKM_SITE_DOMAIN 以生成完整 SEO 元信息
pnpm dev
```

`LKM_SITE_DOMAIN` 没有默认值，也未写死任何域名。未配置时本地开发、检查与构建仍可运行，
但不会生成 canonical、sitemap，`robots.txt` 中也不会包含 Sitemap 行；配置后请只填写主机名，
例如 `LKM_SITE_DOMAIN=example.com`（也可填写完整 URL）。

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

成员卡片在构建期从 192px 原头像生成带哈希的 WebP 小图，通过 `srcset` 和 `sizes` 按卡片尺寸及 DPR 选图，保持懒加载。原图保留用于高密度屏及小图加载失败回退；没有头像的成员继续显示首字占位。

文章封面同样随仓库托管在 `public/images/covers/`：每篇文章一张 1200w 主图（`<name>.webp`）和一张 800w 缩略图（`<name>-800w.webp`），Markdown 的 `image` 指向站内路径。Astro 在构建期从原图补充带哈希的 400w / 600w WebP，列表与详情页通过 `srcset` 按布局宽度和 DPR 在 400w / 600w / 800w / 1200w 之间选择。图片失败时组件会先回退到 public 主图，再失败则露出标题渐变占位。不要改回 `picsum.photos` 等外部图床——多一次 302 跳转和第三方可用性都会让图片偶发加载失败。

## 字体与排版

拉丁字符使用自托管的 Inter Latin 子集，中文由系统 CJK 字体（PingFang SC / Microsoft YaHei / Noto Sans CJK SC）渲染，不整体加载数 MB 的中文字体；字体文件、来源与 OFL 许可证见 [`public/fonts/README.md`](public/fonts/README.md)。

字号与行高 token 集中在 `src/styles/variables.css`（`--type-*`、`--leading-*`、`--tracking-*`），并在 `src/styles/tailwind.css` 中映射为 `text-body` / `text-lead` / `text-section` / `text-display` / `text-note` / `text-label`。中文正文行高 1.75、英文 1.68；新增页面优先复用这些工具类，不要再散写 `text-[17px]` 之类的固定字号。

## 性能约定

首页时间线样式只由首页加载；Typography 的 `prose.css` 只在文章、隐私和条款页加载。
动态背景在页面 `load` 后的空闲时段才下载渲染器，手机触屏、减少动态效果、省流量或 2G 连接默认使用
CSS 背景。WebGL 只创建一个上下文，画布最多 200 万像素；触屏 DPR 上限为 1，其他设备为
1.5。后台暂停，上下文丢失后释放监听并回退 CSS。可用 `?bg=css` / `?bg=webgl` 手工对比。

页面 URL 统一使用末尾斜杠（含 Markdown 内链、语言切换、canonical 和 sitemap），
避免目录式静态托管在导航/预取时多一次 301。文章目录与页内侧栏缓存区块位置，
只在布局尺寸变化后重新测量，滚动时不再逐个读取元素布局。手机导航和侧栏按钮使用实色底，
省去背景模糊合成。

nginx 镜像在构建时生成文本资源的 `.gz` 文件。带内容哈希的 `/_astro/` 资源缓存一年，
未带哈希的图片和字体缓存一天，HTML 每次校验更新；GitHub Pages 的响应头由平台控制。

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
node scripts/check-cover-images.mjs
node scripts/check-avatar-images.mjs
```

构建成功后抽查首页、中文与英文内容路由、`robots.txt`、站点地图以及 404 页面。若本地
`.env` 中配置了 `LKM_SITE_DOMAIN`，还应确认 canonical 与 sitemap 使用该域名。
子路径构建检查图片时传入前缀，例如 `node scripts/check-cover-images.mjs dist /LKM-official-static` 和 `node scripts/check-avatar-images.mjs dist /LKM-official-static`。

## 部署

官网独立部署在一台服务器上（nginx 提供静态文件与 TLS + certbot 申请/续期证书），部署编排
自包含在本仓库的 `deploy/` 目录，不依赖任何其它仓库。完整步骤见 [`DEPLOYMENT.md`](./DEPLOYMENT.md)：

```sh
cd deploy
cp .env.example .env   # 必须填 LKM_SITE_DOMAIN；按需填 LKM_ACME_EMAIL
docker compose up -d --build
```

`deploy/.env` 是部署时的域名唯一来源；compose 会把它同时注入 Astro 构建和 nginx 配置。

推送到 `main` 时还会由 [`.github/workflows/pages.yml`](./.github/workflows/pages.yml) 额外发布一份
到 GitHub Pages（项目页地址 `https://lkm-ahz.github.io/LKM-official-static/`），用于不碰服务器的
预览与备份。项目页挂在子路径下，工作流会自动传入 `LKM_BASE_PATH`；本地复现该构建：

```sh
LKM_SITE_DOMAIN=<owner>.github.io LKM_BASE_PATH=/LKM-official-static pnpm build
```

两种部署共用同一份 `dist/`，域名与子路径前缀只在构建期以环境变量区分。
