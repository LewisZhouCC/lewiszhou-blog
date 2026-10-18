# Article models implementation plan

> **For Claude:** Execute the user-approved scope in this session. Do not commit, push, or publish without a separate instruction.

**Goal:** Prepare a bilingual article with three single-parameter interactive thought experiments, based on “Agent 越强，为什么我们还在招初级工程师？”.

**Architecture:** Chinese and English MDX import a native Astro component at the end of sections 1, 2, and 3. The accepted article now uses the regular bilingual article routes; a development-only Chinese preview route remains available for the original review link. Shared TypeScript calculations power both static initial output and localized browser updates; SVG, native range inputs and buttons need no UI framework.

**Tech stack:** Astro, official MDX integration, TypeScript, CSS, SVG, Node test runner.

## Approved design

1. Bottleneck: accepted deliveries = min(Agent capacity, human review capacity, valuable demand). Adjust only Agent count. Fix four comparable tasks per Agent-week, human review capacity of 20 tasks/week (10 hours at 30 minutes each), and demand of 60 tasks/week. Show Agent capacity and accepted deliveries. This is a steady-state capacity model, not a queue or an estimate of the Anthropic wait-time statistic.
2. Delegation: senior hours released = 12 hours of previous senior effort minus combined guidance, review and rework time. Adjust only that combined time. Assume the same task basket is completed and accepted by the junior engineer with Agent assistance. Negative results remain visible. This does not calculate total team hours, profit, or hiring ROI.
3. Staffing: relative headcount = valuable task demand multiplier / effective per-person productivity multiplier. Adjust only task demand; fix productivity at three times the original. Plot demand against required headcount, with a 100% baseline. Work must be comparable and quality-adjusted; this is an aggregate staffing equivalent, not a forecast or a recommendation to dismiss or recruit people.

Every experiment has exactly one slider. Fixed conditions appear beside it; formula, calculation details and limitations are collapsed by default. Each has a reset button and supports keyboard input. Initial charts and results render without JavaScript; controls activate only when JavaScript is available. Keep the existing paper/ink/blue style.

## Execution and acceptance

- Add the official MDX integration after checking its documentation and installed Astro source. Existing Markdown articles remain as-is.
- Add pure model functions and tests for plateaus, zero review capacity, negative delegation savings, equality, and the article's 2/3 and 5/3 staffing cases.
- Preserve the original temporary file. Retain the Chinese title and use first-person singular for author narration. Incorporate the user's Allee-effect section as section 6, with the ecological analogy and company-size hypothesis clearly distinguished.
- The first delivery was a development-only Chinese draft. After the user accepted that version and asked to continue, prepare the English article, localized model labels/results and paired regular article routes. Both local article records are now `draft: false`, so the local production build includes them, their RSS items and sitemap entries. This does not publish or push anything.
- Retain `/preview/agent-cognitive-leverage/` as a development-only, noindex local review route. It remains absent from the production output.
- Verify `node --test src/lib/article-models.test.ts`, `npm run build`, and development preview behavior in a browser. Check defaults, changed values, reset, keyboard use, narrow layout and browser errors.

No backend, analytics, simulator framework, optimization solver, new charting library, Git commit, push or deployment is in scope.

## Initial version validation record

- Six Node tests pass, including all slider extremes and an exact fractional plateau point.
- The development route returns one article H1 and three experiments. Static HTML includes default charts/results and disabled controls for a readable no-JavaScript fallback; the route sends a noindex meta directive.
- An external temporary JSDOM harness exercises the actual component script: control activation, changing all three models, negative and zero delegation savings, staffing on both sides of equality, SVG marker changes, instance isolation, labels and reset. No DOM-test dependency is added to the blog.
- Browser control reports no available apps or browsers. Desktop/mobile visual layout and native drag/keyboard behavior remain unverified; the DOM harness does not substitute for browser acceptance.

- MDX is pinned to 8.0.0, whose declared minimum is Node 22.12.0 and whose Astro peer range includes the repository's Astro 7.3.3. The original locked dependency versions are preserved; only MDX and its nested Markdown processor are added.
- `npm run build` passes Astro diagnostics and all 18 pages' SEO checks. The bundler emits a warning about Astro's generated `use astro:head-inject` directive; the draft's production publication behavior remains unqualified. The local preview and built client bundle are exercised separately.
- Production HTML, RSS and sitemaps contain neither the draft nor references to its client script. Astro still emits unreferenced model JS/CSS assets (the client bundle is about 7.7 KB); no article body is included in those assets.

## Local review

Worktree: `/Users/zhouyang/project/myself/lewiszhou-blog-agent-models`, branch `feat/agent-cognitive-models`.

```sh
export PATH=/Users/zhouyang/.nvm/versions/node/v25.4.0/bin:$PATH
npm run dev -- --host 127.0.0.1 --port 4327
```

Open `http://127.0.0.1:4327/preview/agent-cognitive-leverage/`. The three links above the title jump directly to each experiment. `npm run preview` serves the production build and intentionally does not include this development-only draft route.

## Single-parameter revision

The user requested a simpler experience. Remove the extra controls entirely, combine guidance/review/rework into one slider, and simplify the staffing chart to a single input/output relationship. Five updated model tests cover slider ranges, plateaus, negative savings and the staffing break-even point. The development page and bundled script are checked with the updated DOM harness; browser visual acceptance remains unavailable.

## Bilingual publication preparation

- Added `agent-cognitive-leverage.en.mdx`; both language records share their slug, translation key, date, section sequence, numerical examples and three cited sources. English widgets explicitly use `lang="en"`; all their instructions, axes, assumptions and live results are localized. Both languages share the same calculations and control ranges.
- The writing review preserves the user's argument and speculative boundaries. The opening now states the main claim directly. Multipliers consistently mean the new level divided by the original level. Team experience remains attributed to the author's team; the ecology section remains an analogy and hypothesis. No measured team productivity, optimal team size, or staffing forecast is invented.
- Source checks from the preceding review covered Anthropic's hiring/runtime/waiting figures, the automation/new-tasks paper, and the original Allee-effect paper. The lack of a measured organizational case is an evidence boundary, not a missing result to fabricate. The article retains its approved essay structure.
- `npm test` runs six tests. The additional bilingual test verifies identical inputs, values and chart geometry, with no Chinese text in English model copy. The test command uses Node's type-stripping flag, documented for the existing Node 22.12 minimum, without adding a test dependency. `npm run build` now runs these tests before Astro diagnostics, static generation and SEO checks.
- The SEO checker now also verifies English article metadata, a single slider per model, matching model/page languages, English copy, a readable no-JavaScript fallback, a built client script on interactive pages, and no model script on other pages.
- Local production build: 20 HTML pages pass SEO checks. A temporary DOM harness loads the actual production HTML and bundled script for both articles, exercises turning points/reset in both languages, checks canonical/reciprocal alternates, and verifies RSS/sitemap inclusion. Actual browser visual and native keyboard/drag acceptance remain unavailable.
- Existing bundler warnings about Astro's generated `use astro:head-inject` directives remain visible. Actual generated scripts are present and both language variants execute in the DOM harness; no warning suppression is added.

Local article routes after rebasing onto the published mainline:

- Chinese: `http://127.0.0.1:4327/zh/writing/agent-cognitive-leverage/`
- English: `http://127.0.0.1:4327/writing/agent-cognitive-leverage/`

The user has explicitly authorized publication. Continue via `feat/agent-cognitive-models`, a verified Cloudflare Preview, a PR and an approved production merge; bind deployment verification to the final commit SHA.


## Release integration

On publication approval, a fresh fetch found that the initial local baseline predated mainline PRs #5 through #9. Rebased onto `3696a20f1f2c4bb2e62aae671294734f85154358`, preserving the already-published English-default routing, Chinese `/zh/` routes, article typography, X profile links and generated article-specific social cards. No route migration is part of this change. The widget now uses the mainline body font token; model tests and existing social-card tests both run in `npm test` and the build. Revalidate all artifacts against this integrated revision before merging.
