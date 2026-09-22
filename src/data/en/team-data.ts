// src/data/en/team-data.ts —— 英文版团队数据
// 占位回退：人名/头像键不翻译，英文数据暂复用中文完整数据，保证 /en 页面人员卡片正常显示。
// 若后续要提供英文专属文案（role/desc/dream/quote 的英文或拼音），
// 请参照 ../team-data 的结构在此给出英文对象，并移除下方 re-export 兜底。
// TODO(i18n)：/en 团队页当前显示的是中文 role/desc/dream/quote（占位），
// 补齐英文文案前不要把这份兜底当作最终英文内容发布。
export { teamData } from "../team-data";
