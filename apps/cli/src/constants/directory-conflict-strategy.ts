export const DIRECTORY_CONFLICT_STRATEGY = {
	merge: "merge",
	overwrite: "overwrite",
	increment: "increment",
	error: "error",
} as const;

export const DIRECTORY_CONFLICT_STRATEGIES = Object.values(
	DIRECTORY_CONFLICT_STRATEGY,
);
