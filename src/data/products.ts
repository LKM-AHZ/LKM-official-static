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
    id: "news-office",
    category: "content",
    type: "studio",
    status: "ongoing",
    studioFocus: "education",
    icon: "pencil",
    name: { zh: "新闻办 · 内容工作室", en: "News Office · Content Studio" },
    summary: {
      zh: "负责官网与社群的内容策划、采编、发布与归档。",
      en: "Plans, writes, publishes, and archives content for the website and community.",
    },
    features: {
      zh: ["新闻采编与公告撰写", "栏目策划与排期", "内容校对与归档"],
      en: [
        "Reporting and announcement writing",
        "Editorial planning and scheduling",
        "Proofreading and archiving",
      ],
    },
    href: "/team",
    linkLabel: { zh: "团队介绍", en: "Meet the team" },
  },
  {
    id: "science-communication",
    category: "content",
    type: "studio",
    status: "ongoing",
    studioFocus: "education",
    icon: "atom",
    name: { zh: "科普项目组", en: "Science Communication Studio" },
    summary: {
      zh: "把专业知识转化为通俗内容，负责科普征集与传播。",
      en: "Turns specialist knowledge into accessible content and runs science communication submissions.",
    },
    features: {
      zh: ["科普选题与作者联络", "内容审核与编辑", "跨平台传播"],
      en: [
        "Topic selection and contributor outreach",
        "Content review and editing",
        "Cross-platform distribution",
      ],
    },
    href: "/team",
    linkLabel: { zh: "团队介绍", en: "Meet the team" },
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
    id: "event-office",
    category: "community",
    type: "studio",
    status: "ongoing",
    studioFocus: "education",
    icon: "confetti",
    name: {
      zh: "活动策划部 · 活动工作室",
      en: "Event Planning Office · Events Studio",
    },
    summary: {
      zh: "统筹社区活动从策划到复盘的完整流程。",
      en: "Runs community events end to end, from planning to retrospective.",
    },
    features: {
      zh: ["活动策划与排期", "志愿者分工", "报名、通知与复盘"],
      en: [
        "Event planning and scheduling",
        "Volunteer roles",
        "Registration, updates, and review",
      ],
    },
    href: "/team",
    linkLabel: { zh: "团队介绍", en: "Meet the team" },
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
    id: "tech-committee",
    category: "platform",
    type: "studio",
    status: "ongoing",
    studioFocus: "tech",
    icon: "code",
    name: {
      zh: "技术委员会 · 技术工作室",
      en: "Technology Committee · Tech Studio",
    },
    summary: {
      zh: "负责官网、工具链、服务器与技术支持。",
      en: "Builds and maintains the website, toolchain, servers, and technical support.",
    },
    features: {
      zh: ["网站与前端开发", "服务器与部署运维", "工具与自动化支持"],
      en: [
        "Web and frontend development",
        "Servers and deployment",
        "Tools and automation",
      ],
    },
    href: "/team",
    linkLabel: { zh: "团队介绍", en: "Meet the team" },
  },
  {
    id: "full-chain-studio",
    category: "platform",
    type: "studio",
    status: "preparing",
    studioFocus: "tech",
    icon: "heartHandshake",
    name: { zh: "全链技术服务工作室", en: "Full-Chain Tech Services Studio" },
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
    id: "textbook-studio",
    category: "education",
    type: "studio",
    status: "ongoing",
    studioFocus: "education",
    icon: "book",
    name: { zh: "教材项目组 · 教材工作室", en: "Textbook Studio" },
    summary: {
      zh: "编写高质量理科教材，整合知识体系。",
      en: "Writes high-quality science textbooks and organizes knowledge into a coherent system.",
    },
    features: {
      zh: ["教材大纲与章节编写", "习题与配套材料", "审校与排版"],
      en: [
        "Outlines and chapter writing",
        "Exercises and companion material",
        "Review and typesetting",
      ],
    },
    href: "/team",
    linkLabel: { zh: "团队介绍", en: "Meet the team" },
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
