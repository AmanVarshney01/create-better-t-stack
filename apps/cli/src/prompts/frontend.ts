import { isCancel, multiselect, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend } from "../types";
import { isFrontendAllowedWithBackend } from "../utils/compatibility-rules";
import { exitCancelled } from "../utils/errors";

export async function getFrontendChoice(
	frontendOptions?: Frontend[],
	backend?: Backend,
	auth?: string,
) {
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

	if (isCancel(frontendTypes)) return exitCancelled("Operation cancelled");

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
				label: "TanStack Start",
				hint: "SSR, Server Functions, API Routes and more with TanStack Router",
			},
		];

		const webOptions = allWebOptions.filter((option) =>
			isFrontendAllowedWithBackend(option.value, backend, auth),
		);

		const webFramework = await select<Frontend>({
			message: "Choose web",
			options: webOptions,
			initialValue: DEFAULT_CONFIG.frontend[0],
		});

		if (isCancel(webFramework)) return exitCancelled("Operation cancelled");

		result.push(webFramework);
	}

	if (frontendTypes.includes("native")) {
		const nativeFramework = await select<Frontend>({
			message: "Choose native",
			options: [
				{
					value: "native-bare" as const,
					label: "Bare",
					hint: "Bare Expo without styling library",
				},
				{
					value: "native-uniwind" as const,
					label: "UniWind",
					hint: "Use Tailwind CSS for React Native",
				},
				{
					value: "native-unistyles" as const,
					label: "Unistyles",
					hint: "Consistent styling for React Native",
				},
			],
			initialValue: "native-bare",
		});

		if (isCancel(nativeFramework)) return exitCancelled("Operation cancelled");
		result.push(nativeFramework);
	}

	return result;
}
