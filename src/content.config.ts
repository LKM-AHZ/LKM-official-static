// src/content.config.ts
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const docs = defineCollection({
  // 同时收 .mdx：否则新增的 mdx 文档会被静默忽略（无条目、无告警）
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/docs" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
    // 文章分类 / 标签：/news 的文章页按 category 分到不同标签页，用枚举把写错大小写
    // 或拼错的分类变成构建期报错，而不是文章被悄悄漏掉。
    // 不填表示官网与爱好者社区文章；news 进新闻资讯，project / studio 进对应标签页。
    category: z.enum(["news", "project", "studio"]).optional(),
    tags: z.array(z.string()).optional(),
    // 文章配图：站内绝对路径（/images/covers/<slug>.webp）或外部 http(s) URL。
    // 站内图随构建产物一起部署，加载不受第三方图床的 302/限流/网络影响；
    // 外部 URL 仅作兼容，新增内容应优先使用站内封面。
    image: z
      .string()
      .refine(
        (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
        "image 必须是以 / 开头的站内路径或 http(s) URL",
      )
      .optional(),
    // 可选：仅作兜底标识。实际语言由 collection entry 的路径前缀 (<lang>/) 推导，故不再
    // 补默认值 "zh"（否则 en 目录下漏写 lang 的条目会被当成中文），并用枚举让 lang: EN
    // 这类写法直接构建失败。
    lang: z.enum(["zh", "en"]).optional(),
  }),
});

export const collections = { docs };
