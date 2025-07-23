import { cancel, confirm, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

export async function getGitChoice(git?: boolean) {
	if (git !== undefined) return git;

	const response = await confirm({
		message: "Initialize git repository?",
		initialValue: DEFAULT_CONFIG.git,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
