// src/i18n/__tests__/i18n.test.ts
import { describe, expect, it } from "vitest";
import { SUPPORTED_LANGS, t } from "../index";
import { zh } from "../zh";

describe("i18n", () => {
  it("支持 zh/en 两种语言", () => {
    expect(SUPPORTED_LANGS).toEqual(["zh", "en"]);
  });

  it("t() 能取到中文 key 值", () => {
    expect(t("zh", "common.brand")).toBe("理科迷");
  });

  it("en 缺 key 时回退中文（阶段一英文占位）", () => {
    // 故意：若 en.ts 未定义某 key，t() 应回退 zh 而非抛错
    expect(t("en", "common.brand")).toMatch(/理科迷|LiKeMi/);
  });

  it("zh key 集合能覆盖结构文案命名规范", () => {
    expect(zh["common.nav_home"]).toBe("首页");
  });
});
