import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import type { API, Backend, Frontend } from "../types";

export async function getApiChoice(
	Api?: API | undefined,
	frontend?: Frontend[],
	backend?: Backend,
): Promise<API> {
	if (backend === "convex" || backend === "none") {
		return "none";
	}

	if (Api) return Api;

	const includesNuxt = frontend?.includes("nuxt");
	const includesSvelte = frontend?.includes("svelte");
	const includesSolid = frontend?.includes("solid");
	const includesAngular = frontend?.includes("angular");

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

	if (includesNuxt || includesSvelte || includesSolid || includesAngular) {
		apiOptions = [
			{
				value: "orpc" as const,
				label: "oRPC",
				hint: `End-to-end type-safe APIs (Recommended for ${
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

	const apiType = await select<API>({
		message: "Select API type",
		options: apiOptions,
		initialValue: apiOptions[0].value,
	});

	if (isCancel(apiType)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return apiType;
}
