import { api } from "@better-t-stack/backend/convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";

import ShowcasePage from "@/app/(home)/showcase/_components/showcase-page";

export const Route = createFileRoute("/showcase")({
  head: () => ({
    meta: [
      { title: "Showcase - Better-T-Stack" },
      {
        name: "description",
        content: "Projects created with Better-T-Stack",
      },
      { property: "og:title", content: "Showcase - Better-T-Stack" },
      {
        property: "og:description",
        content: "Projects created with Better-T-Stack",
      },
      { property: "og:url", content: "https://better-t-stack.dev/showcase" },
      {
        property: "og:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Showcase - Better-T-Stack" },
      {
        name: "twitter:description",
        content: "Projects created with Better-T-Stack",
      },
      {
        name: "twitter:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
    ],
  }),
  component: ShowcaseRoute,
});

function ShowcaseRoute() {
  const showcaseProjects = useQuery(api.showcase.getShowcaseProjects);

  return <ShowcasePage showcaseProjects={showcaseProjects ?? []} />;
}
