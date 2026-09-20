import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { locales } from "./i18n";

const writing = defineCollection({
  loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(locales),
    urlSlug: z.string(),
    translationKey: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(["systems", "agents", "product", "build"]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
