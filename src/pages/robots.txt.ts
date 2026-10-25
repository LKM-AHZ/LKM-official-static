import type { APIRoute } from "astro";
import { publicUrl } from "../lib/assets";

// robots.txt 在构建期生成：只有配置了 LKM_SITE_DOMAIN 才输出 Sitemap 绝对地址，
// 避免在域名未确定时把占位域名写进产物。
export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];

  if (site) {
    const sitemap = new URL(publicUrl("/sitemap-index.xml"), site).href;
    lines.push("", `Sitemap: ${sitemap}`);
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
