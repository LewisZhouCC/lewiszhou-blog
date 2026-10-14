import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { categoryLabels } from "../../../i18n";
import { renderSocialCard, socialCardPath } from "../../../lib/social-card";

export async function getStaticPaths() {
  const posts = await getCollection("writing", ({ data }) => !data.draft);
  return posts.map(({ data }) => {
    const card = { ...data, category: categoryLabels[data.lang][data.category] };
    const path = socialCardPath(card);
    return { params: { lang: data.lang, slug: path.split(`/social/${data.lang}/`)[1].replace(/\.png$/, "") }, props: { card } };
  });
}

export const GET: APIRoute = ({ props }) => new Response(
  new Uint8Array(renderSocialCard(props.card)),
  { headers: { "Content-Type": "image/png" } },
);
