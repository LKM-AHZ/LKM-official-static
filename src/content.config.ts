// src/content.config.ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  // 同时收 .mdx：否则新增的 mdx 文档会被静默忽略（无条目、无告警）
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    // 文章分类 / 标签：/news 文章列表按 category === "news" 严格比对，用枚举把写错大小写
    // 或拼错的分类变成构建期报错，而不是文章被悄悄漏掉
    category: z.enum(["news"]).optional(),
    tags: z.array(z.string()).optional(),
    // 文章配图（外部图源 URL；用于列表封面色卡与详情页 hero。）
    image: z.string().url().optional(),
    // 可选：仅作兜底标识。实际语言由 collection entry 的路径前缀 (<lang>/) 推导，故不再
    // 补默认值 "zh"（否则 en 目录下漏写 lang 的条目会被当成中文），并用枚举让 lang: EN
    // 这类写法直接构建失败。
    lang: z.enum(["zh", "en"]).optional(),
  }),
});

export const collections = { docs };
