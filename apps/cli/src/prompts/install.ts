import { confirm, isCancel } from "@clack/prompts";
import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";

export async function getinstallChoice(install?: boolean) {
	if (install !== undefined) return install;

	const response = await confirm({
		message: "Install dependencies?",
		initialValue: DEFAULT_CONFIG.install,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
