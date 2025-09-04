export const EXAMPLE_WITHOUT_NONE = {
	todo: "todo",
	ai: "ai",
} as const;

export const EXAMPLE = {
	...EXAMPLE_WITHOUT_NONE,
	none: "none",
} as const;

export const EXAMPLES_WITHOUT_NONE = Object.values(EXAMPLE_WITHOUT_NONE);
export const EXAMPLES = Object.values(EXAMPLE);
