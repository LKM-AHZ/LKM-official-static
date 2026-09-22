// src/i18n/index.ts —— i18n 工具：语言列表、类型、t()、pickByLocale
import { zh } from "./zh";
import type { Zh } from "./zh";
import { en } from "./en";

export const SUPPORTED_LANGS = ["zh", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
/** 默认语言：与 astro.config.ts 的 i18n.defaultLocale 保持一致，供 x-default 等场景引用。 */
export const DEFAULT_LANG: Lang = "zh";
export type TranslationKey = keyof Zh;

const dicts: Record<Lang, Partial<Zh>> = { zh, en };

/**
 * 取翻译文本。
 */
export function t(lang: string, key: TranslationKey): string {
  const source = dicts[lang as Lang] ?? zh;
  return (source[key] as string | undefined) ?? zh[key];
}

/**
 * 二元语言数据选择器：locale === "en" 取英文，否则取中文。
 * 用于 data 文件。
 */
export function pickByLocale<T>(
  locale: string | undefined,
  zhData: T,
  enData: T,
): T {
  return locale === "en" ? enData : zhData;
}
