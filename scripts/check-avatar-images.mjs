// 构建后运行：node scripts/check-avatar-images.mjs [产物目录] [部署前缀]
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";

const dir = process.argv[2] ?? "dist";
const base = `/${(process.argv[3] ?? "").replace(/^\/+|\/+$/g, "")}/`.replace(
  "//",
  "/",
);
const avatars = new Map();
let count = 0;
let initials = 0;

function bytes(url) {
  assert.ok(url.startsWith(base), `图片缺少部署前缀 ${base}: ${url}`);
  return statSync(join(dir, decodeURIComponent(url.slice(base.length)))).size;
}

for (const lang of ["zh", "en"]) {
  for (const route of ["team", "team/projects"]) {
    const html = readFileSync(join(dir, lang, route, "index.html"), "utf8");
    let pageCount = 0;
    initials += [
      ...html.matchAll(/<div class="[^"]*rounded-full bg-surface-3/g),
    ].length;
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
      const src = img.match(/\bsrc="([^"]+)"/)?.[1];
      const fallback = img.match(
        /data-fallback-src="([^"]*\/avatars\/[^"]+)"/,
      )?.[1];
      if (!fallback) {
        assert.ok(!src?.includes("/images/avatars/"), `头像未优化: ${src}`);
        continue;
      }
      const srcset = img.match(/\bsrcset="([^"]+)"/)?.[1];
      assert.ok(srcset, `头像未生成 srcset: ${route}`);
      const sizes = new Map(
        srcset.split(",").map((candidate) => {
          const [url, width] = candidate.trim().split(/\s+/);
          const size = bytes(url);
          if (width !== "192w") {
            assert.ok(
              url.startsWith(`${base}_astro/`),
              `缩略图未使用构建资源: ${url}`,
            );
            assert.ok(size < bytes(fallback), `缩略图未缩小: ${url}`);
          } else assert.equal(url, fallback);
          return [width, size];
        }),
      );
      const large = img.includes("sm:w-24");
      assert.deepEqual(
        [...sizes.keys()],
        large
          ? ["64w", "96w", "128w", "192w"]
          : ["40w", "64w", "80w", "128w", "192w"],
      );
      assert.ok(
        img.includes(
          `sizes="auto, (min-width: 640px) ${large ? 96 : 64}px, ${large ? 64 : 40}px"`,
        ),
      );
      assert.ok(
        img.includes('loading="lazy"') && img.includes('decoding="async"'),
      );
      assert.ok(img.includes('width="192"') && img.includes('height="192"'));
      assert.equal(src, srcset.split(" ")[0]);

      // 执行产物中的实际回退处理，确保清掉 srcset，且原图失败不会再次重试。
      const onerror = img.match(/\bonerror="([^"]+)"/)?.[1];
      assert.ok(onerror, `头像缺少原图回退: ${route}`);
      const removed = [];
      const element = {
        dataset: { fallbackSrc: fallback },
        src,
        removeAttribute(name) {
          removed.push(name);
        },
      };
      runInNewContext(`(function(){${onerror}}).call(element)`, { element });
      assert.equal(element.src, fallback);
      assert.deepEqual(removed, ["onerror", "srcset"]);
      avatars.set(fallback, sizes);
      count++;
      pageCount++;
    }
    assert.ok(pageCount > 0, `页面没有响应式头像: ${lang}/${route}`);
  }
}
assert.ok(initials > 0, "无头像成员的首字占位丢失");
console.log({
  images: count,
  avatars: avatars.size,
  initials,
  totals: Object.fromEntries(
    ["64w", "128w", "192w"].map((width) => [
      width,
      [...avatars.values()].reduce((sum, sizes) => sum + sizes.get(width), 0),
    ]),
  ),
});
