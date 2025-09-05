import { withNone } from "@/utils/common";

export const ADDONS_WITHOUT_NONE_MAP = {
	PWA: "pwa",
	TAURI: "tauri",
	STARLIGHT: "starlight",
	BIOME: "biome",
	HUSKY: "husky",
	ULTRACITY: "ultracite",
	FUMADOCS: "fumadocs",
	RULER: "ruler",
	TURBOREPO: "turborepo",
	OXLINT: "oxlint",
} as const;

export const ADDONS_MAP = withNone(ADDONS_WITHOUT_NONE_MAP);

export const ADDONS_WITHOUT_NONE = Object.values(ADDONS_WITHOUT_NONE_MAP);
export const ADDONS = Object.values(ADDONS_MAP);
