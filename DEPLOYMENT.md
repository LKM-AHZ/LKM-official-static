# 官网独立部署指南

本仓库是 LKM 纯静态官网（Astro 7 静态构建），**独立部署在一台自己的服务器上**；另有
[GitHub Pages 自动发布](#九github-pages自动发布可选) 作为预览/备用入口（第九节）。仓库不写死
默认域名；构建期 SEO 与运行期 nginx/证书配置统一使用 `deploy/.env` 中的
`LKM_SITE_DOMAIN`。部署编排自包含在 [`deploy/`](./deploy/) 目录，不依赖主站
（`LKM-Website`）或任何其它仓库。

架构很薄：一个 nginx 容器提供静态文件并终结 TLS（80/443），一个 certbot 容器负责证书续期，
一个一次性容器在冷启动时生成自签占位证书。没有 APISIX、没有后端、没有数据库——官网是纯静态站。

```
浏览器 ──80/443──> [static: nginx] ──> /usr/share/nginx/html (Astro 构建产物)
                        ▲  证书
                        │
                   [certbot] ── ACME http-01 ──> Let's Encrypt
```

---

## 一、前置条件

- 一台有公网 IP 的服务器，已装 Docker 与 Compose 插件（`docker compose version` 可用）。
- 安全组/防火墙放通 **80** 与 **443**（80 仅用于 ACME 校验与 301 跳转，不能省）。
- `git` 可用。
- 一个已确定并可控的域名（及 `www` 子域）的解析权。下文命令用 `<your-domain>` 占位，
  请替换为实际域名。

## 二、DNS

把 `<your-domain>` 与 `www.<your-domain>` 的 A（或 AAAA）记录指向本服务器公网 IP：

```sh
dig +short <your-domain>        # 应输出服务器 IP
dig +short www.<your-domain>    # 应输出服务器 IP
```

**证书签发前 DNS 必须已生效**，否则 Let's Encrypt 的 http-01 校验会失败。

## 三、获取代码与配置

```sh
git clone https://github.com/LKM-AHZ/LKM-official-static.git
cd LKM-official-static/deploy
cp .env.example .env
```

编辑 `deploy/.env`：

- `LKM_SITE_DOMAIN`：官网域名，**没有默认值，必填**。它同时决定构建期生成的 canonical /
  sitemap / robots.txt，以及 nginx 的 server_name、证书路径与 SNI；只填主机名，不要带协议或路径。
- `LKM_ACME_EMAIL`：首次签发用的联系邮箱。
- `LKM_RESTART_POLICY`：服务器常驻**建议改为 `unless-stopped`**（默认 `no` 时宿主机重启后容器不会自动拉起）。

> `.env` 已被 `.gitignore` 忽略；compose 在 `deploy/` 目录执行时自动读取它。

## 四、首次启动

```sh
docker compose up -d --build
```

顺序由 `depends_on` 保证：`certs-init`（生成 1 天期自签占位证书）→ `static`（nginx 起来，
此时用的是自签证书，浏览器会报不受信任，属预期）→ `certbot`（进入续期循环，因尚无证书而空转）。

```sh
docker compose ps                    # 三个服务应 up，certs-init 为 exited(0)
set -a && . ./.env && set +a
curl -sI "http://$LKM_SITE_DOMAIN/"  # 期望 301 -> https
```

## 五、签发正式证书

**建议先用 staging 环境试跑一次**，避免配置有误时反复失败撞上 Let's Encrypt 生产限流：

```sh
# 载入 .env 变量供下面的 shell 命令使用
set -a && . ./.env && set +a

docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$LKM_SITE_DOMAIN" -d "www.$LKM_SITE_DOMAIN" \
  --email "$LKM_ACME_EMAIL" --agree-tos --no-eff-email \
  --staging
```

staging 成功（说明 DNS、80 端口、webroot 路径都通）后，去掉 `--staging` 正式签发：

```sh
docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d "$LKM_SITE_DOMAIN" -d "www.$LKM_SITE_DOMAIN" \
  --email "$LKM_ACME_EMAIL" --agree-tos --no-eff-email
```

> `--entrypoint certbot` 是必需的：`certbot` 服务的默认入口是续期循环脚本，签发要临时覆盖它。
> 证书落在命名卷 `certbot_conf` 的 `/etc/letsencrypt/live/<域名>/`，`static` 容器只读共享同一卷。

**让 nginx 立即加载新证书**（否则最多等 6h 的下一次自动 reload）：

```sh
docker compose exec static nginx -s reload
```

## 六、验证

```sh
set -a && . ./.env && set +a
curl -I "https://$LKM_SITE_DOMAIN/zh/"          # 期望 200
curl -I "https://www.$LKM_SITE_DOMAIN/zh/"      # 期望 200
curl -I "http://$LKM_SITE_DOMAIN/"              # 期望 301 -> https

# 证书信息（签发者、有效期、覆盖的域名）
docker compose exec certbot certbot certificates

# nginx 配置语法
docker compose exec static nginx -t
```

抽查页面：首页 `/`（会跳转到 `/zh/`）、`/zh/`、`/en/`、`robots.txt`、`sitemap-index.xml`、一个不存在的路径（应 404）。

## 七、证书续期

`certbot` 容器每 12h 执行一次 `certbot renew`，`static` 容器每 6h 自动 `nginx -s reload`
拾取新证书——**全自动，无需人工干预**。

```sh
docker compose logs certbot                          # 看续期时间戳与成败
docker compose exec certbot certbot certificates     # 看有效期
```

## 八、更新站点

```sh
cd LKM-official-static
git pull
cd deploy && docker compose up -d --build static     # 只重建静态站；证书卷不受影响
```

> 头像、文章封面、logo 等都在 `public/`，由构建阶段复制进镜像；更新后必须带 `--build`，
> 只 `restart` 不会更新这些文件。可用 `docker compose exec static ls /usr/share/nginx/html/images/covers`
> 确认封面已进镜像。页面图片大面积 404 时先查这里。

## 九、GitHub Pages（自动发布，可选）

除了自己的服务器，推送到 `main` 还会由 `.github/workflows/pages.yml` 构建并发布到 GitHub Pages，
地址是 **<https://lkm-ahz.github.io/LKM-official-static/>**。它适合做预览/备用入口，不替代上面的
自建部署：Pages 只托管静态文件，不提供证书签发、反代或自定义响应头的控制权。

前提只有一条：仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**
（本项目已启用，`build_type` 为 `workflow`）。之后每次推 `main`、或在 Actions 里手动
`Run workflow`（`workflow_dispatch`）都会重发。

工作流里两个构建期变量决定了站点形态，要改就改这两行：

| 变量              | 值                  | 作用                                    |
| ----------------- | ------------------- | --------------------------------------- |
| `LKM_SITE_DOMAIN` | `<owner>.github.io` | canonical、sitemap、robots 里的绝对域名 |
| `LKM_BASE_PATH`   | `/<仓库名>`         | 站内链接与静态资源的子路径前缀          |

**项目页必须带子路径前缀。** Astro 产出的资源与 canonical 由框架自动加前缀；`langUrl()` /
`publicUrl()` 负责组件里的链接；Markdown 正文里作者手写的 `/zh/...` 由
`src/integrations/base-links.ts` 在构建后统一补前缀（跳过 `<pre>` 里的代码示例）。域根与
子路径部署都会把语言页面链接统一为带末尾斜杠的目录 URL，避免导航和预取产生额外 301；
查询串、锚点和静态资源文件名保持不变。

**以后要绑自定义域名**（如 `lkm.example.com`）：把工作流的 `LKM_BASE_PATH` 删掉、
`LKM_SITE_DOMAIN` 改成正式域名，再把 CNAME 文件放进 `public/`（构建时会复制到产物根），
Pages 站点就从子路径变成域根，链接无需再改。若同时保留自建部署，注意两边 canonical 会指向
不同域名——正式对外的那一个要有明确取舍。

**本地复现 Pages 构建**：

```sh
LKM_SITE_DOMAIN=lkm-ahz.github.io LKM_BASE_PATH=/LKM-official-static pnpm build

# 产物是「子路径站」：必须挂在 /LKM-official-static/ 下访问，直接 `-d dist` 起服务会 404
mkdir -p /tmp/pages-preview && ln -sfn "$PWD/dist" /tmp/pages-preview/LKM-official-static
python3 -m http.server 8080 -d /tmp/pages-preview   # http://127.0.0.1:8080/LKM-official-static/zh/
```

抽查：`/zh/`、`/en/team/`、一篇 `/zh/docs/<slug>/`（正文内链是否带前缀）、`robots.txt` 的
Sitemap 行、`sitemap-0.xml` 里的 `<loc>`、`404.html`（Pages 对未知路径返回它）。

## 十、注意事项

- **不要用 `docker compose down -v`**：`-v` 会删除 `certbot_conf` / `certbot_www` 两个卷，
  证书随之丢失，需要重新签发并可能触发 Let's Encrypt 限流。日常停服用不带 `-v` 的 `docker compose down`。
- **换域名**：改 `deploy/.env` 的 `LKM_SITE_DOMAIN` 后，必须用 `docker compose up -d --build`
  重新构建静态站（canonical / sitemap / robots.txt 在构建期写入），并重新走第五节的签发流程、
  把 DNS 一并切过去。域名未确定时 `LKM_SITE_DOMAIN` 保持为空，compose 会拒绝以空域名启动。
- **头像同步脚本**：`scripts/sync-team-avatars.mts` 依赖同级的后端仓库目录，独立 clone 本仓库时不可用。
  这不影响构建/部署（头像产物已提交），仅影响本地重新生成头像。
