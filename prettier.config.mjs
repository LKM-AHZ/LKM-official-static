/**
 * Prettier 3 不会自动推断 `.astro` 的解析器：不声明插件时，
 * `prettier --check .` 会对每个 .astro 文件报 "No parser could be inferred"。
 * 这里显式注册官方 Astro 插件，让 check:prettier 真正覆盖 .astro 文件。
 *
 * @type {import("prettier").Config}
 */
export default {
  plugins: ["prettier-plugin-astro"],
};
