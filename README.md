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

团队头像通过 `scripts/sync-team-avatars.mts` 同步。不要直接修改生成产物或 `.astro/`、`dist/` 中的文件。

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

构建成功后抽查首页、中文与英文内容路由、`robots.txt`、站点地图以及 404 页面。生产镜像由 `static.Dockerfile` 构建，根仓库的 `docker-compose.yml` 负责启动。
