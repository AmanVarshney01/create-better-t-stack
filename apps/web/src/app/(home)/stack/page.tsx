import type { Metadata } from "next";
import { Suspense } from "react";
import { loadStackParams } from "@/lib/stack-server";
import { StackDisplay } from "./_components/stack-display";

interface StackPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata: Metadata = {
	title: "Tech Stack - Better-T-Stack",
	description: "View and share your custom tech stack configuration",
	openGraph: {
		title: "Tech Stack - Better-T-Stack",
		description: "View and share your custom tech stack configuration",
		url: "https://better-t-stack.dev/stack",
		images: [
			{
				url: "https://r2.better-t-stack.dev/og.png",
				width: 1200,
				height: 630,
				alt: "Better-T-Stack Tech Stack",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Tech Stack - Better-T-Stack",
		description: "View and share your custom tech stack configuration",
		images: ["https://r2.better-t-stack.dev/og.png"],
	},
};

export default async function StackPage({ searchParams }: StackPageProps) {
	const stackState = await loadStackParams(searchParams);

	return (
		<Suspense>
			<StackDisplay stackState={stackState} />
		</Suspense>
	);
}
