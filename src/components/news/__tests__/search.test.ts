// src/components/news/__tests__/search.test.ts
import { describe, expect, it } from "vitest";
import { buildSearchText, matchesQuery } from "../search";

describe("buildSearchText", () => {
  it("丢弃空值并统一小写", () => {
    expect(buildSearchText(["Hello", undefined, "", "World"])).toBe(
      "hello world",
    );
  });

  it("全是空值时得到空串", () => {
    expect(buildSearchText([undefined, ""])).toBe("");
  });

  it("保留中文原样", () => {
    expect(buildSearchText(["理科迷", undefined])).toBe("理科迷");
  });
});

describe("matchesQuery", () => {
  it("空查询与纯空白查询都命中（清空输入应恢复全部卡片）", () => {
    expect(matchesQuery(buildSearchText(["任意内容"]), "")).toBe(true);
    expect(matchesQuery(buildSearchText(["任意内容"]), "   ")).toBe(true);
  });

  it("大小写不敏感地做子串匹配", () => {
    expect(matchesQuery(buildSearchText(["官网正式上线"]), "官网")).toBe(true);
    expect(matchesQuery(buildSearchText(["Site Launch"]), "launch")).toBe(true);
    expect(matchesQuery(buildSearchText(["Site Launch"]), "LAUNCH")).toBe(true);
  });

  it("未命中返回 false", () => {
    expect(matchesQuery(buildSearchText(["官网正式上线"]), "群组")).toBe(false);
  });

  it("查询词两端空白被忽略", () => {
    expect(matchesQuery(buildSearchText(["Site Launch"]), "  launch  ")).toBe(
      true,
    );
  });
});
