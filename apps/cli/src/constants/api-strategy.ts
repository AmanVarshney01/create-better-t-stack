export const API_WITHOUT_NONE = {
	trpc: "trpc",
	orpc: "orpc",
} as const;

export const API = {
	...API_WITHOUT_NONE,
	none: "none",
} as const;

export const APIS_WITHOUT_NONE = Object.values(API_WITHOUT_NONE);
export const APIS = Object.values(API);
