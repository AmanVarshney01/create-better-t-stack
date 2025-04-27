import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import type { ProjectAddons, ProjectFrontend } from "../types";

type AddonOption = {
	value: ProjectAddons;
	label: string;
	hint: string;
};

export async function getAddonsChoice(
	addons?: ProjectAddons[],
	frontends?: ProjectFrontend[],
): Promise<ProjectAddons[]> {
	if (addons !== undefined) return addons;

	const hasCompatiblePwaFrontend =
		frontends?.includes("react-router") ||
		frontends?.includes("tanstack-router");

	const hasCompatibleTauriFrontend =
		frontends?.includes("react-router") ||
		frontends?.includes("tanstack-router") ||
		frontends?.includes("nuxt") ||
		frontends?.includes("svelte");

	const allPossibleOptions: AddonOption[] = [
		{
			value: "turborepo",
			label: "Turborepo (Recommended)",
			hint: "Optimize builds for monorepos",
		},
		{
			value: "starlight",
			label: "Starlight",
			hint: "Add Astro Starlight documentation site",
		},
		{
			value: "biome",
			label: "Biome",
			hint: "Add Biome for linting and formatting",
		},
		{
			value: "husky",
			label: "Husky",
			hint: "Add Git hooks with Husky, lint-staged (requires Biome)",
		},
		{
			value: "pwa",
			label: "PWA (Progressive Web App)",
			hint: "Make your app installable and work offline",
		},
		{
			value: "tauri",
			label: "Tauri Desktop App",
			hint: "Build native desktop apps from your web frontend",
		},
	];

	const options = allPossibleOptions.filter((option) => {
		if (option.value === "pwa") return hasCompatiblePwaFrontend;
		if (option.value === "tauri") return hasCompatibleTauriFrontend;
		return true;
	});

	const initialValues = DEFAULT_CONFIG.addons.filter((addonValue) =>
		options.some((opt) => opt.value === addonValue),
	);

	const response = await multiselect({
		message: "Select addons",
		options: options,
		initialValues: initialValues,
		required: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	if (response.includes("husky") && !response.includes("biome")) {
		response.push("biome");
	}

	return response;
}
