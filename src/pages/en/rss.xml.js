import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = (await getCollection("writing", ({ data }) => !data.draft && data.lang === "en"))
    .sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());

  return rss({
    title: "Lewis Zhou — Still Solving",
    description: "Making complex problems concrete, one verified step at a time.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: `/en/writing/${post.data.urlSlug}/`,
    })),
  });
}
