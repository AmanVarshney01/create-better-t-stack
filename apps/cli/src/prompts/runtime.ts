import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Runtime } from "../types";

export async function getRuntimeChoice(
	runtime?: Runtime,
	backend?: Backend,
): Promise<Runtime> {
	if (backend === "convex" || backend === "none") {
		return "none";
	}

	if (runtime !== undefined) return runtime;

	if (backend === "next") {
		return "node";
	}

	const runtimeOptions: Array<{
		value: Runtime;
		label: string;
		hint: string;
	}> = [
		{
			value: "bun",
			label: "Bun",
			hint: "Fast all-in-one JavaScript runtime",
		},
		{
			value: "node",
			label: "Node.js",
			hint: "Traditional Node.js runtime",
		},
	];

	if (backend === "hono") {
		runtimeOptions.push({
			value: "workers",
			label: "Cloudflare Workers",
			hint: "Edge runtime on Cloudflare's global network",
		});
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
