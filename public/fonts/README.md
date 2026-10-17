# 自托管字体

| 文件                             | 字体           | 用途                      | 来源                                                             |
| -------------------------------- | -------------- | ------------------------- | ---------------------------------------------------------------- |
| `inter-latin-var.woff2`          | Inter Variable | 正文、标题、UI 的拉丁字符 | [Google Fonts](https://fonts.google.com/specimen/Inter)          |
| `jetbrains-mono-latin-var.woff2` | JetBrains Mono | 代码、时钟年份、数字标签  | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |

两个文件都只包含 Google Fonts 的 **Latin** 子集（`unicode-range` 见
`src/styles/fonts.css`），体积分别约 48KB 和 31KB。中文字符不下载字体文件，由
`--font-sans` 字体栈中的系统 CJK 字体（PingFang SC / Microsoft YaHei /
Noto Sans CJK SC / Source Han Sans SC）渲染。

## 许可证

- Inter：Copyright 2016-2024 Rasmus Andersson，SIL Open Font License 1.1
- JetBrains Mono：Copyright 2019-2023 The JetBrains Mono Project Authors，
  SIL Open Font License 1.1

完整许可证文本见同目录的 [`OFL.txt`](./OFL.txt)。
