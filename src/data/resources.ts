/**
 * src/data/resources.ts —— 「延伸资源网站」列表。
 */
export interface SiteLink {
  /** badge 上显示的缩写 / 单个标识字 */
  abbr: string;
  /** 中文名（站点正式中文名，无则写音译/简称）*/
  nameZh: string;
  /** 站名原文（多为英文全称/机构名）*/
  nameEn: string;
  /** 一行简介（中文）*/
  descZh: string;
  /** 一行简介（英文）*/
  descEn: string;
  /** 推荐入口 URL；可省略。省略时消费方回退到 alts[0].url，且仍应渲染镜像列表 */
  url?: string;
  /** 英文（国际）版本的首选 URL。网页处于 /en 时优先用，缺省则回退 url。 */
  urlEn?: string;
  /** 备用/镜像入口 */
  alts?: { label: string; url: string }[];
  /** 特殊协议类站点（访问需注意）: 走琥珀配色 */
  advisory?: boolean;
}

export const RESOURCE_SITES: SiteLink[] = [
  {
    abbr: "IU",
    nameZh: "国际纯粹与应用化学联合会",
    nameEn: "IUPAC · International Union of Pure and Applied Chemistry",
    descZh: "化学命名、术语与标准的国际权威机构。",
    descEn: "International authority on chemical nomenclature and standards.",
    url: "https://iupac.org/",
  },
  {
    abbr: "会",
    nameZh: "中国化学会",
    nameEn: "Chinese Chemical Society",
    descZh: "中国化学工作者学术团体，发布学术活动与期刊信息。",
    descEn: "China's society of chemistry — academic activities and journals.",
    url: "https://www.chemsoc.org.cn/",
  },
  {
    abbr: "育",
    nameZh: "国家中小学智慧教育平台",
    nameEn: "National Smart Education Platform (MoE)",
    descZh: "教育部官方平台，覆盖中小学全学段课程资源。",
    descEn: "Official MoE platform for national K–12 course resources.",
    url: "https://basic.smartedu.cn/",
  },
  {
    abbr: "P",
    nameZh: "PubChem 化合物数据库",
    nameEn: "PubChem",
    descZh: "化合物、分子式与生物活性的开放化学数据库。",
    descEn: "Open chemistry database: molecules, formulas, bioactivity.",
    url: "https://pubchem.ncbi.nlm.nih.gov/",
  },
  {
    abbr: "植",
    nameZh: "植物智（iPlant）",
    nameEn: "iPlant — Flora of China",
    descZh: "《中国植物志》在线版，支持物种检索。",
    descEn: "Flora of China online, with species search.",
    url: "https://www.iplant.cn/",
  },
  {
    abbr: "B",
    nameZh: "国际计量局",
    nameEn: "BIPM · International Bureau of Weights and Measures",
    descZh: "国际单位制（SI）的制定与维护机构。",
    descEn: "Maintains the International System of Units (SI).",
    url: "https://www.bipm.org/",
  },
  {
    abbr: "Z",
    nameZh: "Z-Library",
    nameEn: "Z-Library",
    descZh: "大型在线数字图书馆（域名多变，需要适当的网络条件；请注意版权）。",
    descEn:
      "Online library — domains change; needs appropriate network access. Mind copyright.",
    advisory: true,
    url: "https://zh.z-library.sk/",
    urlEn: "https://z-library.sk/",
    // label 不再写死镜像域名：域名只保留在 url 里，避免两处不同步
    alts: [{ label: "备用镜像", url: "https://zh.101ml.by/" }],
  },
  {
    abbr: "W",
    nameZh: "维基百科",
    nameEn: "Wikipedia",
    descZh:
      "开放的多语言网络百科全书（中文环境下指向中文版，英文环境指向英文版）。",
    descEn:
      "Free multilingual encyclopedia — Chinese edition on /zh, English edition on /en.",
    url: "https://zh.wikipedia.org/",
    urlEn: "https://en.wikipedia.org/",
  },
];
