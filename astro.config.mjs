import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lewiszhou.dev",
  output: "static",
  integrations: [sitemap({
    customPages: ["https://lewiszhou.dev/rss.xml", "https://lewiszhou.dev/en/rss.xml"],
  })],
});
