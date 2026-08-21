export const dynamic = "force-static";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

import { ShowcasePage } from "./_components/showcase-page";

export const metadata: Metadata = {
  title: "Showcase - Better-T-Stack",
  description: "Projects created with Better-T-Stack",
  alternates: {
    canonical: "/showcase",
  },
  openGraph: {
    title: "Showcase - Better-T-Stack",
    description: "Projects created with Better-T-Stack",
    url: `${SITE_URL}/showcase`,
    images: [
      {
        url: `${SITE_URL}/og/site/showcase.png`,
        width: 1200,
        height: 630,
        alt: "Better-T-Stack Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Showcase - Better-T-Stack",
    description: "Projects created with Better-T-Stack",
    images: [`${SITE_URL}/og/site/showcase.png`],
  },
};

export default async function Showcase() {
  const showcaseProjects = await fetchQuery(api.showcase.getShowcaseProjects);
  return <ShowcasePage showcaseProjects={showcaseProjects} />;
}
