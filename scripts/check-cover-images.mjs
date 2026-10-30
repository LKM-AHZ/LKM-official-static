// 构建后运行：node scripts/check-cover-images.mjs [产物目录] [部署前缀]
import assert from "node:assert/strict";
import { globSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "dist";
const base = `/${(process.argv[3] ?? "").replace(/^\/+|\/+$/g, "")}/`.replace(
  "//",
  "/",
);
const pages = globSync("**/*.html", { cwd: dir });
assert.ok(pages.length > 0, "请先运行 pnpm build");
const covers = new Map();
let count = 0;

function bytes(url) {
  assert.ok(url.startsWith(base), `图片缺少部署前缀 ${base}: ${url}`);
  return statSync(join(dir, decodeURIComponent(url.slice(base.length)))).size;
}

for (const page of pages) {
  const html = readFileSync(join(dir, page), "utf8");
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    const srcset = img.match(/\bsrcset="([^"]+)"/)?.[1];
    if (!srcset?.includes(" 400w")) continue;
    const sizes = new Map(
      srcset.split(",").map((candidate) => {
        const [url, width] = candidate.trim().split(/\s+/);
        return [width, bytes(url)];
      }),
    );
    assert.deepEqual([...sizes.keys()], ["400w", "600w", "800w", "1200w"]);
    assert.ok(sizes.get("400w") < sizes.get("800w"), `小图未缩小: ${page}`);
    assert.ok(sizes.get("600w") < sizes.get("800w"), `中图未缩小: ${page}`);
    const fallback = img.match(/data-fallback-src="([^"]+)"/)?.[1];
    assert.ok(fallback, `缺少主图回退: ${page}`);
    bytes(fallback);
    covers.set(srcset, sizes);
    count++;
  }
}
assert.ok(count > 0, "构建产物中没有响应式封面");
const totals = Object.fromEntries(
  ["400w", "600w", "800w", "1200w"].map((width) => [
    width,
    [...covers.values()].reduce((sum, sizes) => sum + sizes.get(width), 0),
  ]),
);
console.log({
  pages: pages.length,
  images: count,
  covers: covers.size,
  totals,
});
