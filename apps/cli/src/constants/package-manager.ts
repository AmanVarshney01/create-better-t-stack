export const PACKAGE_MANAGER_WITHOUT_NONE = {
	npm: "npm",
	pnpm: "pnpm",
	bun: "bun",
} as const;

export const PACKAGE_MANAGER = {
	...PACKAGE_MANAGER_WITHOUT_NONE,
	none: "none",
} as const;

export const PACKAGE_MANAGERS_WITHOUT_NONE = Object.values(
	PACKAGE_MANAGER_WITHOUT_NONE,
);
export const PACKAGE_MANAGERS = Object.values(PACKAGE_MANAGER);
