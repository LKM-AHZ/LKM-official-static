import type { APIRoute } from "astro";

// robots.txt 在构建期生成：只有配置了 LKM_SITE_DOMAIN 才输出 Sitemap 绝对地址，
// 避免在域名未确定时把占位域名写进产物。
export const GET: APIRoute = ({ site }) => {
  const lines = ["User-agent: *", "Allow: /"];

  if (site) {
    lines.push("", `Sitemap: ${new URL("sitemap-index.xml", site).href}`);
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
