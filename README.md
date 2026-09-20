# Lewis Zhou — 持续求解

Lewis Zhou 的静态个人博客，使用 Astro 与 Markdown 构建。

## 本地运行

```bash
npm install
npm run dev
```

发布前检查：

```bash
npm run build
```

构建命令会同时运行 Astro 类型检查和 SEO 回归检查，包括 title、description、canonical、H1、JSON-LD、robots 与 sitemap。

## 新增文章

在 `src/content/writing/` 新建 Markdown 文件：

```yaml
---
title: 文章标题
description: 一句话摘要
lang: zh-CN # zh-CN / en
urlSlug: article-slug
translationKey: article-slug # 中英文配对使用相同值
publishedAt: 2026-09-20
category: systems # systems / agents / product / build
draft: false
---
```

中文文章保留在默认路由 `/writing/:slug/`，英文文章发布到 `/en/writing/:slug/`。只有真实存在的翻译页面才应互相声明 `hreflang`。

## Cloudflare Pages

- 构建命令：`npm run build`
- 输出目录：`dist`
- Node.js：`22.12` 或更高

将 Git 仓库连接到 Cloudflare Pages 后，每次推送会自动构建。域名绑定与上线发布不包含在本地项目初始化中。

上线后还需要在 Google Search Console 验证域名、提交 `sitemap-index.xml`，并等待真实收录与 Core Web Vitals 数据。
