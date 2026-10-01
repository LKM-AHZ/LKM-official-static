# 官网独立部署指南

本仓库是 LKM 纯静态官网（Astro 7 静态构建，域名 `lkm-ahz.icu`），**独立部署在一台自己的
服务器上**。部署编排自包含在 [`deploy/`](./deploy/) 目录，不依赖主站（`LKM-Website`）或任何
其它仓库。

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
- 域名 `lkm-ahz.icu`（及 `www`）的解析权。

## 二、DNS

把 `lkm-ahz.icu` 与 `www.lkm-ahz.icu` 的 A（或 AAAA）记录指向本服务器公网 IP：

```sh
dig +short lkm-ahz.icu        # 应输出服务器 IP
dig +short www.lkm-ahz.icu    # 应输出服务器 IP
```

**证书签发前 DNS 必须已生效**，否则 Let's Encrypt 的 http-01 校验会失败。

## 三、获取代码与配置

```sh
git clone https://github.com/LKM-AHZ/LKM-official-static.git
cd LKM-official-static/deploy
cp .env.example .env
```

编辑 `deploy/.env`：

- `LKM_SITE_DOMAIN`：官网域名（默认 `lkm-ahz.icu`）。这是 server_name、证书路径与 SNI 的唯一来源。
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
curl -sI http://lkm-ahz.icu/         # 期望 301 -> https
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
curl -I https://lkm-ahz.icu/zh/            # 期望 200
curl -I https://www.lkm-ahz.icu/zh/        # 期望 200
curl -I http://lkm-ahz.icu/                # 期望 301 -> https

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

## 九、注意事项

- **不要用 `docker compose down -v`**：`-v` 会删除 `certbot_conf` / `certbot_www` 两个卷，
  证书随之丢失，需要重新签发并可能触发 Let's Encrypt 限流。日常停服用不带 `-v` 的 `docker compose down`。
- **换域名**：改 `deploy/.env` 的 `LKM_SITE_DOMAIN` 后，需重新走第五节的签发流程，并把 DNS 一并切过去。
- **头像同步脚本**：`scripts/sync-team-avatars.mts` 依赖同级的后端仓库目录，独立 clone 本仓库时不可用。
  这不影响构建/部署（头像产物已提交），仅影响本地重新生成头像。
