// src/data/gallery.ts —— 首页「科学影像」区取数
// 现阶段复用 docs 集合里带封面图的文章（与新闻列表同一内容源），
// 组件层不关心数据来自哪里，后续接入真实影像只需替换这里的数据来源。
import { formatDate } from "../components/news/format";

export interface GalleryItem {
  /** 列表缩略图 */
  src: string;
  /** 灯箱大图（缺省时回退到 src） */
  full: string;
  title: string;
  caption: string;
  /** 站内路径（不含语言前缀），点击标题可跳转原文 */
  href: string;
}

/** docs 集合条目的最小结构（只声明本模块用到的字段） */
export interface GalleryDoc {
  id: string;
  data: {
    title: string;
    publishDate: Date;
    lang?: string;
    image?: string;
  };
}

/**
 * 取某语言下带封面图的文章，按发布时间倒序，构成影像区条目。
 */
export function buildGalleryItems(
  docs: GalleryDoc[],
  lang: "zh" | "en",
  limit = 6,
): GalleryItem[] {
  return docs
    .filter(
      (doc) => (doc.data.lang ?? "zh") === lang && Boolean(doc.data.image),
    )
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
    .slice(0, limit)
    .map((doc) => {
      const src = doc.data.image as string;
      return {
        src,
        full: src,
        title: doc.data.title,
        caption: formatDate(doc.data.publishDate, lang),
        href: `/docs/${doc.id.split("/").slice(1).join("/")}`,
      };
    });
}
