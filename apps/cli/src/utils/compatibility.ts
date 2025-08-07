import type { Frontend } from "../types";

// Central list of web frontends used across the CLI
export const WEB_FRAMEWORKS: readonly Frontend[] = [
	"tanstack-router",
	"react-router",
	"tanstack-start",
	"next",
	"nuxt",
	"svelte",
	"solid",
] as const;
