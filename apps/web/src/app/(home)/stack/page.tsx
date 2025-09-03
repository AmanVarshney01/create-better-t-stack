import type { Metadata } from "next";
import { Suspense } from "react";
import { loadStackParams, serializeStackParams } from "@/lib/stack-url-state";
import { StackDisplay } from "./_components/stack-display";

interface StackPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
	searchParams,
}: StackPageProps): Promise<Metadata> {
	const params = await loadStackParams(searchParams);
	const projectName = params.projectName || "my-better-t-app";
	const title = `${projectName} – Better-T-Stack`;
	return {
		title,
		description: "View and share your custom tech stack configuration",
		alternates: {
			canonical: serializeStackParams("/stack", params),
		},
		openGraph: {
			title,
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
			title,
			description: "View and share your custom tech stack configuration",
			images: ["https://r2.better-t-stack.dev/og.png"],
		},
	};
}

export default async function StackPage({ searchParams }: StackPageProps) {
	const stackState = await loadStackParams(searchParams);

	return (
		<Suspense>
			<StackDisplay stackState={stackState} />
		</Suspense>
	);
}
