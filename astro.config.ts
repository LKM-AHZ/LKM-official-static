import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // 纯静态输出：构建产物只含静态 HTML/CSS/JS，不依赖 node adapter
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
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: true, // 让默认语言也生成 /zh/ 前缀，得到 /zh/ 与 /en/ 对称前缀
      redirectToDefaultLocale: true, // 让根路径 / 自动 301 → /zh/，避免直访根域名落 404
      fallbackType: "redirect",
    },
  },
  integrations: [
    sitemap({
      // 激活 @astrojs/sitemap 内置 i18n alternate(hreflang) 生成:
      // 为每个 URL 输出指向同页另一语言的 <xhtml:link rel="alternate" hreflang>,
      // zh 条目指向 en(hreflang="en"), en 条目指向 zh(hreflang="zh")。
      // 非 zh/en 条目(如 /404)因无同 path 的另一语言匹配, 内置逻辑自动不生成 alternates。
      i18n: {
        defaultLocale: "zh",
        locales: {
          zh: "zh",
          en: "en",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
