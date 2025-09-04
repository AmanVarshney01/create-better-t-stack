export const ADDON_WITHOUT_NONE = {
	pwa: "pwa",
	tauri: "tauri",
	starlight: "starlight",
	biome: "biome",
	husky: "husky",
	ruler: "ruler",
	turborepo: "turborepo",
	fumadocs: "fumadocs",
	ultracite: "ultracite",
	oxlint: "oxlint",
} as const;

export const ADDON = {
	...ADDON_WITHOUT_NONE,
	none: "none",
} as const;

export const ADDONS_WITHOUT_NONE = Object.values(ADDON_WITHOUT_NONE);
export const ADDONS = Object.values(ADDON);
