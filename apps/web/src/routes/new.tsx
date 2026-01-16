import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Suspense } from "react";

import StackBuilder from "@/app/(home)/new/_components/stack-builder";
import { stackSearchSchema } from "@/lib/stack-search-schema";

export const Route = createFileRoute("/new")({
  validateSearch: zodValidator(stackSearchSchema),
  head: () => ({
    meta: [
      { title: "Stack Builder - Better-T-Stack" },
      {
        name: "description",
        content: "Interactive UI to roll your own stack",
      },
      { property: "og:title", content: "Stack Builder - Better-T-Stack" },
      {
        property: "og:description",
        content: "Interactive UI to roll your own stack",
      },
      { property: "og:url", content: "https://better-t-stack.dev/new" },
      {
        property: "og:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Stack Builder - Better-T-Stack" },
      {
        name: "twitter:description",
        content: "Interactive UI to roll your own stack",
      },
      {
        name: "twitter:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
    ],
  }),
  component: StackBuilderPage,
});

function StackBuilderPage() {
  return (
    <Suspense>
      <div className="grid h-[calc(100vh-64px)] w-full flex-1 grid-cols-1 overflow-hidden">
        <StackBuilder />
      </div>
    </Suspense>
  );
}
