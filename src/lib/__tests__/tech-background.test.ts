import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { startTechBackground } from "../tech-background";

let win: EventTarget & {
  location: { search: string };
  innerWidth: number;
  innerHeight: number;
  devicePixelRatio: number;
};
let doc: EventTarget & { hidden: boolean };
let canvas: HTMLCanvasElement;
let gl: WebGL2RenderingContext;

beforeEach(() => {
  win = Object.assign(new EventTarget(), {
    location: { search: "" },
    innerWidth: 3840,
    innerHeight: 2160,
    devicePixelRatio: 2,
    scrollY: 0,
    matchMedia: vi.fn(() => ({ matches: false })),
  });
  doc = Object.assign(new EventTarget(), {
    hidden: false,
    documentElement: {
      dataset: { theme: "day" },
      scrollHeight: 8000,
      style: { setProperty: vi.fn() },
    },
    body: {},
  });
  // 无 GPU 的单元测试只模拟驱动接口；仍运行实际初始化和帧调度逻辑。
  gl = new Proxy(
    {
      getExtension: vi.fn(() => null),
      getParameter: vi.fn(() => "hardware renderer"),
    } as unknown as WebGL2RenderingContext,
    {
      get(target, key) {
        if (!(key in target)) {
          Reflect.set(
            target,
            key,
            vi.fn(() => ({})),
          );
        }
        return Reflect.get(target, key);
      },
    },
  );
  canvas = Object.assign(new EventTarget(), {
    width: 0,
    height: 0,
    style: {},
    getContext: vi.fn(() => gl),
    remove: vi.fn(),
  }) as unknown as HTMLCanvasElement;
  vi.stubGlobal("window", win);
  vi.stubGlobal("document", doc);
  vi.stubGlobal(
    "requestAnimationFrame",
    vi.fn(() => 1),
  );
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe(): void {}
      disconnect(): void {}
    },
  );
});

afterEach(() => vi.unstubAllGlobals());

it("只创建一个 WebGL 上下文，并把 4K 高 DPR 画布限制在 200 万像素内", () => {
  startTechBackground(canvas);
  expect(canvas.getContext).toHaveBeenCalledExactlyOnceWith("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  expect(canvas.width * canvas.height).toBeLessThanOrEqual(2_000_000);
  expect(canvas.width).toBeGreaterThan(0);
});

it("软件渲染器直接回退，不编译着色器", () => {
  vi.mocked(gl.getParameter).mockReturnValue("Google SwiftShader");
  startTechBackground(canvas);
  expect(canvas.remove).toHaveBeenCalledOnce();
  expect(gl.createShader).not.toHaveBeenCalled();
});

it("后台不启动帧循环，恢复可见时只启动一次，上下文丢失后不再重启", () => {
  doc.hidden = true;
  startTechBackground(canvas);
  expect(requestAnimationFrame).not.toHaveBeenCalled();
  doc.hidden = false;
  doc.dispatchEvent(new Event("visibilitychange"));
  doc.dispatchEvent(new Event("visibilitychange"));
  expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }));
  doc.hidden = true;
  doc.dispatchEvent(new Event("visibilitychange"));
  doc.hidden = false;
  doc.dispatchEvent(new Event("visibilitychange"));
  expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  expect(canvas.style.display).toBe("none");
});
