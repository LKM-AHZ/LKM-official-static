import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const FONT_DIR = path.join(process.cwd(), "public/fonts");

describe("fonts", () => {
  it("自托管 woff2 字体文件存在且格式正确", () => {
    for (const file of [
      "inter-latin-var.woff2",
      "jetbrains-mono-latin-var.woff2",
    ]) {
      const buffer = fs.readFileSync(path.join(FONT_DIR, file));
      expect(buffer.subarray(0, 4).toString("latin1")).toBe("wOF2");
      expect(buffer.length).toBeGreaterThan(10_000);
    }
  });

  it("OFL 许可证与字体一起发布", () => {
    const license = fs.readFileSync(path.join(FONT_DIR, "OFL.txt"), "utf8");
    expect(license).toContain("SIL OPEN FONT LICENSE");
    expect(license).toContain("JetBrains Mono");
  });
});
