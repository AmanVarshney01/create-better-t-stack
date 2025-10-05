import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend } from "../types";
import { exitCancelled } from "../utils/errors";

// Temporarily restrict to Next.js only for backend="self"
const FULLSTACK_FRONTENDS: readonly Frontend[] = [
	"next",
	// "nuxt",      // TODO: Add support in future update
	// "svelte",    // TODO: Add support in future update
	// "tanstack-start", // TODO: Add support in future update
] as const;

export async function getBackendFrameworkChoice(
	backendFramework?: Backend,
	frontends?: Frontend[],
) {
	if (backendFramework !== undefined) return backendFramework;

	const hasIncompatibleFrontend = frontends?.some((f) => f === "solid");
	const hasFullstackFrontend = frontends?.some((f) =>
		FULLSTACK_FRONTENDS.includes(f),
	);

	const backendOptions: Array<{
		value: Backend;
		label: string;
		hint: string;
	}> = [];

	if (hasFullstackFrontend) {
		backendOptions.push({
			value: "self" as const,
			label: "Self (Fullstack)",
			hint: "Use frontend's built-in api routes",
		});
	}

	backendOptions.push(
		{
			value: "hono" as const,
			label: "Hono",
			hint: "Lightweight, ultrafast web framework",
		},
		{
			value: "express" as const,
			label: "Express",
			hint: "Fast, unopinionated, minimalist web framework for Node.js",
		},
		{
			value: "fastify" as const,
			label: "Fastify",
			hint: "Fast, low-overhead web framework for Node.js",
		},
		{
			value: "elysia" as const,
			label: "Elysia",
			hint: "Ergonomic web framework for building backend servers",
		},
	);

	if (!hasIncompatibleFrontend) {
		backendOptions.push({
			value: "convex" as const,
			label: "Convex",
			hint: "Reactive backend-as-a-service platform",
		});
	}

	backendOptions.push({
		value: "none" as const,
		label: "None",
		hint: "No backend server",
	});

	const response = await select<Backend>({
		message: "Select backend",
		options: backendOptions,
		initialValue: hasFullstackFrontend ? "self" : DEFAULT_CONFIG.backend,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
