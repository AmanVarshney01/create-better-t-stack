export const dynamic = "force-static";

import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import SearchDialog from "@/components/search";
import { cn } from "@/lib/utils";
import "./global.css";
import Providers from "@/components/providers";

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

const ogImage =
	"https://api.screenshothis.com/v1/screenshots/take?api_key=ss_live_NQJgRXqHcKPwnoMTuQmgiwLIGbVfihjpMyQhgsaMyNBHTyesvrxpYNXmdgcnxipc&url=https%3A%2F%2Fbetter-t-stack.dev%2F&width=1200&height=630&block_ads=true&block_cookie_banners=true&block_trackers=true&device_scale_factor=0.70&prefers_color_scheme=dark&is_cached=true&cache_key=bts";

export const metadata: Metadata = {
	title: "Better-T Stack",
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
		"Better-T Stack",
		"create-better-t-stack",
	],
	authors: [{ name: "Better-T Stack Team" }],
	creator: "Better-T Stack",
	publisher: "Better-T Stack",
	formatDetection: {
		email: false,
		telephone: false,
	},
	metadataBase: new URL("https://better-t-stack.dev"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Better-T Stack",
		description:
			"A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
		url: "https://better-t-stack.dev",
		siteName: "Better-T Stack",
		images: [
			{
				url: ogImage,
				width: 1200,
				height: 630,
				alt: "Better-T Stack",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Better-T Stack",
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
		icon: "/logo.svg",
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
						SearchDialog,
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
