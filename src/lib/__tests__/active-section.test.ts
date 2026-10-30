import { afterEach, expect, it, vi } from "vitest";
import { trackActiveSection } from "../active-section";

afterEach(() => vi.unstubAllGlobals());

it("滚动和跨屏跳转只查缓存；尺寸变化时重新测量并正确处理向上滚动", () => {
  const win = Object.assign(new EventTarget(), { scrollY: 0 });
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", { body: {} });
  let resize = (): void => {};
  let frame = (): void => {};
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe(): void {}
    },
  );
  const raf = vi.fn((callback: () => void) => {
    frame = callback;
    return 1;
  });
  vi.stubGlobal("requestAnimationFrame", raf);

  const tops = [200, 800, 1500];
  const elements = tops.map((_, index) => ({
    getBoundingClientRect: vi.fn(() => ({ top: tops[index] - win.scrollY })),
  }));
  const active = vi.fn();
  trackActiveSection(elements as unknown as HTMLElement[], 100, active);
  expect(active).toHaveBeenLastCalledWith(-1);
  const scroll = (y: number): void => {
    win.scrollY = y;
    win.dispatchEvent(new Event("scroll"));
  };
  scroll(100);
  expect(active).toHaveBeenLastCalledWith(0);
  scroll(2000);
  expect(active).toHaveBeenLastCalledWith(2);
  scroll(700);
  expect(active).toHaveBeenLastCalledWith(1);
  scroll(699);
  expect(active).toHaveBeenLastCalledWith(0);
  const calls = active.mock.calls.length;
  scroll(650);
  expect(active).toHaveBeenCalledTimes(calls);
  for (const el of elements)
    expect(el.getBoundingClientRect).toHaveBeenCalledTimes(1);

  // 图片/字体使后一段上移：同一帧内的多次尺寸通知合并成一次测量。
  tops[1] = 700;
  resize();
  resize();
  win.dispatchEvent(new Event("resize"));
  expect(raf).toHaveBeenCalledTimes(1);
  frame();
  expect(active).toHaveBeenLastCalledWith(1);
  for (const el of elements)
    expect(el.getBoundingClientRect).toHaveBeenCalledTimes(2);
});

it("文章在首个标题之前也高亮第一项，空目录不创建监听", () => {
  const win = Object.assign(new EventTarget(), { scrollY: 0 });
  const listen = vi.spyOn(win, "addEventListener");
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", { body: {} });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe(): void {}
    },
  );
  const active = vi.fn();
  trackActiveSection([], 96, active, 0);
  expect(listen).not.toHaveBeenCalled();
  const heading = { getBoundingClientRect: () => ({ top: 1000 }) };
  trackActiveSection([heading] as unknown as HTMLElement[], 96, active, 0);
  expect(active).toHaveBeenCalledExactlyOnceWith(0);
});
