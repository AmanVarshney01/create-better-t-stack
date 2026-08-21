export const dynamic = "force-static";

import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";
import { source } from "@/lib/source";

const staticPages = [
  { path: "/", priority: 1 },
  { path: "/new", priority: 0.9 },
  { path: "/docs", priority: 0.9 },
  { path: "/stack", priority: 0.7 },
  { path: "/showcase", priority: 0.6 },
  { path: "/analytics", priority: 0.5 },
  { path: "/sponsors", priority: 0.5 },
  { path: "/about", priority: 0.5 },
  { path: "/contact", priority: 0.4 },
  { path: "/privacy", priority: 0.4 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const docsPages = source
    .getPages()
    .filter((page) => page.url !== "/docs")
    .map((page) => ({
      url: `${SITE_URL}${page.url}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    ...staticPages.map(({ path, priority }) => ({
      url: new URL(path, SITE_URL).toString(),
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...docsPages,
  ];
}
