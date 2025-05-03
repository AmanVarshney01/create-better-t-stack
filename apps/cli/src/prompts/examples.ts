import { cancel, isCancel, log, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type {
	ProjectBackend,
	ProjectDatabase,
	ProjectExamples,
	ProjectFrontend,
} from "../types";

export async function getExamplesChoice(
	examples?: ProjectExamples[],
	database?: ProjectDatabase,
	frontends?: ProjectFrontend[],
	backend?: ProjectBackend,
): Promise<ProjectExamples[]> {
	if (examples !== undefined) return examples;

	if (backend === "convex") {
		return ["todo"];
	}

	if (database === "none") return [];

	const onlyNative =
		frontends && frontends.length === 1 && frontends[0] === "native";
	if (onlyNative) {
		return [];
	}

	const hasWebFrontend =
		frontends?.some((f) =>
			[
				"react-router",
				"tanstack-router",
				"tanstack-start",
				"next",
				"nuxt",
				"svelte",
			].includes(f),
		) ?? false;
	const noFrontendSelected = !frontends || frontends.length === 0;

	if (!hasWebFrontend && !noFrontendSelected) return [];

	let response: ProjectExamples[] | symbol = [];
	const options: { value: ProjectExamples; label: string; hint: string }[] = [
		{
			value: "todo" as const,
			label: "Todo App",
			hint: "A simple CRUD example app",
		},
	];

	if (backend !== "elysia") {
		options.push({
			value: "ai" as const,
			label: "AI Chat",
			hint: "A simple AI chat interface using AI SDK",
		});
	}

	response = await multiselect<ProjectExamples>({
		message: "Include examples",
		options: options,
		required: false,
		initialValues: DEFAULT_CONFIG.examples,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
