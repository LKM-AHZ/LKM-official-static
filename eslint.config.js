import astroEslintParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        // 传已导入的解析器对象而非包名字符串：字符串在运行期解析，装不上时会静默降级
        parser: typescriptParser,
        extraFileExtensions: [".astro"],
      },
    },
  },
  {
    // 未使用变量规则对全部源码类型统一配置（含 `<script>` 的虚拟文件名），
    // 只保留一份选项，避免两处各写一遍后漂移
    files: ["**/*.{js,jsx,astro,ts,tsx}", "**/*.astro/*.js"],
    rules: {
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    // `<script>` 标签内的脚本被分配带 `.js` 扩展名的虚拟文件名。
    files: ["**/*.{ts,tsx}", "**/*.astro/*.js"],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    // 仅对纯 TypeScript 文件强制返回类型标注；排除 .astro 相关虚拟文件（ts(8010)）。
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/*.astro/**"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
    },
  },
  {
    // Astro 组件里的 <script> 会被当成虚拟文件（Foo.astro/0.ts|js）检查，给它们强制
    // 返回类型标注会把非法 TS/JS 打进页面（ts(8010)），故单独豁免。上面的
    // `**/*.astro` 规则匹配不到这些虚拟文件——它们是 .astro 目录下的子文件，
    // 必须用 `**/*.astro/*` 这一层才命中；本块同时用 ignores 兜住那条豁免被收窄的情况。
    files: ["**/*.astro/*.{ts,tsx,js}"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
  {
    ignores: [
      "dist",
      "node_modules",
      ".github",
      ".astro",
      ".claude",
      ".superpowers",
      "pnpm-lock.yaml",
    ],
  },
];
