// src/i18n/paths.ts —— [lang] 动态段静态路径 + 语言前缀 URL 辅助
import type { GetStaticPaths } from "astro";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "./index";
import type { Lang } from "./index";

/** [lang] 段静态路径：为每个语言生成一条静态路由，让 output:static 可构建。 */
export const getStaticPathsForLang: GetStaticPaths = () =>
  SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));

/** 语言前缀：由 SUPPORTED_LANGS 生成，免得各处手写 /(zh|en) 与配置脱节。 */
const LANG_PREFIX_RE = new RegExp(`^/(?:${SUPPORTED_LANGS.join("|")})(?=/|$)`);

/** docs 集合的站内路由前缀。 */
const DOCS_ROUTE = "/docs";

/**
 * docs 条目的 slug：entry id 形如 "<lang>/<slug>"，需剥掉语言段。
 * id 不含 "/" 时原样返回，避免拼出空 slug 的坏链接（如 /docs/）。
 */
export function docSlug(entryId: string): string {
  const parts = entryId.split("/");
  return (parts.length > 1 ? parts.slice(1) : parts).join("/");
}

/** docs 条目的站内路径（不含语言前缀，交给 langUrl 处理）。 */
export function docHref(entryId: string): string {
  const slug = docSlug(entryId);
  return slug ? `${DOCS_ROUTE}/${slug}` : DOCS_ROUTE;
}

/** 去掉 URL 里的语言前缀，得到语言中立的站内路径（/zh/team → /team，/zh → /）。 */
export function stripLangPrefix(pathname: string): string {
  return pathname.replace(LANG_PREFIX_RE, "") || "/";
}

/** 外部引用：带 scheme(mailto:、tel:、data:…)或协议相对(//cdn.example.com) 的都不是站内路径。 */
const EXTERNAL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** 构建产物里的静态资源目录：不加语言前缀（按段边界匹配，/imagesFoo.png 不落入）。 */
const ASSET_PREFIXES = ["/images", "/_astro"];

function isAssetPath(path: string): boolean {
  return ASSET_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * 把内部站点路径(如 /team)转为当前语言带前缀的绝对路径(如 /zh/team)。
 * 锚点 / 外链 / 静态资源(/_astro、/images) 原样返回，不加前缀；
 * 语言不在支持列表内时回退默认语言，避免拼出 /undefined/team 这类坏链接。
 */
export function langUrl(lang: string, path: string): string {
  if (
    !path ||
    path.startsWith("#") ||
    EXTERNAL_RE.test(path) ||
    isAssetPath(path)
  ) {
    return path; // 外链、锚点、资源路径不加前缀
  }
  const safeLang = (SUPPORTED_LANGS as readonly string[]).includes(lang)
    ? (lang as Lang)
    : DEFAULT_LANG;
  // 去掉多余前导斜杠后统一拼："team" 也要得到 /zh/team 而不是 /zhteam
  const p = path.replace(/^\/+/, "");
  return p ? `/${safeLang}/${p}` : `/${safeLang}`;
}
