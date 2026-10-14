import assert from "node:assert/strict";
import { test } from "node:test";
import { renderSocialCard, socialCardPath } from "../src/lib/social-card.ts";

const post = {
  title: "I Think 2027 Will Be the Breakout Year for A2A",
  category: "Agents",
  lang: "en" as const,
  publishedAt: new Date("2026-10-14"),
  urlSlug: "a2a-2027",
};

test("card addresses are stable and change when visible content changes", () => {
  assert.equal(socialCardPath(post), socialCardPath({ ...post }));
  for (const changed of [{ title: "New title" }, { lang: "zh-CN" as const }, { category: "Systems" }, { publishedAt: new Date("2026-10-15") }]) {
    assert.notEqual(socialCardPath(post), socialCardPath({ ...post, ...changed }));
  }
});

test("renders English, Chinese, XML characters and a long unbroken word", () => {
  for (const title of [post.title, "我判断，2027 年将是 A2A 的爆发年", 'Agents & APIs: <goals> and "commitments"', "W".repeat(70)]) {
    const png = renderSocialCard({ ...post, title });
    assert.equal(png.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(png.readUInt32BE(16), 1200);
    assert.equal(png.readUInt32BE(20), 630);
  }
});

test("fails rather than silently cutting an unrenderable title", () => {
  assert.throws(() => renderSocialCard({ ...post, title: "" }), /cannot fit/);
  assert.throws(() => renderSocialCard({ ...post, title: "长".repeat(500) }), /cannot fit/);
});
