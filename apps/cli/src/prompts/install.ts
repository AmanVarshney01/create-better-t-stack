import { cancel, confirm, isCancel } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";

export async function getinstallChoice(install?: boolean) {
	if (install !== undefined) return install;

	const response = await confirm({
		message: "Install dependencies?",
		initialValue: DEFAULT_CONFIG.install,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
