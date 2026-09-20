# Bilingual Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Add a fully indexable English version without changing any existing Chinese URL.

**Architecture:** Chinese remains the unprefixed default locale and English uses `/en/`. A single typed content collection pairs translations with `translationKey`, while shared layouts emit localized UI, self-canonicals, JSON-LD, and reciprocal `hreflang` links.

**Tech Stack:** Astro 7 static output, TypeScript, Markdown, CSS, JSON-LD

---

### Task 1: Localize the shared shell and content model

- Add locale dictionaries, routes, and category labels.
- Add `lang`, `slug`, and `translationKey` to article frontmatter.
- Make the base, header, and article layouts locale-aware.

### Task 2: Add English routes and content

- Preserve all existing Chinese routes.
- Add `/en/`, `/en/writing/`, `/en/writing/:slug/`, `/en/about/`, and `/en/rss.xml`.
- Add the complete English translation of the existing article.

### Task 3: Verify multilingual SEO

- Validate self-canonicals, HTML language, reciprocal `hreflang`, JSON-LD language, sitemap membership, RSS, and route status.
- Build and visually inspect desktop and mobile pages.
- Push only the feature branch and verify the Cloudflare preview before merge.
