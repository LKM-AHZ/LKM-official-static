/**
 * 文章列表/详情的日期与阅读时长格式化。（离线确定性，不依赖宿主时区/ICU。）
 */

/** 英文月份名（与下方 formatDate 的 en 分支配合，输出 "August 1, 2026"） */
const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** 日期文案：zh 为 "2026 年 8 月 1 日"，en 为 "August 1, 2026"；非法日期返回空串 */
export function formatDate(d: Date, lang: "zh" | "en"): string {
  // 非法日期不能渲染成 "NaN 年 NaN 月 NaN 日" 这种面向用户的乱码
  if (Number.isNaN(d.getTime())) return "";
  // 调用方传入的是 UTC 时刻（content 集合的 publishDate 由 `YYYY-MM-DD` 解析而来，
  // 页面别处也用 toISOString() 取日期），故必须用 UTC getter：本地 getter 会让
  // UTC- 时区的宿主机/CI 把日期显示成前一天，破坏本文件声称的离线确定性。
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  if (lang === "en") {
    return `${EN_MONTHS[m - 1]} ${day}, ${y}`; // August 1, 2026
  }
  return `${y} 年 ${m} 月 ${day} 日`;
}

/**
 * 粗略阅读时长（分钟）：中文字符 /350 + 英文单词 /220，四舍五入，至少 1。
 * （双语文章按两部分相加估算，故不是纯中文 350、纯英文 200 的简单切分。）
 */
export function readingMinutes(markdown: string): number {
  const chars = (markdown.match(/[\u3400-\u9fff\u3040-\u30ff]/g) ?? []).length;
  const words = (markdown.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) ?? []).length;
  return Math.max(1, Math.round(chars / 350 + words / 220));
}

/** 由标题得到稳定色相（无封面图时的确定性配色）。 */
function hueFromTitle(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++) {
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  }
  return h % 360;
}

/**
 * 无真实封面时的渐变“占位封面色块”：主 + 补色两档 HSL。
 * 同一标题永远同色（列表刷新稳定），不同文章互相错开。
 */
export function coverGradient(title: string): string {
  const base = hueFromTitle(title);
  return `linear-gradient(135deg, hsl(${base} 74% 55%), hsl(${(base + 48) % 360} 68% 47%))`;
}
