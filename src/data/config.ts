export const SITE_NAME = "理科迷";
export const SITE_TITLE = SITE_NAME;
// 中文兜底描述（与 i18n 的 seo.home / common.site.description 同源改写）。
// Seo.astro 已改为按 locale 取 common.site.description，故这里只服务于
// SITE_NAME 之外需要「不翻译」的场合与数据层测试，勿再单独用于页面。
export const SITE_DESCRIPTION =
  "理科迷 (LKM) — 创立于 2014 年的科技爱好者社区。让科学回归每一个人。";
