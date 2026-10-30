// pnpm build 后运行；需要 Docker（本地 nginx:1.27-alpine 镜像）和 openssl。
// 仅启动临时测试容器，端口随机绑定到本机回环地址，结束后删除容器和测试证书。
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import http from "node:http";
import https from "node:https";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { setTimeout } from "node:timers/promises";

const dir = mkdtempSync(join(tmpdir(), "lkm-nginx-check-"));
const webroot = join(dir, "webroot");
let container;
const docker = (...args) =>
  execFileSync("docker", args, { encoding: "utf8" }).trim();

function request(secure, port, path) {
  return new Promise((resolve, reject) => {
    const req = (secure ? https : http).get(
      {
        hostname: "127.0.0.1",
        port,
        path,
        headers: { Host: "perf.test" },
        // 仅此临时容器使用本脚本生成的自签证书；不访问线上服务器。
        rejectUnauthorized: false,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, body }),
        );
      },
    );
    req.setTimeout(2000, () => req.destroy(new Error("测试请求超时")));
    req.on("error", reject);
  });
}

try {
  assert.ok(
    readFileSync("dist/zh/index.html").length > 0,
    "请先运行 pnpm build",
  );
  execFileSync(
    "openssl",
    [
      "req",
      "-x509",
      "-newkey",
      "rsa:2048",
      "-nodes",
      "-keyout",
      join(dir, "privkey.pem"),
      "-out",
      join(dir, "fullchain.pem"),
      "-days",
      "1",
      "-subj",
      "/CN=perf.test",
    ],
    { stdio: "ignore" },
  );
  writeFileSync(
    join(dir, "default.conf"),
    readFileSync("deploy/nginx/default.conf.template", "utf8").replaceAll(
      "${LKM_SITE_DOMAIN}",
      "perf.test",
    ),
  );
  mkdirSync(join(webroot, ".well-known/acme-challenge"), { recursive: true });
  writeFileSync(join(webroot, ".well-known/acme-challenge/probe"), "acme-ok");
  container = docker(
    "run",
    "--detach",
    "--rm",
    "--pull=never",
    "--publish",
    "127.0.0.1::80",
    "--publish",
    "127.0.0.1::443",
    "--volume",
    `${dir}/default.conf:/etc/nginx/conf.d/default.conf:ro`,
    "--volume",
    `${dir}:/etc/letsencrypt/live/perf.test:ro`,
    "--volume",
    `${webroot}:/var/www/certbot:ro`,
    "--volume",
    `${resolve("dist")}:/usr/share/nginx/html:ro`,
    "nginx:1.27-alpine",
  );
  const ports = JSON.parse(
    docker("inspect", "--format", "{{json .NetworkSettings.Ports}}", container),
  );
  const httpPort = Number(ports["80/tcp"][0].HostPort);
  const httpsPort = Number(ports["443/tcp"][0].HostPort);
  for (let attempt = 0; ; attempt++) {
    try {
      await request(false, httpPort, "/");
      break;
    } catch (error) {
      if (attempt >= 19) throw error;
      await setTimeout(100);
    }
  }
  docker("exec", container, "nginx", "-t");
  for (const secure of [false, true]) {
    const res = await request(
      secure,
      secure ? httpsPort : httpPort,
      "/?bg=css&from=a%2Fb",
    );
    assert.equal(res.status, 301);
    assert.equal(
      res.headers.location,
      "https://perf.test/zh/?bg=css&from=a%2Fb",
    );
  }
  const acme = await request(
    false,
    httpPort,
    "/.well-known/acme-challenge/probe",
  );
  assert.equal(acme.status, 200);
  assert.equal(acme.body, "acme-ok");
  const enRedirect = await request(false, httpPort, "/en/?from=test");
  assert.equal(enRedirect.headers.location, "https://perf.test/en/?from=test");
  assert.equal((await request(true, httpsPort, "/en/")).status, 200);
  assert.equal(
    (await request(true, httpsPort, "/missing-perf-check/")).status,
    404,
  );
  console.log(
    "nginx 通过：HTTP/HTTPS 根入口直达、参数保留、ACME、英文路由及 404",
  );
} finally {
  if (container) docker("stop", "--time", "1", container);
  rmSync(dir, { recursive: true, force: true });
}
