import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { RootProvider } from "fumadocs-ui/provider/next";
import { Geist, Geist_Mono } from "next/font/google";

import Providers from "@/components/providers";

import "./global.css";
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-mono",
});

const ogImage = "https://r2.better-t-stack.dev/og.png";

export const metadata: Metadata = {
  title: "Better-T-Stack",
  description:
    "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
  keywords: [
    "TypeScript",
    "project scaffolding",
    "boilerplate",
    "type safety",
    "Drizzle",
    "Prisma",
    "hono",
    "elysia",
    "turborepo",
    "trpc",
    "orpc",
    "turso",
    "neon",
    "Better-Auth",
    "convex",
    "monorepo",
    "Better-T-Stack",
    "create-better-t-stack",
  ],
  authors: [{ name: "Better-T-Stack Team" }],
  creator: "Better-T-Stack",
  publisher: "Better-T-Stack",
  formatDetection: {
    email: false,
    telephone: false,
  },
  metadataBase: new URL("https://better-t-stack.dev"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Better-T-Stack",
    description:
      "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
    url: "https://better-t-stack.dev",
    siteName: "Better-T-Stack",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Better-T-Stack",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Better-T-Stack",
    description:
      "A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  category: "Technology",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-light.svg", media: "(prefers-color-scheme: light)", type: "image/svg+xml" },
      { url: "/logo-dark.svg", media: "(prefers-color-scheme: dark)", type: "image/svg+xml" },
    ],
    shortcut: "/favicon/favicon.svg",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(geist.variable, geistMono.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body>
        <RootProvider
          search={{
            options: {
              type: "static",
            },
          }}
          theme={{
            enableSystem: false,
            defaultTheme: "dark",
          }}
        >
          <Providers>{children}</Providers>
        </RootProvider>
      </body>
    </html>
  );
}
