export const DIRECTORY_CONFLICT_STRATEGIES_MAP = {
	MERGE: "merge",
	OVERWRITE: "overwrite",
	INCREMENT: "increment",
	ERROR: "error",
} as const;

export const DIRECTORY_CONFLICT_STRATEGIES = Object.values(
	DIRECTORY_CONFLICT_STRATEGIES_MAP,
);
