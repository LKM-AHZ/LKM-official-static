// 团队数据静态类型（对应 src/data/team-data.ts 的结构）。
// data 用 as const satisfies 校验，页面引用时获得字面量 key 的补全与校验。
//
// 校验范围说明（避免对注释期望过高）：
// - 顶层键受校验：memberLists 必须是 memberListKeys 的 7 个键，subGroupMaps 是 subGroupMapKeys 的 4 个。
// - 成员必填 name；子分组必填 label 与 members（空数组表示该组暂无成员）。
// - avatarKey 保持可选：目前有 5 位成员本就没有头像文件（见 team-data.ts）。
// - 子分组映射的**内层键**仍是 Record<string, …>，即 affairsSubGroups 下的分组名不做联合类型约束，
//   拼错分组名不会被类型捕获；如需收紧，得先把分组名枚举成字面量联合。

export interface TeamMember {
  name: string;
  role?: string;
  avatarKey?: string;
  desc?: string;
  dream?: string;
  quote?: string;
}

export interface TeamSubGroup {
  label: string;
  desc?: string;
  members: TeamMember[];
}

/** memberLists 的顶层分组成员（founder/general/events/news/advisor/tech/alumni）。 */
export const memberListKeys = [
  "founderMembers",
  "generalMembers",
  "eventsMembers",
  "newsMembers",
  "advisorMembers",
  "techMembers",
  "alumniMembers",
] as const;
export type MemberListKey = (typeof memberListKeys)[number];

/** subGroupMaps 的顶层分组（affairs/news/professional/project）。 */
export const subGroupMapKeys = [
  "affairsSubGroups",
  "newsSubGroups",
  "professionalSubGroups",
  "projectSubGroups",
] as const;
export type SubGroupMapKey = (typeof subGroupMapKeys)[number];

export type MemberLists = Record<MemberListKey, TeamMember[]>;
export type SubGroupMaps = Record<SubGroupMapKey, Record<string, TeamSubGroup>>;

/** 完整数据对象类型，供 as const satisfies 校验。 */
export interface TeamData {
  memberLists: MemberLists;
  subGroupMaps: SubGroupMaps;
}
