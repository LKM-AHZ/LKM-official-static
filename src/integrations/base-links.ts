/**
 * 子路径部署的兜底：把构建产物 HTML 里仍以站点绝对路径书写的站内链接补上部署前缀。
 *
 * 框架产出的 URL（_astro 资源、canonical、sitemap、组件里的 langUrl/publicUrl）
 * 由 Astro 与本仓的 withBase() 负责，不需要这里插手；这一层专门收口 Markdown
 * 正文里作者手写的 `/zh/news`、`/zh/about#communities` 这类链接——它们在域名根
 * 部署（本地 / nginx）下正确，但 GitHub Pages 项目页挂在 `/<仓库名>/` 子路径下，
 * 不补前缀就会整篇 404。放在构建后统一处理，内容作者不必感知部署方式。
 *
 * 只改 href / src 两个属性，跳过 <pre> 区块（文档里展示链接语法的代码示例
 * 不能被改写），外链与锚点由 applyBase 原样放过。域根部署（base 为 "/"）时
 * 整个集成是 no-op。
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import type { AstroIntegration } from "astro";
import { applyBase } from "../i18n/paths";

/** href/src 属性；引号内即 URL，交给 applyBase 决定是否补前缀。 */
const ATTR_RE = /\b(href|src)="([^"]*)"/g;

/** <pre> 区块（含其中被转义的代码示例）：其中出现的 href="..." 是示例文本，不能改写。 */
const PRE_RE = /(<pre\b[\s\S]*?<\/pre>)/g;

/** 纯函数，便于单测：给 HTML 里的站内 href/src 补部署前缀。 */
export function rewriteHtmlBaseLinks(html: string, base: string): string {
  if (!base) return html;
  // split 保留分隔符：偶数下标是普通片段，奇数下标是 <pre> 片段
  return html
    .split(PRE_RE)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part.replace(
            ATTR_RE,
            (_match, attr: string, url: string) =>
              `${attr}="${applyBase(base, url)}"`,
          ),
    )
    .join("");
}

/** 递归收集输出目录里的 HTML 文件。 */
async function collectHtmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => join(entry.parentPath, entry.name));
}

export default function baseLinksIntegration(base: string): AstroIntegration {
  return {
    name: "lkm-base-links",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        // 域根部署无需任何处理
        if (base === "/" || base === "") return;
        const root = fileURLToPath(dir);
        const files = await collectHtmlFiles(root);
        let rewritten = 0;
        for (const file of files) {
          const html = await readFile(file, "utf8");
          const next = rewriteHtmlBaseLinks(html, base);
          if (next !== html) {
            await writeFile(file, next, "utf8");
            rewritten += 1;
          }
        }
        logger.info(
          `补部署前缀 ${base}：改写了 ${rewritten}/${files.length} 个 HTML 文件`,
        );
      },
    },
  };
}
