import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import type { Locale } from "../i18n";

interface CardData {
  title: string;
  category: string;
  lang: Locale;
  publishedAt: Date;
  urlSlug: string;
}

const font = {
  fontFiles: [resolve("src/assets/fonts/NotoSansCJKsc-Regular.otf")],
  loadSystemFonts: false,
  defaultFontFamily: "Noto Sans CJK SC",
};

export function socialCardPath(post: CardData): string {
  // Bump the template version when its appearance or font changes.
  const hash = createHash("sha256").update(JSON.stringify([
    "v1", post.title, post.category, post.lang, post.publishedAt.toISOString(),
  ])).digest("hex").slice(0, 12);
  return `/social/${post.lang}/${post.urlSlug}-${hash}.png`;
}

function escapeXML(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]!);
}

function wrapTitle(title: string, lang: Locale, fontSize: number): string[] {
  const lines: string[] = [];
  let line = "";
  let width = 0;
  const segments = new Intl.Segmenter(lang, { granularity: "word" }).segment(title.trim());
  const estimate = (text: string) => [...text].reduce((sum, char) => sum + (/\s/.test(char) ? 0.3 : /[MW@%]/.test(char) ? 1 : /[ilI.,:;'!]/.test(char) ? 0.3 : /\p{ASCII}/u.test(char) ? 0.6 : 1), 0) * fontSize;
  const totalWidth = estimate(title.trim());
  const limit = Math.min(1056, Math.max(700, totalWidth / Math.ceil(totalWidth / 1056) + fontSize));
  for (const { segment } of segments) {
    // Split unusually long words so an identifier cannot overflow the card.
    const parts = estimate(segment) > limit ? [...segment] : [segment];
    for (const part of parts) {
      const partWidth = estimate(part);
      if (line && width + partWidth > limit) {
        lines.push(line.trim());
        line = "";
        width = 0;
      }
      if (!line && !part.trim()) continue;
      line += part;
      width += partWidth;
    }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

export function renderSocialCard(post: CardData): Buffer {
  for (let size = 72; size >= 40; size -= 4) {
    const lines = wrapTitle(post.title, post.lang, size);
    if (!lines.length || lines.length > 3) continue;
    const firstY = 320 - ((lines.length - 1) * size * 1.3) / 2;
    const title = lines.map((line, index) => `<text x="72" y="${firstY + index * size * 1.3}" font-size="${size}">${escapeXML(line)}</text>`).join("");
    const titleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><g font-family="Noto Sans CJK SC">${title}</g></svg>`;
    const bounds = new Resvg(titleSVG, { font }).getBBox();
    if (!bounds || bounds.x < 72 || bounds.x + bounds.width > 1128 || bounds.y < 160 || bounds.y + bounds.height > 450) continue;
    const date = post.publishedAt.toISOString().slice(0, 10);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
      <rect width="1200" height="630" fill="#fafaf9"/>
      <path d="M72 72h1056M72 550h1056" stroke="#d8d8d4"/>
      <g font-family="Noto Sans CJK SC" fill="#242424">
        <text x="72" y="123" font-size="25">LEWIS ZHOU</text>
        <text x="1128" y="123" text-anchor="end" font-size="24" fill="#4d6b91">${escapeXML(post.category)}</text>
        ${title}
        <text x="72" y="505" font-size="24" fill="#777773">${post.lang === "en" ? "Still Solving" : "持续求解"} · ${date}</text>
        <text x="72" y="593" font-size="22" fill="#777773">lewiszhou.dev</text>
      </g>
      <circle cx="1116" cy="585" r="8" fill="#4d6b91"/>
    </svg>`;
    return new Resvg(svg, { font }).render().asPng();
  }
  throw new Error(`Social card title cannot fit without truncation: ${post.urlSlug} (${post.lang})`);
}
