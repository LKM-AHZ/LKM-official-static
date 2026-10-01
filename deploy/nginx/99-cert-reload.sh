#!/bin/sh
# 由 nginx 镜像的 docker-entrypoint.sh 在启动阶段处理：可执行则 exec、不可执行则 source
# certbot 续期只更新卷里的 PEM 文件，已在跑的 nginx 仍持有旧证书，必须 reload 才会重读。
# 用固定间隔轮询而非监听证书变化：静态站对 reload 时机的精度不敏感，省掉 docker.sock 依赖
# 与跨容器信号机制。首次 reload 在启动后 6h，与 certbot 的 12h 续期节奏对齐即可。
# 需要立即生效时（例如刚手动签完证书）执行：docker compose exec static nginx -s reload
( while :; do sleep 21600; nginx -s reload || true; done ) &
