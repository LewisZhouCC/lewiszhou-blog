# Lewis Zhou Blog Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Build a production-ready first version of Lewis Zhou's static personal blog.

**Architecture:** Astro generates static HTML from a typed Markdown content collection. Shared layouts own SEO and visual structure, while plain CSS provides the editorial design and motion without a client-side framework.

**Tech Stack:** Astro 7, TypeScript 6, Markdown, CSS, `@astrojs/rss`

---

### Task 1: Establish the project and content contract

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/content.config.ts`

**Verification:** Run `npm install` and `npm run check`.

### Task 2: Build the editorial shell

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

**Verification:** Start the development server and inspect the shared layout.

### Task 3: Add pages and writing flow

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/writing/index.astro`
- Create: `src/pages/writing/[...id].astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/rss.xml.js`
- Create: `src/content/writing/why-still-solving.md`

**Verification:** Run `npm run build`; confirm every route is generated.

### Task 4: Verify presentation and deployment readiness

**Files:**
- Create: `README.md`

**Verification:** Inspect desktop and mobile screenshots, test navigation, and document Cloudflare Pages build settings.
