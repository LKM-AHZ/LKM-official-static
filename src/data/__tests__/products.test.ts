import { describe, expect, it } from "vitest";
import { productCategories, products } from "../products";

describe("data/products", () => {
  it("产品 id 唯一", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("每个产品都归入已声明的分类", () => {
    const categoryIds = new Set(productCategories.map((c) => c.id));
    for (const product of products) {
      expect(categoryIds.has(product.category)).toBe(true);
    }
  });

  it("双语名称、摘要与承接功能均已填写", () => {
    for (const product of products) {
      expect(product.name.zh.trim().length).toBeGreaterThan(0);
      expect(product.name.en.trim().length).toBeGreaterThan(0);
      expect(product.summary.zh.trim().length).toBeGreaterThan(0);
      expect(product.summary.en.trim().length).toBeGreaterThan(0);
      expect(product.features.zh.length).toBeGreaterThan(0);
      expect(product.features.en.length).toBeGreaterThan(0);
      if (product.href) expect(product.href.startsWith("/")).toBe(true);
    }
  });

  it("工作室都有二级标签，产品都归入线上平台类", () => {
    for (const product of products) {
      if (product.type === "studio") {
        expect(["tech", "education"]).toContain(product.studioFocus);
      }
      if (product.type === "product") {
        expect(product.productKind).toBe("online");
      }
    }
  });
});
