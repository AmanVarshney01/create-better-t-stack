import { RootProvider } from "fumadocs-ui/provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import "./global.css";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
	title: "Better-T Stack",
	description:
		"A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
	keywords: [
		"TypeScript",
		"project scaffolding",
		"type safety",
		"Drizzle",
		"Prisma",
		"hono",
		"elysia",
		"turborepo",
		"libSQL",
		"PostgreSQL",
		"Better-Auth",
		"Docker",
		"GitHub Actions",
		"monorepo",
		"Better-T Stack",
		"Create better t stack",
	],
	authors: [{ name: "Better-T Stack Team" }],
	creator: "Better-T Stack",
	publisher: "Better-T Stack",
	formatDetection: {
		email: false,
		telephone: false,
	},
	metadataBase: new URL("https://better-t-stack.amanv.dev"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		title: "Better-T Stack",
		description:
			"A modern CLI tool for scaffolding end-to-end type-safe TypeScript projects with best practices and customizable configurations",
		url: "https://better-t-stack.amanv.dev",
		siteName: "Better-T Stack",
		images: [
			{
				url: "/image.png",
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
		images: ["/image.png"],
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

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={poppins.className} suppressHydrationWarning>
			<body>
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
					<NuqsAdapter>{children}</NuqsAdapter>
					<Toaster />
				</RootProvider>
			</body>
		</html>
	);
}
