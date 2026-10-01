#!/bin/sh
# 冷启动证书兜底（在 certs-init 一次性容器中运行，alpine 基础镜像）。
set -eu

DOMAIN="${LKM_SITE_DOMAIN:?LKM_SITE_DOMAIN 未设置}"
DIR="/etc/letsencrypt/live/$DOMAIN"

# 已有证书则不覆盖：compose 每次 up 都会跑本容器，覆盖会丢掉已签发的正式证书。
if [ -s "$DIR/fullchain.pem" ] && [ -s "$DIR/privkey.pem" ]; then
    echo "[certs-init] 证书已存在，跳过自签：$DIR"
    exit 0
fi

# alpine 基础镜像不含 openssl CLI（与 render.sh 的注释一致），按需安装。
# 此处是首次运行路径，装不上就没有可用的证书占位、nginx 必失败，故让它硬失败以暴露问题。
apk add --no-cache openssl >/dev/null

mkdir -p "$DIR"
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout "$DIR/privkey.pem" -out "$DIR/fullchain.pem" \
    -subj "/CN=$DOMAIN" \
    -addext "subjectAltName=DNS:$DOMAIN,DNS:www.$DOMAIN"
# 私钥权限收紧（certbot/nginx 对权限敏感）
chmod 600 "$DIR/privkey.pem"

echo "[certs-init] 已生成 1 天期自签占位证书：$DIR"
