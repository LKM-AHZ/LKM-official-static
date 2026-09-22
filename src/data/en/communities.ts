// src/data/en/communities.ts —— 英文版社群分类（阶段一占位；群号/群名不可翻译）
// 类型从中文源复用，避免两份结构各自演化（新增字段只改一侧时会静默不兼容）
import type { CommunityCategory } from "../communities";
export type { Community, CommunityCategory } from "../communities";

// 阶段一先留空结构，阶段二按中文源 8 类成型：页面会据此不渲染任何分类与侧栏
export const communityCategories: CommunityCategory[] = [];

// 阶段一分类为空时页面只剩顶部/底部，给一句说明避免看起来像坏页面。
// 阶段二补齐分类后，这里应换成正式的页脚注记（同中文源的 communityNote）。
export const communityNote =
  "The English community listing is still being prepared. For now, please see the Chinese page for all QQ groups and channels.";
