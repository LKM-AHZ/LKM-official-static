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

/** 各主题的浏览器地址栏配色（与 --html-bg 一致） */
export const THEME_COLORS: Record<ThemeName, string> = {
  day: "#e8f0f9",
  night: "#050a14",
};

export function isThemeName(value: unknown): value is ThemeName {
  return value === "day" || value === "night";
}

export function getTheme(): ThemeName {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.dataset.theme === "night" ? "night" : "day";
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
  const handler = (event: Event): void => {
    const detail = (event as CustomEvent<ThemeName>).detail;
    cb(isThemeName(detail) ? detail : getTheme());
  };
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}
