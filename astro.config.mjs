import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://lewiszhou.dev",
  output: "static",
  integrations: [mdx(), sitemap({
    customPages: ["https://lewiszhou.dev/rss.xml", "https://lewiszhou.dev/zh/rss.xml"],
  })],
});
