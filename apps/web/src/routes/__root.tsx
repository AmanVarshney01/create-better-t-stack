import type { ReactNode } from "react";

import { Outlet, HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

import { Navbar } from "@/components/navbar";
import Providers from "@/components/providers";
import "@/app/global.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Better-T-Stack" },
      {
        name: "description",
        content:
          "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
      },
      {
        name: "keywords",
        content:
          "TypeScript, project scaffolding, boilerplate, type safety, Drizzle, Prisma, hono, elysia, turborepo, trpc, orpc, turso, neon, Better-Auth, convex, monorepo, Better-T-Stack, create-better-t-stack",
      },
      { property: "og:title", content: "Better-T-Stack" },
      {
        property: "og:description",
        content:
          "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
      },
      { property: "og:url", content: "https://better-t-stack.dev" },
      { property: "og:site_name", content: "Better-T-Stack" },
      {
        property: "og:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
      { property: "og:locale", content: "en_US" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Better-T-Stack" },
      {
        name: "twitter:description",
        content:
          "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
      },
      {
        name: "twitter:image",
        content: "https://r2.better-t-stack.dev/og.png",
      },
    ],
    links: [{ rel: "icon", href: "/logo.svg" }],
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>{children}</Providers>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
