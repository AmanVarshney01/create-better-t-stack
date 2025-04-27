import { cancel, isCancel, multiselect, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectFrontend } from "../types";

export async function getFrontendChoice(
	frontendOptions?: ProjectFrontend[],
): Promise<ProjectFrontend[]> {
	if (frontendOptions !== undefined) return frontendOptions;

	const frontendTypes = await multiselect({
		message: "Select platforms to develop for",
		options: [
			{
				value: "web",
				label: "Web",
				hint: "React, Vue or Svelte Web Application",
			},
			{
				value: "native",
				label: "Native",
				hint: "Create a React Native/Expo app",
			},
		],
		required: false,
		initialValues: DEFAULT_CONFIG.frontend.some(
			(f) =>
				f === "tanstack-router" ||
				f === "react-router" ||
				f === "tanstack-start" ||
				f === "next" ||
				f === "nuxt" ||
				f === "svelte",
		)
			? ["web"]
			: [],
	});

	if (isCancel(frontendTypes)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	const result: ProjectFrontend[] = [];

	if (frontendTypes.includes("web")) {
		const webFramework = await select<ProjectFrontend>({
			message: "Choose frontend framework",
			options: [
				{
					value: "tanstack-router",
					label: "TanStack Router",
					hint: "Modern and scalable routing for React Applications",
				},
				{
					value: "react-router",
					label: "React Router",
					hint: "A user‑obsessed, standards‑focused, multi‑strategy router",
				},
				{
					value: "next",
					label: "Next.js",
					hint: "The React Framework for the Web",
				},
				{
					value: "nuxt",
					label: "Nuxt",
					hint: "The Progressive Web Framework for Vue.js",
				},
				{
					value: "svelte",
					label: "Svelte",
					hint: "web development for the rest of us",
				},
				{
					value: "tanstack-start",
					label: "TanStack Start (beta)",
					hint: "SSR, Server Functions, API Routes and more with TanStack Router",
				},
			],
			initialValue:
				DEFAULT_CONFIG.frontend.find(
					(f) =>
						f === "tanstack-router" ||
						f === "react-router" ||
						f === "tanstack-start" ||
						f === "next" ||
						f === "nuxt" ||
						f === "svelte",
				) || "tanstack-router",
		});

		if (isCancel(webFramework)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		result.push(webFramework);
	}

	if (frontendTypes.includes("native")) {
		result.push("native");
	}

	return result;
}
