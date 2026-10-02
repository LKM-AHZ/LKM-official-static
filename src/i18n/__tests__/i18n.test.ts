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

  it("英文品牌名使用 Phientist", () => {
    expect(t("en", "common.brand")).toBe("Phientist");
  });

  it("zh key 集合能覆盖结构文案命名规范", () => {
    expect(zh["common.nav_home"]).toBe("首页");
  });
});
