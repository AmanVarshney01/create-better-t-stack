import { api } from "@better-t-stack/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

import { AnalyticsClient } from "./analytics-client";

export const metadata: Metadata = {
  title: "Analytics - Better-T-Stack",
  description: "Convex-backed project creation analytics for Better-T-Stack.",
  alternates: {
    canonical: "/analytics",
  },
  openGraph: {
    title: "Analytics - Better-T-Stack",
    description: "Convex-backed project creation analytics for Better-T-Stack.",
    url: `${SITE_URL}/analytics`,
    images: [
      {
        url: `${SITE_URL}/og/site/analytics.png`,
        width: 1200,
        height: 630,
        alt: "Better-T-Stack Convex Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics - Better-T-Stack",
    description: "Convex-backed project creation analytics for Better-T-Stack.",
    images: [`${SITE_URL}/og/site/analytics.png`],
  },
};

export default async function Analytics() {
  const [preloadedStats, preloadedDailyStats, preloadedMonthlyStats] = await Promise.all([
    preloadQuery(api.analytics.getStats, {}),
    preloadQuery(api.analytics.getDailyStats, { days: 30 }),
    preloadQuery(api.analytics.getMonthlyStats, {}),
  ]);

  return (
    <AnalyticsClient
      preloadedStats={preloadedStats}
      preloadedDailyStats={preloadedDailyStats}
      preloadedMonthlyStats={preloadedMonthlyStats}
    />
  );
}
