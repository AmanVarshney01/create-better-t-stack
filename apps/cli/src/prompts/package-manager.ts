import { cancel, isCancel, select } from "@clack/prompts";
import pc from "picocolors";
import type { PackageManager } from "../types";
import { getUserPkgManager } from "../utils/get-package-manager";

export async function getPackageManagerChoice(
	packageManager?: PackageManager,
): Promise<PackageManager> {
	if (packageManager !== undefined) return packageManager;

	const detectedPackageManager = getUserPkgManager();

	const response = await select<PackageManager>({
		message: "Choose package manager",
		options: [
			{ value: "npm", label: "npm", hint: "Node Package Manager" },
			{
				value: "yarn",
				label: "yarn",
				hint: "Fast, reliable, and secure dependency management",
			},
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

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
