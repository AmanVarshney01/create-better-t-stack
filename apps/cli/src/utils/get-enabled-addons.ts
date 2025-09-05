import { ADDONS_MAP } from "@/constants/addons";
import type { Addons } from "@/types";

export function getEnabledAddons(addons: Addons[]) {
	return {
		hasBiome: addons.includes(ADDONS_MAP.BIOME),
		hasHusky: addons.includes(ADDONS_MAP.HUSKY),
		hasOxlint: addons.includes(ADDONS_MAP.OXLINT),
		hasUltracite: addons.includes(ADDONS_MAP.ULTRACITY),
		hasRuler: addons.includes(ADDONS_MAP.RULER),
		hasTurborepo: addons.includes(ADDONS_MAP.TURBOREPO),
		hasPwa: addons.includes(ADDONS_MAP.PWA),
		hasTauri: addons.includes(ADDONS_MAP.TAURI),
		hasStarlight: addons.includes(ADDONS_MAP.STARLIGHT),
		hasFumadocs: addons.includes(ADDONS_MAP.FUMADOCS),
	};
}
