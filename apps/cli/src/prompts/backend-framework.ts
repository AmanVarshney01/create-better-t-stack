import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectBackend, ProjectFrontend } from "../types";

export async function getBackendFrameworkChoice(
	backendFramework?: ProjectBackend,
	frontends?: ProjectFrontend[],
): Promise<ProjectBackend> {
	if (backendFramework !== undefined) return backendFramework;

	const hasIncompatibleFrontend = frontends?.some(
		(f) => f === "nuxt" || f === "solid",
	);

	const backendOptions: Array<{
		value: ProjectBackend;
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
			hint: "Full-stack framework with API routes",
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
		hint: "No backend server (e.g., for a static site or client-only app)",
	});

	let initialValue = DEFAULT_CONFIG.backend;
	if (hasIncompatibleFrontend && initialValue === "convex") {
		initialValue = "hono";
	}

	const response = await select<ProjectBackend>({
		message: "Select backend framework",
		options: backendOptions,
		initialValue,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
