/**
 * 主题真源：白天 / 夜晚
 *
 * 静态站没有框架级状态共享，因此以 <html data-theme="day|night"> + localStorage
 * 为唯一真源，通过 window 自定义事件 broadcast 给各客户端脚本（背景 canvas、
 * 主题切换按钮、首页 Hero 等）。
 *
 * 默认白天：首屏前的防闪脚本（OfficialLayout 内联）与这里的 DEFAULT_THEME
 * 必须保持一致。
 */

export type ThemeName = "day" | "night";

export const DEFAULT_THEME: ThemeName = "day";
export const THEME_STORAGE_KEY = "likemi-theme";
export const THEME_EVENT = "likemi:theme";

/**
 * 各主题的浏览器地址栏配色。必须与 variables.css 里的两处声明逐字一致：
 *   day   → :root, [data-theme="day"] 的 --html-bg: #e8f0f9
 *   night → :root[data-theme="night"] 的 --html-bg: #050a14
 * 这里是有意的手工同步（Seo.astro 在构建期就要用到颜色值，读不到 CSS 变量），
 * 改动 variables.css 的 --html-bg 时务必同步这两行。
 */
export const THEME_COLORS: Record<ThemeName, string> = {
  day: "#e8f0f9",
  night: "#050a14",
};

export function isThemeName(value: unknown): value is ThemeName {
  return value === "day" || value === "night";
}

export function getTheme(): ThemeName {
  if (typeof document === "undefined") return DEFAULT_THEME;
  const attr = document.documentElement.dataset.theme;
  if (isThemeName(attr)) return attr;
  // 防闪脚本未生效时（被 CSP 拦截/异常）回退到持久化偏好，最后才用默认值——
  // 直接写死 "day" 会让改 DEFAULT_THEME 时这里不同步，也读不到用户已存的夜间偏好
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeName(stored)) return stored;
  } catch {
    /* 隐私模式下忽略 */
  }
  return DEFAULT_THEME;
}

export function applyTheme(theme: ThemeName): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* 隐私模式下忽略 */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLORS[theme]);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function toggleTheme(): ThemeName {
  const next: ThemeName = getTheme() === "night" ? "day" : "night";
  applyTheme(next);
  return next;
}

export function onThemeChange(cb: (theme: ThemeName) => void): () => void {
  // 与其他模块一样先做 SSR/非浏览器保护：本函数在预渲染与单测环境里也可能被执行
  if (typeof window === "undefined") return () => {};
  const handler = (event: Event): void => {
    const detail = (event as CustomEvent<ThemeName>).detail;
    cb(isThemeName(detail) ? detail : getTheme());
  };
  // 别的标签页改了主题时，本页只会收到 storage 事件；复用 applyTheme 走同一条广播路径
  const storageHandler = (event: StorageEvent): void => {
    if (event.key === THEME_STORAGE_KEY && isThemeName(event.newValue)) {
      applyTheme(event.newValue);
    }
  };
  window.addEventListener(THEME_EVENT, handler);
  window.addEventListener("storage", storageHandler);
  return () => {
    window.removeEventListener(THEME_EVENT, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
