export const locales = ["zh-CN", "en"] as const;
export type Locale = (typeof locales)[number];
export type Category = "systems" | "agents" | "product" | "build";

export const paths = {
  "zh-CN": {
    home: "/zh/",
    writing: "/zh/writing/",
    rss: "/zh/rss.xml",
    post: (slug: string) => `/zh/writing/${slug}/`,
    topic: (category: Category) => `/zh/topics/${category}/`,
  },
  en: {
    home: "/",
    writing: "/writing/",
    rss: "/rss.xml",
    post: (slug: string) => `/writing/${slug}/`,
    topic: (category: Category) => `/topics/${category}/`,
  },
} as const;

export const categoryLabels: Record<Locale, Record<Category, string>> = {
  "zh-CN": {
    systems: "系统",
    agents: "Agent",
    product: "产品判断",
    build: "构建日志",
  },
  en: {
    systems: "Systems",
    agents: "Agents",
    product: "Product Decisions",
    build: "Build Log",
  },
};

export const ui = {
  "zh-CN": {
    siteTitle: "Lewis Zhou — 持续求解",
    siteDescription: "把复杂问题，一步步做实。记录系统、Agent、产品判断与构建过程。",
    navWriting: "文章",
    otherLanguage: "EN",
    footerName: "Lewis Zhou · Still Solving",
    footerLine: "复杂问题没有捷径，但可以持续求解。",
    backToWriting: "← 所有文章",
    updated: "最后更新于",
    latestLabel: "Latest writing / 最近文章",
    latestTitle: "最近文章",
    allWriting: "查看全部文章",
    read: "开始阅读 ↗",
    heroEyebrow: "Lewis Zhou · Personal Notes",
    heroTitleFirst: "持续",
    heroTitleSecond: "求解",
    topicsLabel: "Topics / 主题",
    allTopics: "全部",
    topicCount: (count: number) => `${count} 篇文章`,
    topicsTitle: "主题",
    writingLabel: "Writing / 文章",
    writingTitle: "所有求解记录",
    writingIntro: "这里不收集正确答案，只记录问题如何被定义、验证，以及最后真正发生了什么。",
  },
  en: {
    siteTitle: "Lewis Zhou — Still Solving",
    siteDescription: "Making complex problems concrete, one verified step at a time. Notes on systems, agents, product decisions, and building.",
    navWriting: "Writing",
    otherLanguage: "中文",
    footerName: "Lewis Zhou · Still Solving",
    footerLine: "Complex problems have no shortcuts, only better ways to keep solving.",
    backToWriting: "← All writing",
    updated: "Last updated",
    latestLabel: "Latest writing",
    latestTitle: "Recent writing",
    allWriting: "View all writing",
    read: "Start reading ↗",
    heroEyebrow: "Lewis Zhou · Personal Notes",
    heroTitleFirst: "Still",
    heroTitleSecond: "Solving",
    topicsLabel: "Topics",
    allTopics: "All",
    topicCount: (count: number) => `${count} ${count === 1 ? "article" : "articles"}`,
    topicsTitle: "Topics",
    writingLabel: "Writing",
    writingTitle: "All solving notes",
    writingIntro: "This is not a collection of perfect answers. It is a record of how problems are framed, tested, and carried through to real outcomes.",
  },
} as const;

export const otherLocale = (locale: Locale): Locale => locale === "zh-CN" ? "en" : "zh-CN";
