import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Better T Stack",
    short_name: "Better T Stack",
    description:
      "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
    start_url: "/new",
    display: "standalone",
    background_color: "#141415",
    theme_color: "#9bb4bc",
    icons: [
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
