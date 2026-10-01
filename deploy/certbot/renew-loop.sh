#!/bin/sh
# certbot 常驻续期循环。**首次签发是手动步骤**，本容器只负责 renew。
# 证书尚不存在时 certbot renew 会静默跳过（"No renewals were attempted"，退出 0），无害。
# 循环里记录时间戳与成败：cron 式的静默循环中，运维只能靠 docker logs 判断续期是否真的在跑
# （certbot 缺失 / ACME 调用立即失败时，原样重试 12h 一次会毫无痕迹）。
trap exit TERM
while :; do
    ts="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
    if certbot renew; then
        echo "$ts certbot renew ok"
    else
        rc=$?
        echo "$ts certbot renew FAILED (exit $rc)" >&2
    fi
    sleep 12h &
    wait $!
done
