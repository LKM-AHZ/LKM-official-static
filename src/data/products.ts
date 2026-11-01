/**
 * 产品页数据：把社区做过的产品、项目与工作室放在同一套分类下。
 * 字段均为双语对象，页面按当前语言取值；href 为不含语言前缀的站内路径。
 */
export type ProductCategoryId =
  "content" | "community" | "platform" | "education";
export type ProductType = "product" | "project" | "studio";
export type ProductStatus =
  "live" | "ongoing" | "recruiting" | "preparing" | "ended";
/** 工作室的二级筛选标签。 */
export type StudioFocus = "tech" | "education";
/** 产品的二级筛选标签。 */
export type ProductKind = "online";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface ProductCategory {
  id: ProductCategoryId;
  name: LocalizedText;
}

export interface ProductItem {
  id: string;
  category: ProductCategoryId;
  type: ProductType;
  status: ProductStatus;
  icon: string;
  name: LocalizedText;
  summary: LocalizedText;
  features: { zh: string[]; en: string[] };
  /** 工作室二级标签：技术/专业相关或技能/教育相关 */
  studioFocus?: StudioFocus;
  /** 产品二级标签：线上平台类 */
  productKind?: ProductKind;
  /** 站内路径（不含语言前缀）；没有独立页面的条目不填 */
  href?: string;
  linkLabel?: LocalizedText;
}

export const productCategories: ProductCategory[] = [
  { id: "content", name: { zh: "内容与科普", en: "Content & Science" } },
  { id: "community", name: { zh: "社区与活动", en: "Community & Events" } },
  { id: "platform", name: { zh: "平台与工具", en: "Platforms & Tools" } },
  { id: "education", name: { zh: "教育与出版", en: "Education & Publishing" } },
];

export const products: ProductItem[] = [
  {
    id: "tech-frontier",
    category: "content",
    type: "product",
    status: "live",
    productKind: "online",
    icon: "news",
    name: { zh: "科技前沿栏目", en: "Science Frontier Column" },
    summary: {
      zh: "聚焦前沿科学与技术，把研究进展、背景和边界讲清楚。",
      en: "A column that explains frontier science and technology — the progress, the context, and the limits.",
    },
    features: {
      zh: ["选题策划与资料整理", "科普写作与审稿", "原始论文与延伸阅读"],
      en: [
        "Topic planning and source gathering",
        "Explainer writing and review",
        "Primary papers and further reading",
      ],
    },
    href: "/news",
    linkLabel: { zh: "阅读栏目", en: "Read the column" },
  },
  {
    id: "qq-community",
    category: "community",
    type: "product",
    status: "live",
    productKind: "online",
    icon: "users",
    name: { zh: "QQ 社群体系", en: "QQ Community Network" },
    summary: {
      zh: "按学段、学科与兴趣组织的官方群组与频道。",
      en: "Official groups and channels organized by stage, subject, and interest.",
    },
    features: {
      zh: ["分群与验证", "群规与日常维护", "活动与公告同步"],
      en: [
        "Group segmentation and verification",
        "Rules and daily moderation",
        "Event and announcement sync",
      ],
    },
    href: "/about#communities",
    linkLabel: { zh: "查看社群", en: "View groups" },
  },
  {
    id: "official-website",
    category: "platform",
    type: "product",
    status: "live",
    productKind: "online",
    icon: "worldWww",
    name: { zh: "官方网站", en: "Official Website" },
    summary: {
      zh: "面向公众的静态官网，承载新闻、文章、团队与资源信息。",
      en: "The public static site for news, articles, team, and resource information.",
    },
    features: {
      zh: [
        "静态站点构建与部署",
        "双语内容与阅读体验",
        "SEO、站点地图与可访问性",
      ],
      en: [
        "Static build and deployment",
        "Bilingual content and reading experience",
        "SEO, sitemap, and accessibility",
      ],
    },
    href: "/about",
    linkLabel: { zh: "关于官网", en: "About the site" },
  },
  {
    id: "blog-system",
    category: "platform",
    type: "product",
    status: "live",
    productKind: "online",
    icon: "fileText",
    name: { zh: "博客与文章系统", en: "Blog & Article System" },
    summary: {
      zh: "基于 Markdown 的文章发布与阅读系统。",
      en: "A Markdown-based publishing and reading system.",
    },
    features: {
      zh: ["Markdown 写作与版本管理", "分类、标签与搜索", "阅读目录与阅读时长"],
      en: [
        "Markdown writing and version control",
        "Categories, tags, and search",
        "Table of contents and reading time",
      ],
    },
    href: "/news",
    linkLabel: { zh: "阅读文章", en: "Read articles" },
  },
  {
    id: "learning-center",
    category: "platform",
    type: "project",
    status: "preparing",
    icon: "school",
    name: { zh: "理科迷·学习中心", en: "Phientist Learning Center" },
    summary: {
      zh: "该项目将用于大家进行学习各种各样知识，并且将自己学习成果将展示在社区。该项目还在统筹规划当中，还请大家敬请期待哦。",
      en: "A place for learning knowledge of all kinds and sharing what you have learned with the community. The project is still being planned — please look forward to it.",
    },
    features: {
      zh: [
        "学习各类学科知识",
        "学习成果在社区展示",
        "统筹规划中，欢迎参与建设",
      ],
      en: [
        "Learning across subjects",
        "Showcasing results in the community",
        "In planning — co-builders welcome",
      ],
    },
    href: "/docs/news-lkm-learning-center",
    linkLabel: { zh: "了解详情", en: "Learn more" },
  },
  {
    id: "smart-robot",
    category: "platform",
    type: "project",
    status: "ongoing",
    icon: "robot",
    name: { zh: "理科迷·智能机器人", en: "Phientist Smart Robot" },
    summary: {
      zh: "我们将开发，在每一个社群都能够驻场的小机器人，之后将上线在十几个社群当中，为大家提供便捷的服务。还请大家敬请期待哦。",
      en: "We are building a small bot that can be stationed in every community, and it will go live in more than a dozen community groups to offer convenient services. Please look forward to it.",
    },
    features: {
      zh: ["驻场社群的小机器人", "计划上线十几个社群", "为大家提供便捷服务"],
      en: [
        "A small bot stationed in each community",
        "Rolling out to a dozen-plus groups",
        "Convenient services for everyone",
      ],
    },
    href: "/docs/news-lkm-smart-robot",
    linkLabel: { zh: "了解详情", en: "Learn more" },
  },
  {
    id: "tech-media-learning",
    category: "content",
    type: "project",
    status: "recruiting",
    icon: "video",
    name: {
      zh: "科技自媒体学习计划",
      en: "Tech Media Learning Plan",
    },
    summary: {
      zh: "由有自媒体经验的成员担任老师，教授想学习自媒体的人，同时为新闻部门招募宣传与运营成员，并邀请各平台科技与学习 UP 主交流建联。",
      en: "Experienced media creators teach people who want to learn, while the program recruits News Office members and invites science and learning creators to exchange and connect.",
    },
    features: {
      zh: [
        "自媒体经验教学",
        "新闻部门宣传与运营招募",
        "跨平台 UP 主交流与建联",
      ],
      en: [
        "Media skills teaching",
        "News Office recruitment",
        "Cross-platform creator exchange",
      ],
    },
    href: "/docs/news-tech-media-learning-plan",
    linkLabel: { zh: "了解详情", en: "Learn more" },
  },
  {
    id: "full-chain-studio",
    category: "platform",
    type: "studio",
    status: "preparing",
    studioFocus: "tech",
    icon: "heartHandshake",
    name: { zh: "全链·技术服务工作室", en: "Full-Chain Tech Services Studio" },
    summary: {
      zh: "覆盖前端、后端、测试与运维的全链技术服务，承接各类需求与外包，收入与开销全部公开。",
      en: "Full-chain technical services covering frontend, backend, testing, and operations — taking orders and outsourcing work, with all income and expenses made public.",
    },
    features: {
      zh: ["前端、后端、测试与运维", "各类需求接单与外包", "收益与开销公开"],
      en: [
        "Frontend, backend, testing, and operations",
        "Order intake and outsourcing",
        "Transparent income and expenses",
      ],
    },
    href: "/docs/news-lkm-full-chain-studio",
    linkLabel: { zh: "了解详情", en: "Learn more" },
  },
  {
    id: "star-orbit-tutoring",
    category: "education",
    type: "studio",
    status: "preparing",
    studioFocus: "education",
    icon: "school",
    name: {
      zh: "星轨·全科家教工作室",
      en: "Star Orbit Tutoring Studio",
    },
    summary: {
      zh: "面向多个年级阶段与多个学科的定制化家教服务，根据学生能力与提升需要规划成长路线。",
      en: "Customized tutoring across grade levels and subjects, with growth plans based on each student's ability and goals.",
    },
    features: {
      zh: [
        "多年级、多学科定制辅导",
        "能力评估与成长路线规划",
        "教师、渠道与线上家教对接",
      ],
      en: [
        "Tutoring across grades and subjects",
        "Ability assessment and growth planning",
        "Teacher, channel, and online tutoring matching",
      ],
    },
    href: "/docs/news-star-orbit-tutoring",
    linkLabel: { zh: "了解详情", en: "Learn more" },
  },
];
