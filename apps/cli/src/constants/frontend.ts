export const REACT_FRAMEWORK_MAP = {
	next: "next",
	reactRouter: "react-router",
	tanstackRouter: "tanstack-router",
	tanstackStart: "tanstack-start",
} as const;

export const REACT_FRAMEWORK_LIST = Object.values(REACT_FRAMEWORK_MAP);

export const VUE_FRAMEWORK_MAP = {
	nuxt: "nuxt",
} as const;

export const VUE_FRAMEWORK_LIST = Object.values(VUE_FRAMEWORK_MAP);

export const SOLID_FRAMEWORK_MAP = {
	solid: "solid",
} as const;

export const SOLID_FRAMEWORK_LIST = Object.values(SOLID_FRAMEWORK_MAP);

export const SVELTE_FRAMEWORK_MAP = {
	svelte: "svelte",
} as const;

export const SVELTE_FRAMEWORK_LIST = Object.values(SVELTE_FRAMEWORK_MAP);

export const NATIVE_FRAMEWORK_MAP = {
	nativeNativewind: "native-nativewind",
	nativeUnistyles: "native-unistyles",
} as const;

export const NATIVE_FRAMEWORK_LIST = Object.values(NATIVE_FRAMEWORK_MAP);

export const FRONTEND_FRAMEWORK_WITHOUT_NONE_MAP = {
	...REACT_FRAMEWORK_MAP,
	...VUE_FRAMEWORK_MAP,
	...SOLID_FRAMEWORK_MAP,
	...SVELTE_FRAMEWORK_MAP,
	...NATIVE_FRAMEWORK_MAP,
} as const;

export const FRONTEND_FRAMEWORK_MAP = {
	...FRONTEND_FRAMEWORK_WITHOUT_NONE_MAP,
	none: "none",
} as const;

export const FRONTEND_WITHOUT_NONE = Object.values(
	FRONTEND_FRAMEWORK_WITHOUT_NONE_MAP,
);
export const FRONTEND = Object.values(FRONTEND_FRAMEWORK_MAP);
