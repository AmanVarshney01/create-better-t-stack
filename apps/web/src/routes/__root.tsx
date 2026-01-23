import type { ReactNode } from "react";

import { Outlet, HeadContent, Scripts, createRootRoute, Link } from "@tanstack/react-router";
import { Analytics } from "@vercel/analytics/react";

import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";
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
      { title: "Better Fullstack" },
      {
        name: "description",
        content:
          "A CLI tool for scaffolding production-ready fullstack projects with customizable configurations. Supports multiple languages and frameworks.",
      },
      {
        name: "keywords",
        content:
          "fullstack, CLI, project scaffolding, boilerplate, TypeScript, Rust, Drizzle, Prisma, hono, elysia, turborepo, trpc, orpc, turso, neon, Better-Auth, convex, monorepo, Better-Fullstack",
      },
      { property: "og:title", content: "Better Fullstack" },
      {
        property: "og:description",
        content:
          "A CLI tool for scaffolding production-ready fullstack projects with customizable configurations. Supports multiple languages and frameworks.",
      },
      { property: "og:site_name", content: "Better Fullstack" },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Better Fullstack" },
      {
        name: "twitter:description",
        content:
          "A CLI tool for scaffolding production-ready fullstack projects with customizable configurations. Supports multiple languages and frameworks.",
      },
    ],
    links: [
      { rel: "icon", href: "/logo.svg" },
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
      </head>
      <body className="bg-background text-foreground">
        <Providers>{children}</Providers>
        <Analytics />
        <Scripts />
      </body>
    </html>
  );
}
