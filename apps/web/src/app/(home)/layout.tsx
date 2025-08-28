"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<HomeLayout
			{...baseOptions}
			style={
				{
					"--spacing-fd-container": "100%",
				} as object
			}
		>
			<main className="h-full w-full">{children}</main>
		</HomeLayout>
	);
}
