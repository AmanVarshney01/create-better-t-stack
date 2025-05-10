import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectApi, ProjectBackend, ProjectFrontend } from "../types";

export async function getApiChoice(
	Api?: ProjectApi | undefined,
	frontend?: ProjectFrontend[],
	backend?: ProjectBackend,
): Promise<ProjectApi> {
	if (backend === "convex" || backend === "none") {
		return "none";
	}

	if (Api) return Api;

	const includesNuxt = frontend?.includes("nuxt");
	const includesSvelte = frontend?.includes("svelte");
	const includesSolid = frontend?.includes("solid");

	let apiOptions = [
		{
			value: "trpc" as const,
			label: "tRPC",
			hint: "End-to-end typesafe APIs made easy",
		},
		{
			value: "orpc" as const,
			label: "oRPC",
			hint: "End-to-end type-safe APIs that adhere to OpenAPI standards",
		},
		{
			value: "none" as const,
			label: "None",
			hint: "No API layer (e.g. for full-stack frameworks like Next.js with Route Handlers)",
		},
	];

	if (includesNuxt || includesSvelte || includesSolid) {
		apiOptions = [
			{
				value: "orpc" as const,
				label: "oRPC",
				hint: `End-to-end type-safe APIs (Required for ${
					includesNuxt ? "Nuxt" : includesSvelte ? "Svelte" : "Solid"
				} frontend)`,
			},
			{
				value: "none" as const,
				label: "None",
				hint: "No API layer",
			},
		];
	}

	const apiType = await select<ProjectApi>({
		message: "Select API type",
		options: apiOptions,
		initialValue:
			includesNuxt || includesSvelte || includesSolid
				? "orpc"
				: DEFAULT_CONFIG.api,
	});

	if (isCancel(apiType)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return apiType;
}
