import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// 语言集合的单一来源：routing.locales 与 sitemap 的 hreflang 配置都从这里派生，
// 免得两处列表各改一半、让 alternates 与实际路由悄悄对不上。
const LOCALES = { zh: "zh", en: "en" } as const;

// https://astro.build/config
export default defineConfig({
  // 纯静态输出：构建产物只含静态 HTML/CSS/JS
  output: "static",
  site: "https://lkm-ahz.icu",
  // 站内链接视口内预取，加快导航
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
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
  integrations: [
    sitemap({
      // 跳转桩不进 sitemap：根路径 / 是 Astro 生成的跳转页（自带 noindex），
      // /*/services/ 也是 noindex 的旧链路跳转页，让搜索引擎抓取它们没有意义
      filter: (page) => {
        const { pathname } = new URL(page);
        return pathname !== "/" && !pathname.endsWith("/services/");
      },
      // 激活 @astrojs/sitemap 内置 i18n alternate(hreflang) 生成:
      // 为每个 URL 输出指向同页另一语言的 <xhtml:link rel="alternate" hreflang>,
      // zh 条目指向 en(hreflang="en"), en 条目指向 zh(hreflang="zh")。
      // 非 zh/en 条目(如 /404)因无同 path 的另一语言匹配, 内置逻辑自动不生成 alternates。
      i18n: {
        defaultLocale: "zh",
        locales: LOCALES,
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
