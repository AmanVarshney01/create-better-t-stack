import { isCancel, select } from "@clack/prompts";
import type { PackageManager } from "../types";
import { exitCancelled } from "../utils/errors";
import { getUserPkgManager } from "../utils/get-package-manager";

export async function getPackageManagerChoice(packageManager?: PackageManager) {
	if (packageManager !== undefined) return packageManager;

	const detectedPackageManager = getUserPkgManager();

	const response = await select<PackageManager>({
		message: "Choose package manager",
		options: [
			{ value: "npm", label: "npm", hint: "Node Package Manager" },
			{
				value: "pnpm",
				label: "pnpm",
				hint: "Fast, disk space efficient package manager",
			},
			{
				value: "bun",
				label: "bun",
				hint: "All-in-one JavaScript runtime & toolkit",
			},
		],
		initialValue: detectedPackageManager,
	});

	if (isCancel(response)) return exitCancelled("Operation cancelled");

	return response;
}
