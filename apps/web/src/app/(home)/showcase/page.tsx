export const dynamic = "force-static";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { ShowcasePage } from "./_components/showcase-page";

export const metadata: Metadata = {
  title: "Showcase - Better-T-Stack",
  description: "Projects created with Better-T-Stack",
  openGraph: {
    title: "Showcase - Better-T-Stack",
    description: "Projects created with Better-T-Stack",
    url: "https://better-t-stack.dev/showcase",
    images: [
      {
        url: "https://better-t-stack.dev/og/site/showcase.png",
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
    images: ["https://better-t-stack.dev/og/site/showcase.png"],
  },
};

export default async function Showcase() {
  const showcaseProjects = await fetchQuery(api.showcase.getShowcaseProjects);
  return <ShowcasePage showcaseProjects={showcaseProjects} />;
}
