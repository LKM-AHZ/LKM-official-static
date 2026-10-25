// src/i18n/__tests__/paths.test.ts
import { describe, expect, it } from "vitest";
import { applyBase, langUrl, removeBase, stripLangPrefix } from "../paths";

describe("部署前缀", () => {
  it("applyBase 给站点绝对路径补前缀", () => {
    expect(applyBase("/repo", "/zh/team")).toBe("/repo/zh/team");
    expect(applyBase("/repo", "/")).toBe("/repo/");
    expect(applyBase("/repo", "/images/covers/a.webp")).toBe(
      "/repo/images/covers/a.webp",
    );
  });

  it("applyBase 对已带前缀、外链、锚点、相对路径是幂等的", () => {
    expect(applyBase("/repo", "/repo/zh/team")).toBe("/repo/zh/team");
    expect(applyBase("/repo", "/repo")).toBe("/repo");
    expect(applyBase("/repo", "https://example.com/x")).toBe(
      "https://example.com/x",
    );
    expect(applyBase("/repo", "#faq")).toBe("#faq");
    expect(applyBase("/repo", "//cdn.example.com/x.js")).toBe(
      "//cdn.example.com/x.js",
    );
    expect(applyBase("/repo", "relative/path")).toBe("relative/path");
  });

  it("base 为空（域根部署）时 applyBase 不改动任何路径", () => {
    expect(applyBase("", "/zh/team")).toBe("/zh/team");
  });

  it("removeBase 摘掉前缀，并把刚好等于前缀的路径还原成根", () => {
    expect(removeBase("/repo", "/repo/zh/team")).toBe("/zh/team");
    expect(removeBase("/repo", "/repo")).toBe("/");
    expect(removeBase("/repo", "/repo.png")).toBe("/repo.png");
    expect(removeBase("/repo", "/zh")).toBe("/zh");
    expect(removeBase("", "/zh")).toBe("/zh");
  });

  it("前缀按段边界匹配：/repo 不能命中 /repository", () => {
    expect(removeBase("/repo", "/repository/x")).toBe("/repository/x");
  });
});

describe("langUrl", () => {
  // vitest 下 BASE_URL 为 "/"，这里覆盖的是域根部署的既有行为
  it("站内路径加语言前缀", () => {
    expect(langUrl("zh", "/team")).toBe("/zh/team");
    expect(langUrl("en", "team")).toBe("/en/team");
    expect(langUrl("zh", "/")).toBe("/zh");
  });

  it("外链、锚点原样返回", () => {
    expect(langUrl("zh", "https://example.com")).toBe("https://example.com");
    expect(langUrl("zh", "mailto:a@b.c")).toBe("mailto:a@b.c");
    expect(langUrl("zh", "#timeline")).toBe("#timeline");
  });

  it("静态资源不加语言前缀", () => {
    expect(langUrl("zh", "/images/covers/a.webp")).toBe(
      "/images/covers/a.webp",
    );
    expect(langUrl("zh", "/_astro/x.css")).toBe("/_astro/x.css");
  });

  it("未支持的语言回退默认语言，不拼出 /undefined/", () => {
    expect(langUrl("de", "/team")).toBe("/zh/team");
  });
});

describe("stripLangPrefix", () => {
  it("剥掉语言前缀得到语言中立路径", () => {
    expect(stripLangPrefix("/zh/team")).toBe("/team");
    expect(stripLangPrefix("/en")).toBe("/");
    expect(stripLangPrefix("/zh/")).toBe("/");
    expect(stripLangPrefix("/404")).toBe("/404");
  });
});
