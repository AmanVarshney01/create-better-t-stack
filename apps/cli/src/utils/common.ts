export function withNone<T>(options: T) {
	return {
		...options,
		NONE: "none",
	} as const;
}
