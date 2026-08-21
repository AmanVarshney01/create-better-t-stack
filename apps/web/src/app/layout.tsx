import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";

import Providers from "@/components/providers";
import {
  NPM_PACKAGE_URL,
  REPOSITORY_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site";

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

const ogImage = `${SITE_URL}/og/site/home.png`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@id": `${SITE_URL}/#project`,
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon/web-app-manifest-512x512.png`,
      sameAs: [REPOSITORY_URL, NPM_PACKAGE_URL, "https://x.com/amanvarshney01"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "project support",
        email: SUPPORT_EMAIL,
        url: `${SITE_URL}/contact`,
        availableLanguage: "English",
      },
    },
    {
      "@id": `${SITE_URL}/#software`,
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      alternateName: "create-better-t-stack",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Linux, macOS, Windows",
      isAccessibleForFree: true,
      license: `${REPOSITORY_URL}/blob/main/LICENSE`,
      downloadUrl: NPM_PACKAGE_URL,
      installUrl: `${SITE_URL}/docs`,
      softwareHelp: `${SITE_URL}/docs`,
      provider: {
        "@id": `${SITE_URL}/#project`,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "Interactive and non-interactive TypeScript project scaffolding",
        "Structured JSON commands for coding agents",
        "Local stdio MCP server",
        "Programmatic npm API",
      ],
      sameAs: [REPOSITORY_URL, NPM_PACKAGE_URL],
    },
    {
      "@id": `${SITE_URL}/#website`,
      "@type": "WebSite",
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      publisher: {
        "@id": `${SITE_URL}/#project`,
      },
    },
  ],
};

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
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
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
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
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
          }}
        />
        <Script
          src="https://umami.amanv.cloud/script.js"
          data-website-id="3fe218f9-a51b-40c3-ab37-d65e6963d686"
          strategy="afterInteractive"
        />
        <RootProvider
          search={{
            options: {
              type: "static",
            },
          }}
          theme={{
            enableSystem: true,
            defaultTheme: "system",
          }}
        >
          <Providers>{children}</Providers>
        </RootProvider>
      </body>
    </html>
  );
}
