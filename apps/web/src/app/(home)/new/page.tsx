import type { Metadata } from "next";
import { Suspense } from "react";
import StackBuilder from "./_components/stack-builder";

export const metadata: Metadata = {
  title: "Stack Builder - Better-T-Stack",
  description: "Interactive Ui to roll your own stack",
  openGraph: {
    title: "Stack Builder - Better-T-Stack",
    description: "Interactive Ui to roll your own stack",
    url: "https://better-t-stack.dev/new",
    images: [
      {
        url: "https://r2.better-t-stack.dev/og.png",
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
    images: ["https://r2.better-t-stack.dev/og.png"],
  },
};

export default function FullScreenStackBuilder() {
  return (
    <Suspense>
      <div className="grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden">
        <StackBuilder />
      </div>
    </Suspense>
  );
}
