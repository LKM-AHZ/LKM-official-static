// src/components/news/search.ts —— 文章检索的纯函数。
// 检索文本随卡片一起渲染进 DOM（见 NewsCard 的 data-search-text），客户端只做
// 子串比对，不另存一份数据。抽成纯函数是为了在 vitest 的 node 环境（无 jsdom）下可测。

/** 把若干片段拼成检索用的归一化文本：丢弃空值、统一小写、空格分隔。 */
export function buildSearchText(parts: Array<string | undefined>): string {
  return parts
    .filter((part): part is string => typeof part === "string" && part !== "")
    .join(" ")
    .toLowerCase();
}

/**
 * 判断检索文本是否命中查询词。
 * 空查询（未输入或只有空白）一律视为命中，这样清空输入框能恢复全部卡片。
 */
export function matchesQuery(haystack: string, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === "") return true;
  return haystack.toLowerCase().includes(needle);
}
