// src/components/news/tags.ts —— 标签筛选的纯函数。
// 与 search.ts 同款：筛选栏与卡片在构建期把数据渲染进 DOM，客户端只做比对，
// 不另存一份数据；抽成纯函数是为了在 vitest 的 node 环境（无 jsdom）下可测。

/** 标签及其在文章集合中的出现次数。 */
export interface TagCount {
  tag: string;
  count: number;
}

/**
 * 汇总文章标签：去重、统计出现次数，按次数降序、同次数按名称升序。
 * 次数降序让筛选栏把高频标签排在前面；名称升序保证同频标签顺序稳定
 * （不依赖输入顺序，避免同一份数据每次构建排出不同结果）。
 * localeCompare 在 node 与浏览器对中英文都给出稳定顺序。
 */
export function collectTags(
  posts: Array<{ data: { tags?: string[] } }>,
): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * 判断文章的标签集合是否命中当前筛选标签。
 * 空标签（未筛选或「全部」）恒真，这样清空筛选能恢复全部卡片。
 */
export function matchesTag(tags: string[], activeTag: string): boolean {
  if (activeTag === "") return true;
  return tags.includes(activeTag);
}

/**
 * 从 location.search（如 `?tag=%E7%A4%BE%E5%8C%BA`）解析出当前筛选标签。
 * 缺失或解析失败返回 ""，交给调用方按「全部」处理；只认单个 tag 参数。
 */
export function pickTagFromSearch(search: string): string {
  const value = new URLSearchParams(search).get("tag");
  return value ?? "";
}
