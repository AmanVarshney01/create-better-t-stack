import type { Metadata } from "next";
import { Suspense } from "react";

import { loadStackParams, serializeStackParams } from "@/lib/stack-url-state";
import {
  generateStackOgImageUrl,
  generateStackSharingUrl,
  generateStackSummary,
} from "@/lib/stack-utils";

import { StackDisplay } from "./_components/stack-display";

interface StackPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ searchParams }: StackPageProps): Promise<Metadata> {
  const params = await loadStackParams(searchParams);
  const projectName = params.projectName || "my-better-t-app";
  const title = `${projectName} – Better-T-Stack`;
  const description = generateStackSummary(params);
  const ogImage = generateStackOgImageUrl(params, "https://better-t-stack.dev");
  return {
    title,
    description,
    alternates: {
      canonical: serializeStackParams("/stack", params),
    },
    openGraph: {
      title,
      description,
      url: generateStackSharingUrl(params),
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${projectName} tech stack`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function StackPage({ searchParams }: StackPageProps) {
  const stackState = await loadStackParams(searchParams);

  return (
    <Suspense>
      <StackDisplay stackState={stackState} />
    </Suspense>
  );
}
