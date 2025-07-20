import { cancel, isCancel, multiselect, select } from "@clack/prompts";
import pc from "picocolors";
import {
	BACKEND_COMPATIBILITY,
	DEFAULT_CONFIG,
	type WebFrontend,
} from "../constants";
import type { Backend, Frontend } from "../types";

const WEB_FRAMEWORK_DETAILS: {
	value: WebFrontend;
	label: string;
	hint: string;
}[] = [
	{
		value: "tanstack-router",
		label: "TanStack Router",
		hint: "Modern and scalable routing for React Applications",
	},
	{
		value: "react-router",
		label: "React Router",
		hint: "A user-obsessed, standards-focused, multi-strategy router",
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
		value: "solid",
		label: "Solid",
		hint: "Simple and performant reactivity for building user interfaces",
	},
	{
		value: "tanstack-start",
		label: "TanStack Start (vite)",
		hint: "SSR, Server Functions, API Routes and more with TanStack Router",
	},
];

export async function getFrontendChoice(
	frontendOptions?: Frontend[],
	backend?: Backend,
): Promise<Frontend[]> {
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
		initialValues: ["web"],
	});

	if (isCancel(frontendTypes)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	const result: Frontend[] = [];

	if (frontendTypes.includes("web")) {
		const webOptions = WEB_FRAMEWORK_DETAILS.filter(({ value: framework }) => {
			return BACKEND_COMPATIBILITY[backend ?? "none"].frontends.includes(
				framework,
			);
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
