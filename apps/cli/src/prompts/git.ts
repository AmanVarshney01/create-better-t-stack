import { confirm, isCancel } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";

export async function getGitChoice(git?: boolean) {
	if (git !== undefined) return git;

	const response = await confirm({
		message: "Initialize git repository?",
		initialValue: DEFAULT_CONFIG.git,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
