export const dynamic = "force-static";

import { api } from "@create-js-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { ShowcasePage } from "./_components/showcase-page";

export const metadata: Metadata = {
  title: "Showcase - Create-JS-Stack",
  description: "Projects created with Create-JS-Stack",
  openGraph: {
    title: "Showcase - Create-JS-Stack",
    description: "Projects created with Create-JS-Stack",
    url: "https://create-js-stack.dev/showcase",
    images: [
      {
        url: "https://r2.create-js-stack.dev/og.png",
        width: 1200,
        height: 630,
        alt: "Create-JS-Stack Showcase",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Showcase - Create-JS-Stack",
    description: "Projects created with Create-JS-Stack",
    images: ["https://r2.create-js-stack.dev/og.png"],
  },
};

export default async function Showcase() {
  const showcaseProjects = await fetchQuery(api.showcase.getShowcaseProjects);
  return <ShowcasePage showcaseProjects={showcaseProjects} />;
}
