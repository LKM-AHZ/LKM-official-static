/**
 * 文章封面图的派生路径。
 *
 * 封面统一放在 `public/images/covers/`：`<name>.webp` 为 1200w 主图，
 * `<name>-800w.webp` 为列表/移动端的 800w 缩略图。缩略图由构建前手工生成，
 * 命名约定集中在这里，避免各组件各写一份字符串替换逻辑。
 */

/** 本地封面图的 800w 缩略图；非 covers 目录或外部 URL 原样返回。 */
export function coverThumb(src: string): string {
  if (!src.startsWith("/images/covers/") || !src.endsWith(".webp")) {
    return src;
  }
  // 已经是缩略图时不再追加后缀，防止重复调用变成 `-800w-800w.webp`
  if (src.endsWith("-800w.webp")) {
    return src;
  }
  return src.replace(/\.webp$/, "-800w.webp");
}
