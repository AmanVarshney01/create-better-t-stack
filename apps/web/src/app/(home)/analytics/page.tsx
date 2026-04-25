import { api } from "@create-js-stack/backend/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";

import { AnalyticsClient } from "./analytics-client";

export const metadata: Metadata = {
  title: "Analytics - Create-JS-Stack",
  description: "Convex-backed project creation analytics for Create-JS-Stack.",
  openGraph: {
    title: "Analytics - Create-JS-Stack",
    description: "Convex-backed project creation analytics for Create-JS-Stack.",
    url: "https://create-js-stack.dev/analytics",
    images: [
      {
        url: "https://r2.create-js-stack.dev/og.png",
        width: 1200,
        height: 630,
        alt: "Create-JS-Stack Convex Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analytics - Create-JS-Stack",
    description: "Convex-backed project creation analytics for Create-JS-Stack.",
    images: ["https://r2.create-js-stack.dev/og.png"],
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
