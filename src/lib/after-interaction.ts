/** 装饰效果等首次交互与页面加载完成后，在空闲时启动，避免与首屏内容竞争。 */
export function afterFirstInteraction(callback: () => void): void {
  const events = ["pointerdown", "pointermove", "keydown", "scroll"] as const;
  const schedule = (): void => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 200);
    }
  };
  const start = (): void => {
    for (const event of events) window.removeEventListener(event, start);
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
  };
  for (const event of events) {
    window.addEventListener(event, start, { once: true, passive: true });
  }
}
