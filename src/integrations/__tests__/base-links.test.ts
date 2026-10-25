// src/integrations/__tests__/base-links.test.ts
import { describe, expect, it } from "vitest";
import { rewriteHtmlBaseLinks } from "../base-links";

const BASE = "/LKM-official-static";

describe("rewriteHtmlBaseLinks", () => {
  it("给 Markdown 正文里手写的站内链接补部署前缀", () => {
    const html = '<p><a href="/zh/news">新闻</a></p>';
    expect(rewriteHtmlBaseLinks(html, BASE)).toBe(
      `<p><a href="${BASE}/zh/news">新闻</a></p>`,
    );
  });

  it("同时处理 src，并保留锚点后缀", () => {
    const html =
      '<a href="/zh/about#communities">社群</a><img src="/images/a.webp">';
    expect(rewriteHtmlBaseLinks(html, BASE)).toBe(
      `<a href="${BASE}/zh/about#communities">社群</a>` +
        `<img src="${BASE}/images/a.webp">`,
    );
  });

  it("已带前缀的链接保持幂等，不会叠加两层前缀", () => {
    const html = `<a href="${BASE}/zh/news">x</a>`;
    expect(rewriteHtmlBaseLinks(html, BASE)).toBe(html);
    // 连跑两次结果不变
    expect(rewriteHtmlBaseLinks(rewriteHtmlBaseLinks(html, BASE), BASE)).toBe(
      html,
    );
  });

  it("外链与纯锚点不动", () => {
    const html =
      '<a href="https://example.com/x">e</a><a href="mailto:a@b.c">m</a>' +
      '<a href="#faq">f</a><a href="//cdn.example.com/x.js">cdn</a>';
    expect(rewriteHtmlBaseLinks(html, BASE)).toBe(html);
  });

  it("root 前缀（base 为 /）不动", () => {
    const html = '<a href="/zh/news">x</a>';
    expect(rewriteHtmlBaseLinks(html, "")).toBe(html);
  });

  it("<pre> 里的代码示例不被改写", () => {
    const html =
      '<pre><code>&lt;a href="/zh/news"&gt;</code></pre>' +
      '<p><a href="/zh/news">真实链接</a></p>';
    const out = rewriteHtmlBaseLinks(html, BASE);
    expect(
      out.startsWith('<pre><code>&lt;a href="/zh/news"&gt;</code></pre>'),
    ).toBe(true);
    expect(out).toContain(`<p><a href="${BASE}/zh/news">真实链接</a></p>`);
  });

  it("只改 href/src，不动 content 等其它属性里的路径", () => {
    const html = '<meta property="og:image" content="/images/og.png">';
    expect(rewriteHtmlBaseLinks(html, BASE)).toBe(html);
  });
});
