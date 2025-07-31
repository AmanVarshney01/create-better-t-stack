import { Banner } from "fumadocs-ui/components/banner";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { SpecialSponsorBanner } from "@/components/special-sponsor-banner";
import { source } from "@/lib/source";

const docsOptions: DocsLayoutProps = {
	...baseOptions,
	tree: source.pageTree,
	links: [],
	sidebar: {
		banner: <SpecialSponsorBanner />,
	},
};

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<Banner variant="rainbow">
				⚠️ WORK IN PROGRESS DONT TAKE REFERENCE!!!
			</Banner>
			<DocsLayout {...docsOptions}>{children}</DocsLayout>
		</>
	);
}
