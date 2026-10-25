import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import baseLinks from "./src/integrations/base-links";

// 语言集合的单一来源：routing.locales 与 sitemap 的 hreflang 配置都从这里派生，
// 免得两处列表各改一半、让 alternates 与实际路由悄悄对不上。
const LOCALES = { zh: "zh", en: "en" } as const;

// 站点域名不设默认值：尚未确定域名时允许省略，此时不生成依赖绝对域名的
// canonical / sitemap；部署或本地构建前可在 .env 中设置 LKM_SITE_DOMAIN。
// 同时兼容只写域名和写完整 URL 两种格式。
function readSiteUrl(value: string | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return url.origin;
  } catch {
    throw new Error(
      "LKM_SITE_DOMAIN 不是有效的域名或 URL；示例：LKM_SITE_DOMAIN=example.com",
    );
  }
}

// 部署子路径前缀：自建 nginx 部署在域名根（留空即 "/"）；GitHub Pages 的项目页
// 固定挂在 /<仓库名>/ 下，由 pages 工作流传入 LKM_BASE_PATH=/<仓库名>。
// 只接受以 "/" 开头的路径前缀，写错时让构建直接失败，而不是产出一整站的坏链接。
function readBasePath(value: string | undefined): string {
  const raw = value?.trim();
  if (!raw || raw === "/") return "/";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) {
    throw new Error(
      "LKM_BASE_PATH 只填路径前缀，不要带协议和域名；示例：LKM_BASE_PATH=/LKM-official-static",
    );
  }
  const path = `/${raw.replace(/^\/+|\/+$/g, "")}`;
  return path === "/" ? "/" : path;
}

// Node 24 原生支持读取 .env；外部环境变量优先级更高。没有 .env 时静默跳过。
try {
  process.loadEnvFile();
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}
const site = readSiteUrl(process.env.LKM_SITE_DOMAIN);
const base = readBasePath(process.env.LKM_BASE_PATH);

// https://astro.build/config
export default defineConfig({
  // 纯静态输出：构建产物只含静态 HTML/CSS/JS
  output: "static",
  site,
  // 子路径部署前缀（默认 "/" 即域名根）。站内链接/资源都经 i18n/paths 的
  // withBase() 拼上此前缀；import.meta.env.BASE_URL 也由它派生。
  base,
  // 站内链接悬停/聚焦时预取。原先的 viewport 策略会在首屏批量预取所有可见链接，
  // 与 LCP 抢带宽，还会把 /zh 与 /zh/ 当成两个 URL 重复请求一次。
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  compressHTML: true,
  build: {
    // 体积较小的样式表内联进 HTML，减少阻塞请求
    inlineStylesheets: "auto",
  },
  i18n: {
    defaultLocale: "zh",
    locales: Object.keys(LOCALES),
    routing: {
      prefixDefaultLocale: true, // 让默认语言也生成 /zh/ 前缀，得到 /zh/ 与 /en/ 对称前缀
      // 根路径 / 由 Astro 生成跳转页（纯静态输出没有服务器能发 301，产物是带 meta refresh
      // 的 HTML），避免直访根域名落 404
      redirectToDefaultLocale: true,
      fallbackType: "redirect",
    },
  },
  // Markdown 正文里手写的站内绝对链接（/zh/news 之类）由该集成在构建后补部署前缀
  integrations: [
    baseLinks(base),
    ...(site
      ? [
          sitemap({
            // 根路径 / 是 Astro 生成的跳转页（自带 noindex），不需要进 sitemap
            filter: (page) => new URL(page).pathname !== "/",
            // 激活 @astrojs/sitemap 内置 i18n alternate(hreflang) 生成:
            // 为每个 URL 输出指向同页另一语言的 <xhtml:link rel="alternate" hreflang>,
            // zh 条目指向 en(hreflang="en"), en 条目指向 zh(hreflang="zh")。
            // 非 zh/en 条目(如 /404)因无同 path 的另一语言匹配, 内置逻辑自动不生成 alternates。
            i18n: {
              defaultLocale: "zh",
              locales: LOCALES,
            },
          }),
        ]
      : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
