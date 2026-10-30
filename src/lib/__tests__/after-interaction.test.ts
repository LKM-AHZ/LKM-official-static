import { afterEach, expect, it, vi } from "vitest";
import { afterFirstInteraction } from "../after-interaction";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it("无交互不启动；多个装饰效果在首次交互后的空闲时各启动一次", () => {
  const callbacks: (() => void)[] = [];
  const idle = vi.fn((callback: () => void) => {
    callbacks.push(callback);
    return callbacks.length;
  });
  const win = Object.assign(new EventTarget(), { requestIdleCallback: idle });
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", { readyState: "complete" });
  const typing = vi.fn();
  const background = vi.fn();
  afterFirstInteraction(typing);
  afterFirstInteraction(background);
  win.dispatchEvent(new Event("load"));
  expect(idle).not.toHaveBeenCalled();
  win.dispatchEvent(new Event("pointermove"));
  win.dispatchEvent(new Event("pointerdown"));
  win.dispatchEvent(new Event("scroll"));
  expect(idle).toHaveBeenCalledTimes(2);
  expect(typing).not.toHaveBeenCalled();
  expect(background).not.toHaveBeenCalled();
  callbacks.forEach((callback) => callback());
  expect(typing).toHaveBeenCalledExactlyOnceWith();
  expect(background).toHaveBeenCalledExactlyOnceWith();
});

it("加载中收到交互会等待 load；不支持空闲回调时使用一次定时器", () => {
  vi.useFakeTimers();
  const win = new EventTarget();
  vi.stubGlobal("window", win);
  const doc = { readyState: "loading" };
  vi.stubGlobal("document", doc);
  const callback = vi.fn();
  afterFirstInteraction(callback);
  win.dispatchEvent(new Event("keydown"));
  vi.advanceTimersByTime(1000);
  expect(callback).not.toHaveBeenCalled();
  doc.readyState = "complete";
  win.dispatchEvent(new Event("load"));
  win.dispatchEvent(new Event("keydown"));
  vi.advanceTimersByTime(199);
  expect(callback).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(callback).toHaveBeenCalledExactlyOnceWith();
  vi.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalledTimes(1);
});
