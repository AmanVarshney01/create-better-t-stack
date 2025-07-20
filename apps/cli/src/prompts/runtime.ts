import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Runtime } from "../types";

const runtimeLabelsAndHints: {
	value: Runtime;
	label: string;
	hint: string;
	backends: Backend[];
}[] = [
	{
		value: "none",
		label: "None",
		hint: "No runtime setup",
		backends: ["convex", "none"],
	},
	{
		value: "bun",
		label: "Bun",
		hint: "Fast all-in-one JavaScript runtime",
		backends: ["hono", "express", "fastify", "elysia", "bknd"],
	},
	{
		value: "node",
		label: "Node.js",
		hint: "Traditional Node.js runtime",
		backends: ["hono", "express", "fastify", "next", "elysia", "bknd"],
	},
	{
		value: "workers",
		label: "Cloudflare Workers",
		hint: "Edge runtime on Cloudflare's global network",
		backends: ["hono", "bknd"],
	},
];

export async function getRuntimeChoice(
	runtime?: Runtime,
	backend?: Backend,
): Promise<Runtime> {
	if (runtime !== undefined) return runtime;

	const runtimeOptions = getAvailableRuntimes(backend);

	if (!runtimeOptions.length) {
		return "none";
	}

	if (runtimeOptions.length === 1) {
		return runtimeOptions[0].value;
	}

	const response = await select<Runtime>({
		message: "Select runtime",
		options: runtimeOptions,
		initialValue: DEFAULT_CONFIG.runtime,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}

function getAvailableRuntimes(
	backend?: Backend,
): Array<{ value: Runtime; label: string; hint: string }> {
	// Filter runtimes based on backend
	const supportedRuntimes = runtimeLabelsAndHints
		.filter((runtime) => {
			if (backend && !runtime.backends.includes(backend)) {
				return false;
			}
			return true;
		})
		.map((runtime) => {
			return {
				value: runtime.value,
				label: runtime.label,
				hint: runtime.hint,
			};
		});

	return supportedRuntimes;
}
