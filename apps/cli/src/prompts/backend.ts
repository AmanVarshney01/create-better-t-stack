import { isCancel, select } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Frontend } from "../types";
import { exitCancelled } from "../utils/errors";

export async function getBackendFrameworkChoice(
	backendFramework?: Backend,
	frontends?: Frontend[],
) {
	if (backendFramework !== undefined) return backendFramework;

	const hasIncompatibleFrontend = frontends?.some((f) => f === "solid");

	const backendOptions: Array<{
		value: Backend;
		label: string;
		hint: string;
	}> = [
		{
			value: "hono" as const,
			label: "Hono",
			hint: "Lightweight, ultrafast web framework",
		},
		{
			value: "next" as const,
			label: "Next.js",
			hint: "separate api routes only backend",
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
	];

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
		initialValue: DEFAULT_CONFIG.backend,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
