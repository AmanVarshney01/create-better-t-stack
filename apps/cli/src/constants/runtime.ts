export const RUNTIME_WITHOUT_NONE = {
	bun: "bun",
	node: "node",
	workers: "workers",
} as const;

export const RUNTIME = {
	...RUNTIME_WITHOUT_NONE,
	none: "none",
} as const;

export const RUNTIMES_WITHOUT_NONE = Object.values(RUNTIME_WITHOUT_NONE);
export const RUNTIMES = Object.values(RUNTIME);
