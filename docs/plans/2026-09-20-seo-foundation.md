# SEO Foundation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Make the static blog discoverable, machine-readable, and protected by repeatable SEO checks.

**Architecture:** Astro's official sitemap integration generates route discovery files. Existing layouts emit page-specific metadata and JSON-LD at build time, while a dependency-free Node script validates the generated HTML.

**Tech Stack:** Astro 7, `@astrojs/sitemap`, JSON-LD, Node.js standard library

---

### Task 1: Add crawler discovery

- Add the official Astro sitemap integration.
- Add a root `robots.txt` with the absolute sitemap URL.
- Build and verify the generated discovery files.

### Task 2: Add semantic page metadata

- Emit `WebSite`, `Person`, `WebPage`, and `BlogPosting` JSON-LD where applicable.
- Emit article-specific Open Graph metadata.
- Add a visible author link to each article.

### Task 3: Add regression checks and evidence

- Validate titles, descriptions, canonical URLs, H1 counts, JSON-LD, robots, and sitemap after every build.
- Run Astro checks, security audit, route checks, and Lighthouse.
- Record verified and post-launch-only findings in the SEO audit report.
