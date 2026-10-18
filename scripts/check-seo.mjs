import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url);
const dist = new URL("dist/", root);
const errors = [];

for (const file of ["robots.txt", "sitemap-index.xml", "sitemap-0.xml"]) {
  if (!existsSync(new URL(file, dist))) errors.push(`Missing ${file}`);
}

for (const file of ["rss.xml", "zh/rss.xml"]) {
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
const pages = new Map();
const articleImages = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(join(dist.pathname, file), "utf8");
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1]?.trim();
  const canonical = html.match(/<link rel="canonical" href="(.*?)"/s)?.[1]?.trim();
  const htmlLang = html.match(/<html lang="(.*?)"/)?.[1]?.trim();
  const expectedLang = file.startsWith("zh/") ? "zh-CN" : "en";
  const h1Count = (html.match(/<h1\b/g) ?? []).length;
  const jsonScripts = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  let articleImage;
  const hreflangs = Object.fromEntries(
    [...html.matchAll(/<link rel="alternate" hreflang="(.*?)" href="(.*?)"/g)]
      .map((match) => [match[1], match[2]]),
  );

  if (!title) errors.push(`${file}: missing title`);
  if (!description) errors.push(`${file}: missing meta description`);
  if (!canonical?.startsWith("https://lewiszhou.dev/")) errors.push(`${file}: invalid canonical URL`);
  if (htmlLang !== expectedLang) errors.push(`${file}: expected html lang ${expectedLang}, found ${htmlLang}`);
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
      const data = JSON.parse(match[1]);
      const pageNode = data["@graph"]?.find((node) => node["@type"] === "WebPage" || node["@type"] === "BlogPosting");
      if (pageNode?.["@type"] === "BlogPosting") articleImage = pageNode.image;
      if (pageNode?.inLanguage !== expectedLang) errors.push(`${file}: JSON-LD language does not match ${expectedLang}`);
    } catch {
      errors.push(`${file}: invalid JSON-LD`);
    }
  }

  if (canonical && hreflangs[expectedLang] !== canonical) errors.push(`${file}: missing self hreflang`);
  const otherLang = expectedLang === "en" ? "zh-CN" : "en";
  if (!hreflangs[otherLang]) errors.push(`${file}: missing ${otherLang} alternate`);
  if (canonical) pages.set(canonical, { file, lang: expectedLang, hreflangs });

  if (/^(?:zh\/)?writing\/.+\/index\.html$/.test(file)) {
    if (!html.includes('property="og:type" content="article"')) errors.push(`${file}: missing article Open Graph type`);
    if (!html.includes('"@type":"BlogPosting"')) errors.push(`${file}: missing BlogPosting schema`);
    if (!html.includes('rel="author"')) errors.push(`${file}: missing visible author link`);
    const image = html.match(/<meta property="og:image" content="(.*?)"/)?.[1];
    const twitterImage = html.match(/<meta name="twitter:image" content="(.*?)"/)?.[1];
    if (!image?.startsWith(`https://lewiszhou.dev/social/${expectedLang}/`) || !image.endsWith(".png")) {
      errors.push(`${file}: missing article-specific social image`);
    } else {
      if (articleImages.has(image)) errors.push(`${file}: shares a social image with ${articleImages.get(image)}`);
      articleImages.set(image, file);
      const imageFile = new URL(new URL(image).pathname.slice(1), dist);
      if (!existsSync(imageFile)) {
        errors.push(`${file}: social image does not exist`);
      } else {
        const png = readFileSync(imageFile);
        if (png.length < 24 || png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" || png.readUInt32BE(16) !== 1200 || png.readUInt32BE(20) !== 630 || png.length >= 5_000_000) {
          errors.push(`${file}: social image must be a 1200x630 PNG under 5 MB`);
        }
      }
    }
    if (twitterImage !== image) errors.push(`${file}: Twitter and Open Graph images differ`);
    if (articleImage !== image) errors.push(`${file}: BlogPosting image does not match the social image`);
  }

  const experiments = [...html.matchAll(/<article-model\b([^>]*)>(.*?)<\/article-model>/gs)];
  for (const [, attributes, body] of experiments) {
    if (!attributes.includes(`lang="${expectedLang}"`)) errors.push(`${file}: interactive model language does not match the page`);
    if ((body.match(/type="range"/g) ?? []).length !== 1) errors.push(`${file}: each model must have exactly one slider`);
    if (!body.includes("<noscript>")) errors.push(`${file}: interactive model is missing its static fallback explanation`);
    if (expectedLang === "en" && /\p{Script=Han}/u.test(body)) errors.push(`${file}: English model contains untranslated Chinese copy`);
  }
  const modelScript = html.match(/<script[^>]+src="([^"]*ArticleModel[^"]*\.js)"/);
  if (experiments.length && (!modelScript || !existsSync(join(dist.pathname, modelScript[1])))) {
    errors.push(`${file}: interactive model client script is missing`);
  }
  if (!experiments.length && modelScript) errors.push(`${file}: noninteractive page loads the model script`);
}

for (const file of htmlFiles) {
  const html = readFileSync(join(dist.pathname, file), "utf8");
  for (const match of html.matchAll(/href="((?:\/zh)?\/topics\/[^"?#]+)"/g)) {
    if (!pages.has(`https://lewiszhou.dev${match[1]}`)) errors.push(`${file}: topic link does not resolve to a built page: ${match[1]}`);
  }
}

for (const [canonical, page] of pages) {
  for (const [alternateLang, alternateURL] of Object.entries(page.hreflangs)) {
    const target = pages.get(alternateURL);
    if (!target) {
      errors.push(`${page.file}: ${alternateLang} alternate does not resolve to a built page`);
      continue;
    }
    if (target.hreflangs[page.lang] !== canonical) errors.push(`${page.file}: alternate link is not reciprocal with ${target.file}`);
  }
}

if (existsSync(new URL("sitemap-0.xml", dist))) {
  const sitemap = readFileSync(new URL("sitemap-0.xml", dist), "utf8");
  for (const feed of ["rss.xml", "zh/rss.xml"]) {
    if (!sitemap.includes(`<loc>https://lewiszhou.dev/${feed}</loc>`)) errors.push(`${feed}: feed URL missing from sitemap`);
  }
  for (const [canonical, file] of canonicals) {
    if (!sitemap.includes(`<loc>${canonical}</loc>`)) errors.push(`${file}: canonical URL missing from sitemap`);
  }
}

for (const [file, lang] of [["rss.xml", "en"], ["zh/rss.xml", "zh-CN"]]) {
  if (!existsSync(new URL(file, dist))) continue;
  const feed = readFileSync(new URL(file, dist), "utf8");
  const items = [...feed.matchAll(/<item>(.*?)<\/item>/gs)];
  if (!items.length) errors.push(`${file}: feed has no articles`);
  for (const [, item] of items) {
    const link = item.match(/<link>(.*?)<\/link>/s)?.[1];
    if (pages.get(link)?.lang !== lang) errors.push(`${file}: article link does not resolve to a ${lang} page: ${link}`);
  }
}

const redirectsFile = new URL("_redirects", dist);
if (!existsSync(redirectsFile)) {
  errors.push("Missing legacy English redirects");
} else {
  const redirects = readFileSync(redirectsFile, "utf8").split("\n");
  for (const rule of ["/en / 301", "/en/* /:splat 301"]) {
    if (!redirects.includes(rule)) errors.push(`Missing redirect: ${rule}`);
  }
}
if (existsSync(new URL("en/", dist))) errors.push("Legacy /en/ pages should redirect instead of being built");

if (errors.length) {
  console.error(`SEO checks failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`SEO checks passed for ${htmlFiles.length} HTML pages.`);
