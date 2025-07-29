import { cancel, groupMultiselect, isCancel } from "@clack/prompts";
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

function getAddonDisplay(addon: Addons): { label: string; hint: string } {
	let label: string;
	let hint: string;

	switch (addon) {
		case "turborepo":
			label = "Turborepo";
			hint = "High-performance build system";
			break;
		case "pwa":
			label = "PWA";
			hint = "Make your app installable and work offline";
			break;
		case "tauri":
			label = "Tauri";
			hint = "Build native desktop apps from your web frontend";
			break;
		case "biome":
			label = "Biome";
			hint = "Format, lint, and more";
			break;
		case "oxlint":
			label = "Oxlint";
			hint = "Rust-powered linter";
			break;
		case "ultracite":
			label = "Ultracite";
			hint = "Zero-config Biome preset with AI integration";
			break;
		case "husky":
			label = "Husky";
			hint = "Modern native Git hooks made easy";
			break;
		case "starlight":
			label = "Starlight";
			hint = "Build stellar docs with astro";
			break;
		case "fumadocs":
			label = "Fumadocs";
			hint = "Build excellent documentation site";
			break;
		default:
			label = addon;
			hint = `Add ${addon}`;
	}

	return { label, hint };
}

const ADDON_GROUPS = {
	Documentation: ["starlight", "fumadocs"],
	Linting: ["biome", "oxlint", "ultracite"],
	Other: ["turborepo", "pwa", "tauri", "husky"],
};

export async function getAddonsChoice(
	addons?: Addons[],
	frontends?: Frontend[],
): Promise<Addons[]> {
	if (addons !== undefined) return addons;

	const allAddons = AddonsSchema.options.filter((addon) => addon !== "none");
	const groupedOptions: Record<string, AddonOption[]> = {
		Documentation: [],
		Linting: [],
		Other: [],
	};

	const frontendsArray = frontends || [];

	for (const addon of allAddons) {
		const { isCompatible } = validateAddonCompatibility(addon, frontendsArray);
		if (!isCompatible) continue;

		const { label, hint } = getAddonDisplay(addon);
		const option = { value: addon, label, hint };

		if (ADDON_GROUPS.Documentation.includes(addon)) {
			groupedOptions.Documentation.push(option);
		} else if (ADDON_GROUPS.Linting.includes(addon)) {
			groupedOptions.Linting.push(option);
		} else if (ADDON_GROUPS.Other.includes(addon)) {
			groupedOptions.Other.push(option);
		}
	}

	Object.keys(groupedOptions).forEach((group) => {
		if (groupedOptions[group].length === 0) {
			delete groupedOptions[group];
		}
	});

	const initialValues = DEFAULT_CONFIG.addons.filter((addonValue) =>
		Object.values(groupedOptions).some((options) =>
			options.some((opt) => opt.value === addonValue),
		),
	);

	const response = await groupMultiselect<Addons>({
		message: "Select addons",
		options: groupedOptions,
		initialValues: initialValues,
		required: false,
		selectableGroups: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}

export async function getAddonsToAdd(
	frontend: Frontend[],
	existingAddons: Addons[] = [],
): Promise<Addons[]> {
	const groupedOptions: Record<string, AddonOption[]> = {
		Documentation: [],
		Linting: [],
		Other: [],
	};

	const frontendArray = frontend || [];

	const compatibleAddons = getCompatibleAddons(
		AddonsSchema.options.filter((addon) => addon !== "none"),
		frontendArray,
		existingAddons,
	);

	for (const addon of compatibleAddons) {
		const { label, hint } = getAddonDisplay(addon);
		const option = { value: addon, label, hint };

		if (ADDON_GROUPS.Documentation.includes(addon)) {
			groupedOptions.Documentation.push(option);
		} else if (ADDON_GROUPS.Linting.includes(addon)) {
			groupedOptions.Linting.push(option);
		} else if (ADDON_GROUPS.Other.includes(addon)) {
			groupedOptions.Other.push(option);
		}
	}

	Object.keys(groupedOptions).forEach((group) => {
		if (groupedOptions[group].length === 0) {
			delete groupedOptions[group];
		}
	});

	if (Object.keys(groupedOptions).length === 0) {
		return [];
	}

	const response = await groupMultiselect<Addons>({
		message: "Select addons to add",
		options: groupedOptions,
		required: false,
		selectableGroups: false,
	});

	if (isCancel(response)) {
		cancel(pc.red("Operation cancelled"));
		process.exit(0);
	}

	return response;
}
