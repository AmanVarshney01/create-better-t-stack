import { cancel, isCancel, multiselect } from "@clack/prompts";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../constants";
import { type Addons, AddonsSchema, type Frontend } from "../types";
import {
	getCompatibleAddons,
	validateAddonCompatibility,
} from "../utils/addon-compatibility";

type AddonOption = {
	value: Addons;
	label: string;
	hint: string;
};

function getAddonDisplay(
	addon: Addons,
	isRecommended = false,
): { label: string; hint: string } {
	let label: string;
	let hint: string;

	if (addon === "turborepo") {
		label = isRecommended ? "Turborepo (Recommended)" : "Turborepo";
		hint = "High-performance build system for JavaScript and TypeScript";
	} else if (addon === "pwa") {
		label = "PWA (Progressive Web App)";
		hint = "Make your app installable and work offline";
	} else if (addon === "tauri") {
		label = isRecommended ? "Tauri Desktop App" : "Tauri";
		hint = "Build native desktop apps from your web frontend";
	} else if (addon === "biome") {
		label = "Biome";
		hint = isRecommended
			? "Add Biome for linting and formatting"
			: "Fast formatter and linter for JavaScript, TypeScript, JSX";
	} else if (addon === "husky") {
		label = "Husky";
		hint = isRecommended
			? "Add Git hooks with Husky, lint-staged (requires Biome)"
			: "Git hooks made easy";
	} else if (addon === "starlight") {
		label = "Starlight";
		hint = isRecommended
			? "Add Astro Starlight documentation site"
			: "Documentation site with Astro";
	} else {
		label = addon;
		hint = `Add ${addon}`;
	}

	return { label, hint };
}

export async function getAddonsChoice(
	addons?: Addons[],
	frontends?: Frontend[],
): Promise<Addons[]> {
	if (addons !== undefined) return addons;

	const allAddons = AddonsSchema.options.filter((addon) => addon !== "none");

	const allPossibleOptions: AddonOption[] = [];

	for (const addon of allAddons) {
		const { isCompatible } = validateAddonCompatibility(addon, frontends || []);

		if (isCompatible) {
			const { label, hint } = getAddonDisplay(addon, true);

			allPossibleOptions.push({
				value: addon,
				label,
				hint,
			});
		}
	}

	const options = allPossibleOptions.sort((a, b) => {
		if (a.value === "turborepo") return -1;
		if (b.value === "turborepo") return 1;
		return 0;
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

export async function getAddonsToAdd(
	frontend: Frontend[],
	existingAddons: Addons[] = [],
): Promise<Addons[]> {
	const options: AddonOption[] = [];

	const allAddons = AddonsSchema.options.filter((addon) => addon !== "none");

	const compatibleAddons = getCompatibleAddons(
		allAddons,
		frontend,
		existingAddons,
	);

	for (const addon of compatibleAddons) {
		const { label, hint } = getAddonDisplay(addon, false);

		options.push({
			value: addon,
			label,
			hint,
		});
	}

	if (options.length === 0) {
		return [];
	}

	const response = await multiselect<Addons>({
		message: "Select addons",
		options: options,
		required: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
