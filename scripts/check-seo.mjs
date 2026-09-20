import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const errors = [];

for (const file of ["robots.txt", "sitemap-index.xml", "sitemap-0.xml"]) {
  if (!existsSync(new URL(file, dist))) errors.push(`Missing ${file}`);
}

if (existsSync(new URL("robots.txt", dist))) {
  const robots = readFileSync(new URL("robots.txt", dist), "utf8");
  if (!robots.includes("Sitemap: https://lewiszhou.dev/sitemap-index.xml")) {
    errors.push("robots.txt is missing the canonical sitemap URL");
  }
}

const htmlFiles = readdirSync(dist, { recursive: true })
  .filter((file) => typeof file === "string" && file.endsWith(".html"));
const titles = new Map();
const descriptions = new Map();
const canonicals = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(join(dist.pathname, file), "utf8");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/s)?.[1]?.trim();
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];

  if (!title) errors.push(`${file}: missing title`);
  if (!description) errors.push(`${file}: missing meta description`);
  if (!canonical?.startsWith("https://lewiszhou.dev/")) errors.push(`${file}: invalid canonical URL`);
  if (h1Count !== 1) errors.push(`${file}: expected one H1, found ${h1Count}`);
  if (jsonScripts.length !== 1) errors.push(`${file}: expected one JSON-LD script`);

  if (title) {
    if (titles.has(title)) errors.push(`${file}: duplicate title with ${titles.get(title)}`);
    titles.set(title, file);
  }
  if (description) {
    if (descriptions.has(description)) errors.push(`${file}: duplicate description with ${descriptions.get(description)}`);
    descriptions.set(description, file);
  }
  if (canonical) {
    if (canonicals.has(canonical)) errors.push(`${file}: duplicate canonical with ${canonicals.get(canonical)}`);
    canonicals.set(canonical, file);
  }

  for (const match of jsonScripts) {
    try {
      JSON.parse(match[1]);
    } catch {
      errors.push(`${file}: invalid JSON-LD`);
    }
  }

  if (file.startsWith("writing/") && file !== "writing/index.html") {
    if (!html.includes('property="og:type" content="article"')) errors.push(`${file}: missing article Open Graph type`);
    if (!html.includes('"@type":"BlogPosting"')) errors.push(`${file}: missing BlogPosting schema`);
    if (!html.includes('rel="author"')) errors.push(`${file}: missing visible author link`);
  }
}

if (existsSync(new URL("sitemap-0.xml", dist))) {
  const sitemap = readFileSync(new URL("sitemap-0.xml", dist), "utf8");
  for (const [canonical, file] of canonicals) {
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`${file}: canonical URL missing from sitemap`);
  }
}

if (errors.length) {
  console.error(`SEO checks failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`SEO checks passed for ${htmlFiles.length} HTML pages.`);
