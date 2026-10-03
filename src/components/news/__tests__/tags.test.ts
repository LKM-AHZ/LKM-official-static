// src/components/news/__tests__/tags.test.ts
import { describe, expect, it } from "vitest";
import { collectTags, matchesTag, pickTagFromSearch } from "../tags";

const post = (tags?: string[]): { data: { tags?: string[] } } => ({
  data: { tags },
});

describe("collectTags", () => {
  it("去重并统计出现次数", () => {
    const out = collectTags([
      post(["公告", "官网"]),
      post(["公告"]),
      post(["活动"]),
    ]);
    expect(out).toEqual([
      { tag: "公告", count: 2 },
      { tag: "官网", count: 1 },
      { tag: "活动", count: 1 },
    ]);
  });

  it("次数相同时按名称升序，且顺序与输入顺序无关", () => {
    const out = collectTags([post(["b", "a"]), post(["c"])]);
    expect(out.map((t) => t.tag)).toEqual(["a", "b", "c"]);
  });

  it("无标签文章与空集合都得到空数组", () => {
    expect(collectTags([post(), post(undefined)])).toEqual([]);
    expect(collectTags([])).toEqual([]);
  });
});

describe("matchesTag", () => {
  it("空筛选标签恒真（清空筛选恢复全部卡片）", () => {
    expect(matchesTag(["公告"], "")).toBe(true);
    expect(matchesTag([], "")).toBe(true);
  });

  it("命中包含该标签的文章，未包含返回 false", () => {
    expect(matchesTag(["公告", "官网"], "官网")).toBe(true);
    expect(matchesTag(["公告"], "官网")).toBe(false);
    expect(matchesTag([], "公告")).toBe(false);
  });
});

describe("pickTagFromSearch", () => {
  it("解析 URL 编码的 tag 参数", () => {
    expect(pickTagFromSearch("?tag=%E7%A4%BE%E5%8C%BA")).toBe("社区");
  });

  it("缺失或空值返回空串", () => {
    expect(pickTagFromSearch("")).toBe("");
    expect(pickTagFromSearch("?tag=")).toBe("");
    expect(pickTagFromSearch("?other=x")).toBe("");
  });
});
