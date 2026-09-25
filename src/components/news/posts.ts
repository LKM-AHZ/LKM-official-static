// src/components/news/posts.ts —— 资讯文章的选择逻辑。
// /news 索引页与首页「最近更新」共用同一份过滤、排序与 slug 解析，
// 免得两处各写一份后过滤条件或 id 解析悄悄漂移。
import type { CollectionEntry } from "astro:content";

export type NewsPost = CollectionEntry<"docs">;

/**
 * 取指定语言下 category === "news" 的文章，按发布时间倒序。
 * limit 用于首页只取最新几篇；不传则返回全部。
 */
export function getNewsPosts(
  docs: NewsPost[],
  lang: string,
  limit?: number,
): NewsPost[] {
  const posts = docs
    .filter(
      (doc) => doc.id.startsWith(`${lang}/`) && doc.data.category === "news",
    )
    .sort(
      (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
    );
  return limit === undefined ? posts : posts.slice(0, limit);
}

/** 集合 id 形如 "zh/news-site-launch"，去掉语言前缀即路由 slug。 */
export function postSlug(doc: NewsPost): string {
  return doc.id.split("/").slice(1).join("/");
}
