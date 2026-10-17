import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { coverThumb } from "../images";

const ROOT = process.cwd();

/** 递归收集 docs 下的 markdown 文件（不依赖 Node 的 recursive readdir 行为）。 */
function markdownFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return markdownFiles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

/** 文章 frontmatter 里指向站内的 image 路径。 */
function localImageRefs(): string[] {
  return markdownFiles(path.join(ROOT, "src/content/docs")).flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    return (text.match(/^image:\s*(\S+)\s*$/gm) ?? [])
      .map((line) => line.replace(/^image:\s*/, "").trim())
      .filter((src) => src.startsWith("/"));
  });
}

describe("lib/images", () => {
  it("本地封面映射到 800w 缩略图", () => {
    expect(coverThumb("/images/covers/lkm-anniversary.webp")).toBe(
      "/images/covers/lkm-anniversary-800w.webp",
    );
  });

  it("已是缩略图时不重复追加后缀", () => {
    expect(coverThumb("/images/covers/lkm-anniversary-800w.webp")).toBe(
      "/images/covers/lkm-anniversary-800w.webp",
    );
  });

  it("外部 URL 与其它本地资源原样返回", () => {
    expect(coverThumb("https://example.com/cover.jpg")).toBe(
      "https://example.com/cover.jpg",
    );
    expect(coverThumb("/images/avatars/t01.webp")).toBe(
      "/images/avatars/t01.webp",
    );
  });

  it("文章引用的站内封面与缩略图都真实存在", () => {
    const refs = localImageRefs();
    expect(refs.length).toBeGreaterThan(0);
    for (const src of refs) {
      const full = path.join(ROOT, "public", src.slice(1));
      expect(fs.existsSync(full), `缺少封面文件: ${src}`).toBe(true);
      const thumb = coverThumb(src);
      const thumbFile = path.join(ROOT, "public", thumb.slice(1));
      expect(fs.existsSync(thumbFile), `缺少缩略图: ${thumb}`).toBe(true);
    }
  });

  it("Docker 构建阶段会带上 public/ 静态资源", () => {
    // 镜像里少了 public/ 时，HTML 引用的头像、封面、logo 会全部 404；
    // CI 的 pnpm build 是整仓 checkout，发现不了 Dockerfile 漏拷。
    const dockerfile = fs.readFileSync(
      path.join(ROOT, "static.Dockerfile"),
      "utf8",
    );
    expect(dockerfile).toMatch(/^COPY public\/ /m);
  });
});
