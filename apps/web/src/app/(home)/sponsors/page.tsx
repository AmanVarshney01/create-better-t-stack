export const dynamic = "force-static";

import { api } from "@better-t-stack/backend/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { fetchSponsors } from "@/lib/sponsors";

import { SponsorsPage } from "./_components/sponsors-page";

export const metadata: Metadata = {
  title: "Sponsors - Better-T-Stack",
  description: "The companies and developers funding Better-T-Stack development",
  openGraph: {
    title: "Sponsors - Better-T-Stack",
    description: "The companies and developers funding Better-T-Stack development",
    url: "https://better-t-stack.dev/sponsors",
    images: [
      {
        url: "https://better-t-stack.dev/og/site/sponsors.png",
        width: 1200,
        height: 630,
        alt: "Better-T-Stack Sponsors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sponsors - Better-T-Stack",
    description: "The companies and developers funding Better-T-Stack development",
    images: ["https://better-t-stack.dev/og/site/sponsors.png"],
  },
};

export default async function Sponsors() {
  const [sponsorsData, stats] = await Promise.all([
    fetchSponsors(),
    fetchQuery(api.analytics.getStats, {}),
  ]);
  return <SponsorsPage sponsorsData={sponsorsData} totalProjects={stats.totalProjects} />;
}
