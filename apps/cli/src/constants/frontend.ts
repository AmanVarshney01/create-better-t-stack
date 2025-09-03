export const FRONTEND_WITHOUT_NONE = {
	tanstackRouter: "tanstack-router",
	reactRouter: "react-router",
	tanstackStart: "tanstack-start",
	next: "next",
	nuxt: "nuxt",
	solid: "solid",
	svelte: "svelte",
	nativeNativewind: "native-nativewind",
	nativeUnistyles: "native-unistyles",
} as const;

export const FRONTEND = {
	...FRONTEND_WITHOUT_NONE,
	none: "none",
} as const;

export const FRONTENDS_WITHOUT_NONE = Object.values(FRONTEND_WITHOUT_NONE);
export const FRONTENDS = Object.values(FRONTEND);
