import type { ReactNode } from "react";

import { Outlet, HeadContent, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_URL,
  DEFAULT_OG_IMAGE_WIDTH,
  DEFAULT_ROBOTS,
  DEFAULT_X_IMAGE_URL,
  SITE_NAME,
  canonicalUrl,
  organizationJsonLd,
} from "@/lib/seo";
import "@/styles/global.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-bold text-4xl text-foreground">404</h1>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}

export const Route = createRootRoute({
  notFoundComponent: NotFoundComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      {
        name: "description",
        content: DEFAULT_DESCRIPTION,
      },
      { name: "robots", content: DEFAULT_ROBOTS },
      { name: "googlebot", content: DEFAULT_ROBOTS },
      { name: "theme-color", content: "#050505" },
      { name: "application-name", content: SITE_NAME },
      {
        name: "keywords",
        content:
          "fullstack, CLI, project scaffolding, boilerplate, TypeScript, Rust, Drizzle, Prisma, hono, elysia, turborepo, trpc, orpc, turso, neon, Better-Auth, convex, monorepo, Better-Fullstack",
      },
      { property: "og:title", content: SITE_NAME },
      {
        property: "og:description",
        content: DEFAULT_DESCRIPTION,
      },
      { property: "og:url", content: canonicalUrl("/") },
      { property: "og:image", content: DEFAULT_OG_IMAGE_URL },
      { property: "og:image:alt", content: DEFAULT_OG_IMAGE_ALT },
      { property: "og:image:width", content: String(DEFAULT_OG_IMAGE_WIDTH) },
      { property: "og:image:height", content: String(DEFAULT_OG_IMAGE_HEIGHT) },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_NAME },
      {
        name: "twitter:description",
        content: DEFAULT_DESCRIPTION,
      },
      { name: "twitter:image", content: DEFAULT_X_IMAGE_URL },
      { name: "twitter:image:alt", content: DEFAULT_OG_IMAGE_ALT },
    ],
    links: [
      { rel: "canonical", href: canonicalUrl("/") },
      { rel: "icon", href: "/favicon/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { rel: "apple-touch-icon", href: "/favicon/apple-touch-icon.png" },
      { rel: "manifest", href: "/favicon/site.webmanifest" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Navbar />
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="font-sans" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  );
}
