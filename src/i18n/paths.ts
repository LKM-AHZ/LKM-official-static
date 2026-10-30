// src/i18n/paths.ts —— [lang] 动态段静态路径 + 语言前缀 URL 辅助
import type { GetStaticPaths } from "astro";
import { DEFAULT_LANG, SUPPORTED_LANGS } from "./index";
import type { Lang } from "./index";

/** [lang] 段静态路径：为每个语言生成一条静态路由，让 output:static 可构建。 */
export const getStaticPathsForLang: GetStaticPaths = () =>
  SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));

/** 语言前缀：由 SUPPORTED_LANGS 生成，免得各处手写 /(zh|en) 与配置脱节。 */
const LANG_PREFIX_RE = new RegExp(`^/(?:${SUPPORTED_LANGS.join("|")})(?=/|$)`);

/**
 * 部署前缀（astro.config.ts 的 base）：自建 nginx 部署在域名根时为 ""，
 * GitHub Pages 的项目页为 "/<仓库名>"。BASE_URL 由 Vite 注入、恒以 "/" 结尾。
 */
const BASE_URL = import.meta.env?.BASE_URL ?? "/";
export const BASE = BASE_URL.replace(/\/+$/, ""); // "" 表示域名根

/** 给站点绝对路径挂上部署前缀；已带前缀时幂等返回，非绝对路径（相对/外链/协议相对 //）不动。 */
export function applyBase(base: string, path: string): string {
  // "//host/x" 是协议相对的外链，不是站内路径
  if (!base || !path.startsWith("/") || path.startsWith("//")) return path;
  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path}`;
}

/** 摘掉部署前缀：/repo/zh → /zh；未带前缀时原样返回（/repo 这类刚好等于前缀的落成 /）。 */
export function removeBase(base: string, path: string): string {
  if (!base) return path;
  if (path === base) return "/";
  if (path.startsWith(`${base}/`)) return path.slice(base.length);
  return path;
}

export const withBase = (path: string): string => applyBase(BASE, path);
export const stripBase = (path: string): string => removeBase(BASE, path);

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

/**
 * 去掉 URL 里的部署前缀与语言前缀，得到语言中立的站内路径
 * （/repo/zh/team → /team，/repo/zh → /）。传进来的通常是 Astro.url.pathname，
 * 它已经带上了部署前缀，所以这里必须先摘前缀再比语言。
 */
export function stripLangPrefix(pathname: string): string {
  return stripBase(pathname).replace(LANG_PREFIX_RE, "") || "/";
}

/** 外部引用：带 scheme(mailto:、tel:、data:…)或协议相对(//cdn.example.com) 的都不是站内路径。 */
const EXTERNAL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** 目录式页面的末尾斜杠放在查询串/锚点之前；文件、外链和纯锚点保持原样。 */
export function withTrailingSlash(url: string): string {
  if (EXTERNAL_RE.test(url)) return url;
  const end = url.search(/[?#]/);
  const path = end < 0 ? url : url.slice(0, end);
  if (!path || path.endsWith("/") || /\.[^/]+$/.test(path)) return url;
  return `${path}/${end < 0 ? "" : url.slice(end)}`;
}

/** 构建产物里的静态资源目录：不加语言前缀（按段边界匹配，/imagesFoo.png 不落入）。 */
const ASSET_PREFIXES = ["/images", "/_astro"];

function isAssetPath(path: string): boolean {
  return ASSET_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

/**
 * 把内部站点路径(如 /team)转为当前语言、带部署前缀的绝对路径
 * （域名根下是 /zh/team/，GitHub Pages 项目页下是 /repo/zh/team/）。
 * 锚点 / 外链原样返回；静态资源(/_astro、/images)不加语言前缀，但仍要带部署前缀；
 * 语言不在支持列表内时回退默认语言，避免拼出 /undefined/team 这类坏链接。
 */
export function langUrl(lang: string, path: string): string {
  if (!path || path.startsWith("#") || EXTERNAL_RE.test(path)) {
    return path; // 外链、锚点原样返回
  }
  // 幂等：调用方可能传进来已带部署前缀的路径（如 Astro.url.pathname）
  const neutral = stripBase(path);
  if (isAssetPath(neutral)) {
    return withBase(neutral); // 资源路径不加语言前缀，但要带部署前缀
  }
  const safeLang = (SUPPORTED_LANGS as readonly string[]).includes(lang)
    ? (lang as Lang)
    : DEFAULT_LANG;
  // 去掉多余前导斜杠后统一拼："team" 也要得到 /zh/team 而不是 /zhteam
  const p = neutral.replace(/^\/+/, "");
  return withBase(withTrailingSlash(p ? `/${safeLang}/${p}` : `/${safeLang}`));
}
