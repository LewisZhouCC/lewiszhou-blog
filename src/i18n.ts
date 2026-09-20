export const locales = ["zh-CN", "en"] as const;
export type Locale = (typeof locales)[number];
export type Category = "systems" | "agents" | "product" | "build";

export const paths = {
  "zh-CN": {
    home: "/",
    writing: "/writing/",
    about: "/about/",
    rss: "/rss.xml",
    post: (slug: string) => `/writing/${slug}/`,
  },
  en: {
    home: "/en/",
    writing: "/en/writing/",
    about: "/en/about/",
    rss: "/en/rss.xml",
    post: (slug: string) => `/en/writing/${slug}/`,
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
    navAbout: "关于",
    otherLanguage: "EN",
    footerName: "Lewis Zhou · Still Solving",
    footerLine: "复杂问题没有捷径，但可以持续求解。",
    backToWriting: "← 所有文章",
    updated: "最后更新于",
    latestLabel: "Latest writing / 最近文章",
    latestTitle: "正在求解",
    allWriting: "查看全部文章",
    read: "开始阅读 ↗",
    heroEyebrow: "Lewis Zhou · Personal Notes",
    heroTitleFirst: "持续",
    heroTitleSecond: "求解",
    heroIntro: "把复杂问题，一步步做实。记录系统、Agent、产品判断与构建过程。",
    topicsLabel: "Fields / 长期主题",
    topicsTitle: "观察的坐标",
    writingLabel: "Writing / 文章",
    writingTitle: "所有求解记录",
    writingIntro: "这里不收集正确答案，只记录问题如何被定义、验证，以及最后真正发生了什么。",
    aboutLabel: "About / 关于",
    aboutStatement: "我关心复杂系统最终如何变成可以验证、可以交付的真实结果。",
    aboutParagraphs: [
      "持续求解是一份个人工作笔记，内容覆盖系统架构、Agent、产品判断与实际构建。",
      "这里会明确区分设想、实验、验证与交付。因为一个流程运行成功，不等于用户的问题已经解决；一个设计看起来完整，也不等于它值得被实现。",
      "写作不是为复杂增加解释，而是把真正重要的边界、证据和选择留下来。",
    ],
  },
  en: {
    siteTitle: "Lewis Zhou — Still Solving",
    siteDescription: "Making complex problems concrete, one verified step at a time. Notes on systems, agents, product decisions, and building.",
    navWriting: "Writing",
    navAbout: "About",
    otherLanguage: "中文",
    footerName: "Lewis Zhou · Still Solving",
    footerLine: "Complex problems have no shortcuts, only better ways to keep solving.",
    backToWriting: "← All writing",
    updated: "Last updated",
    latestLabel: "Latest writing",
    latestTitle: "Problems in progress",
    allWriting: "View all writing",
    read: "Start reading ↗",
    heroEyebrow: "Lewis Zhou · Personal Notes",
    heroTitleFirst: "Still",
    heroTitleSecond: "Solving",
    heroIntro: "Making complex problems concrete, one verified step at a time. Notes on systems, agents, product decisions, and building.",
    topicsLabel: "Fields / Long-term themes",
    topicsTitle: "Coordinates for inquiry",
    writingLabel: "Writing",
    writingTitle: "All solving notes",
    writingIntro: "This is not a collection of perfect answers. It is a record of how problems are framed, tested, and carried through to real outcomes.",
    aboutLabel: "About",
    aboutStatement: "I care about how complex systems become outcomes that can be verified and delivered.",
    aboutParagraphs: [
      "Still Solving is a personal working notebook about systems architecture, agents, product decisions, and building in practice.",
      "I separate proposals, experiments, verification, and delivery. A successful process does not mean the user's problem is solved, and a complete-looking design is not necessarily worth implementing.",
      "Writing should not add explanation to complexity. It should preserve the boundaries, evidence, and choices that matter.",
    ],
  },
} as const;

export const otherLocale = (locale: Locale): Locale => locale === "zh-CN" ? "en" : "zh-CN";
