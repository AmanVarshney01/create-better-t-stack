import type { Metadata } from "next";
import { Suspense } from "react";

import { SITE_URL } from "@/lib/site";
import { fetchSponsors } from "@/lib/sponsors";

import { StackBuilder } from "./_components/stack-builder";

export const metadata: Metadata = {
  title: "Stack Builder - Better-T-Stack",
  description: "Interactive Ui to roll your own stack",
  alternates: {
    canonical: "/new",
  },
  openGraph: {
    title: "Stack Builder - Better-T-Stack",
    description: "Interactive Ui to roll your own stack",
    url: `${SITE_URL}/new`,
    images: [
      {
        url: `${SITE_URL}/og/site/new.png`,
        width: 1200,
        height: 630,
        alt: "Better-T-Stack Stack Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stack Builder - Better-T-Stack",
    description: "Interactive Ui to roll your own stack",
    images: [`${SITE_URL}/og/site/new.png`],
  },
};

export default async function FullScreenStackBuilder() {
  const sponsorsData = await fetchSponsors();

  return (
    <Suspense>
      <div className="grid h-[calc(100svh-64px)] w-full flex-1 grid-cols-1 overflow-hidden">
        <StackBuilder specialSponsors={sponsorsData.specialSponsors} />
      </div>
    </Suspense>
  );
}
