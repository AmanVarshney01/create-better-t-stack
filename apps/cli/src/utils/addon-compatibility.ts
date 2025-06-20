import { ADDON_COMPATIBILITY } from "../constants";
import type { Addons, Frontend } from "../types";

export function validateAddonCompatibility(
	addon: Addons,
	frontend: Frontend[],
): { isCompatible: boolean; reason?: string } {
	const compatibleFrontends = ADDON_COMPATIBILITY[addon];

	if (compatibleFrontends.length === 0) {
		return { isCompatible: true };
	}

	const hasCompatibleFrontend = frontend.some((f) =>
		(compatibleFrontends as readonly string[]).includes(f),
	);

	if (!hasCompatibleFrontend) {
		const frontendList = compatibleFrontends.join(", ");
		return {
			isCompatible: false,
			reason: `${addon} addon requires one of these frontends: ${frontendList}`,
		};
	}

	return { isCompatible: true };
}

export function getCompatibleAddons(
	allAddons: Addons[],
	frontend: Frontend[],
	existingAddons: Addons[] = [],
): Addons[] {
	return allAddons.filter((addon) => {
		if (existingAddons.includes(addon)) return false;

		if (addon === "none") return false;

		const { isCompatible } = validateAddonCompatibility(addon, frontend);
		return isCompatible;
	});
}
