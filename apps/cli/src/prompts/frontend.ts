import { cancel, isCancel, multiselect, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend } from "../types";

export async function getFrontendChoice(
	frontendOptions?: Frontend[],
	backend?: Backend,
): Promise<Frontend[]> {
	if (frontendOptions !== undefined) return frontendOptions;

	const frontendTypes = await multiselect({
		message: "Select project type",
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
		initialValues: ["web"],
	});

	if (isCancel(frontendTypes)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	const result: Frontend[] = [];

	if (frontendTypes.includes("web")) {
		const allWebOptions = [
			{
				value: "tanstack-router" as const,
				label: "TanStack Router",
				hint: "Modern and scalable routing for React Applications",
			},
			{
				value: "react-router" as const,
				label: "React Router",
				hint: "A user‑obsessed, standards‑focused, multi‑strategy router",
			},
			{
				value: "next" as const,
				label: "Next.js",
				hint: "The React Framework for the Web",
			},
			{
				value: "nuxt" as const,
				label: "Nuxt",
				hint: "The Progressive Web Framework for Vue.js",
			},
			{
				value: "svelte" as const,
				label: "Svelte",
				hint: "web development for the rest of us",
			},
			{
				value: "solid" as const,
				label: "Solid",
				hint: "Simple and performant reactivity for building user interfaces",
			},
			{
				value: "tanstack-start" as const,
				label: "TanStack Start (vite)",
				hint: "SSR, Server Functions, API Routes and more with TanStack Router",
			},
		];

		const webOptions = allWebOptions.filter((option) => {
			if (backend === "convex") {
				return option.value !== "nuxt" && option.value !== "solid";
			}
			return true;
		});

		const webFramework = await select<Frontend>({
			message: "Choose web",
			options: webOptions,
			initialValue: DEFAULT_CONFIG.frontend[0],
		});

		if (isCancel(webFramework)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		result.push(webFramework);
	}

	if (frontendTypes.includes("native")) {
		const nativeFramework = await select<Frontend>({
			message: "Choose native",
			options: [
				{
					value: "native-nativewind" as const,
					label: "NativeWind",
					hint: "Use Tailwind CSS for React Native",
				},
				{
					value: "native-unistyles" as const,
					label: "Unistyles",
					hint: "Consistent styling for React Native",
				},
			],
			initialValue: "native-nativewind",
		});

		if (isCancel(nativeFramework)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}
		result.push(nativeFramework);
	}

	return result;
}
