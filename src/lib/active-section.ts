/** 缓存文档坐标；滚动只做二分查找，字体、图片或窗口尺寸变化后才重新量布局。 */
export function trackActiveSection(
  elements: HTMLElement[],
  offset: number,
  onChange: (index: number) => void,
  initialIndex = -1,
): void {
  if (elements.length === 0) return;
  let tops: number[] = [];
  let active: number | undefined;
  let pending = false;

  const pick = (): void => {
    const y = window.scrollY + offset;
    let low = 0;
    let high = tops.length;
    while (low < high) {
      const mid = (low + high) >>> 1;
      if (tops[mid] <= y) low = mid + 1;
      else high = mid;
    }
    const index = Math.max(initialIndex, low - 1);
    if (index === active) return;
    active = index;
    onChange(index);
  };

  const measure = (): void => {
    pending = false;
    const y = window.scrollY;
    tops = elements.map((element) => element.getBoundingClientRect().top + y);
    pick();
  };
  const refresh = (): void => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(measure);
  };

  measure();
  new ResizeObserver(refresh).observe(document.body);
  window.addEventListener("resize", refresh, { passive: true });
  window.addEventListener("scroll", pick, { passive: true });
  void document.fonts?.ready.then(refresh);
}
