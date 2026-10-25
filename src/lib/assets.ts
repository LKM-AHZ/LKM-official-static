/**
 * public/ 下静态资源的 URL。
 *
 * 这些文件在构建时原样复制到输出根目录，所以路径里必须带上部署前缀
 * （astro.config.ts 的 base）：自建 nginx 部署在域名根时前缀为空，
 * GitHub Pages 项目页则是 `/<仓库名>`。写死 `/images/...` 会让子路径部署整站 404。
 */
import { withBase } from "../i18n/paths";

/** 外链、协议相对、data: 等非站内地址：不做前缀处理。 */
const EXTERNAL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** 站点绝对路径（/ 开头）补上部署前缀；外链、data URI、相对路径原样返回。 */
export function publicUrl(path: string): string {
  if (!path || EXTERNAL_RE.test(path)) return path;
  return withBase(path);
}
