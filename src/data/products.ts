/**
 * 产品页数据：把社区做过的产品、项目与工作室放在同一套分类下。
 * 字段均为双语对象，页面按当前语言取值；href 为不含语言前缀的站内路径。
 */
export type ProductCategoryId =
  "content" | "community" | "platform" | "education";
export type ProductType = "product" | "project" | "studio";
export type ProductStatus = "live" | "ongoing" | "recruiting" | "preparing";

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
    id: "science-video",
    category: "content",
    type: "project",
    status: "ongoing",
    icon: "video",
    name: { zh: "科普视频系列", en: "Science Video Series" },
    summary: {
      zh: "把学科知识、实验和前沿话题做成可观看的视频内容。",
      en: "Subject knowledge, experiments, and frontier topics turned into watchable video.",
    },
    features: {
      zh: ["脚本与分镜", "录制与剪辑", "平台发布与运营"],
      en: [
        "Scripts and storyboards",
        "Recording and editing",
        "Publishing and channel operations",
      ],
    },
  },
  {
    id: "news-office",
    category: "content",
    type: "studio",
    status: "ongoing",
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
    id: "holiday-events",
    category: "community",
    type: "project",
    status: "ongoing",
    icon: "calendarStar",
    name: { zh: "寒暑假活动", en: "Holiday Events" },
    summary: {
      zh: "每年寒暑假的线上活动，包含讲座、研讨和趣味环节。",
      en: "Online events each winter and summer, with talks, discussions, and playful sessions.",
    },
    features: {
      zh: ["主题与日程策划", "报名与通知", "志愿者组织与复盘"],
      en: [
        "Theme and schedule planning",
        "Registration and updates",
        "Volunteer coordination and review",
      ],
    },
    href: "/news",
    linkLabel: { zh: "阅读活动文章", en: "Read event posts" },
  },
  {
    id: "subject-seminars",
    category: "community",
    type: "project",
    status: "ongoing",
    icon: "presentation",
    name: { zh: "学科研讨会", en: "Subject Seminars" },
    summary: {
      zh: "围绕具体学科话题的专题分享与讨论。",
      en: "Focused talks and discussions around a specific subject.",
    },
    features: {
      zh: ["主题邀请", "主持与记录", "延伸阅读整理"],
      en: [
        "Speaker and topic invitations",
        "Hosting and notes",
        "Further reading curation",
      ],
    },
    href: "/team",
    linkLabel: { zh: "团队介绍", en: "Meet the team" },
  },
  {
    id: "knowledge-quiz",
    category: "community",
    type: "project",
    status: "ongoing",
    icon: "trophy",
    name: { zh: "知识竞赛", en: "Knowledge Quizzes" },
    summary: {
      zh: "线上学科知识竞赛，用轻量方式检验和巩固知识。",
      en: "Online subject quizzes that test and reinforce knowledge in a light format.",
    },
    features: {
      zh: ["命题与赛制", "报名与分组", "结果公布与复盘"],
      en: [
        "Question design and rules",
        "Registration and grouping",
        "Results and review",
      ],
    },
  },
  {
    id: "event-office",
    category: "community",
    type: "studio",
    status: "ongoing",
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
    id: "knowledge-graph",
    category: "platform",
    type: "project",
    status: "recruiting",
    icon: "database",
    name: { zh: "理科迷知识图谱", en: "Phientist Knowledge Graph" },
    summary: {
      zh: "把学科概念、资料与社区内容组织成可检索的知识网络。",
      en: "Organizes concepts, resources, and community content into a searchable knowledge network.",
    },
    features: {
      zh: ["知识结构化与词条整理", "后端与检索", "内容编辑与校对"],
      en: [
        "Knowledge structuring and entries",
        "Backend and search",
        "Content editing and proofreading",
      ],
    },
  },
  {
    id: "quantum-simulator",
    category: "platform",
    type: "project",
    status: "recruiting",
    icon: "atom",
    name: { zh: "量子计算模拟平台", en: "Quantum Computing Simulator" },
    summary: {
      zh: "面向学习与演示的量子计算模拟与可视化平台。",
      en: "A simulation and visualization platform for learning and demonstrating quantum computing.",
    },
    features: {
      zh: ["前端交互与可视化", "模拟任务与结果展示", "教学示例与文档"],
      en: [
        "Frontend interaction and visualization",
        "Simulation tasks and results",
        "Teaching examples and docs",
      ],
    },
  },
  {
    id: "astro-visualization",
    category: "platform",
    type: "project",
    status: "ongoing",
    icon: "chartBar",
    name: { zh: "天体观测数据可视化", en: "Astronomical Data Visualization" },
    summary: {
      zh: "把天体观测数据整理成可探索的可视化页面。",
      en: "Turns observation data into explorable visual pages.",
    },
    features: {
      zh: ["数据清洗与整理", "图表与交互设计", "科普说明与发布"],
      en: [
        "Data cleaning and preparation",
        "Charts and interaction design",
        "Explanatory copy and publishing",
      ],
    },
  },
  {
    id: "tech-committee",
    category: "platform",
    type: "studio",
    status: "ongoing",
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
    id: "textbook-studio",
    category: "education",
    type: "studio",
    status: "ongoing",
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
    id: "science-journal",
    category: "education",
    type: "project",
    status: "preparing",
    icon: "clipboardList",
    name: { zh: "科技期刊", en: "Science Journal" },
    summary: {
      zh: "汇集社区一年内的文章、科普与创作成果。",
      en: "Collects a year of community articles, explainers, and creative work.",
    },
    features: {
      zh: ["期刊策划与栏目", "编辑、审校与排版", "发布与归档"],
      en: [
        "Journal planning and sections",
        "Editing, review, and layout",
        "Publishing and archiving",
      ],
    },
  },
  {
    id: "translation-exchange",
    category: "education",
    type: "project",
    status: "preparing",
    icon: "language",
    name: { zh: "中外交流与翻译", en: "Translation & Exchange" },
    summary: {
      zh: "翻译和搬运中外优质科技内容，做双向输入输出。",
      en: "Translates and shares quality science content between Chinese and other languages.",
    },
    features: {
      zh: ["论文与文章翻译", "视频字幕与校对", "双语内容维护"],
      en: [
        "Paper and article translation",
        "Video subtitles and proofreading",
        "Bilingual content maintenance",
      ],
    },
  },
];
