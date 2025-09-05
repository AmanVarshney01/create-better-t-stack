import { withNone } from "@/utils/common";

export const REACT_FRAMEWORKS_MAP = {
	NEXT: "next",
	REACT_ROUTER: "react-router",
	TANSTACK_ROUTER: "tanstack-router",
	TANSTACK_START: "tanstack-start",
} as const;

export const REACT_FRAMEWORKS_LIST = Object.values(REACT_FRAMEWORKS_MAP);

export const VUE_FRAMEWORKS_MAP = {
	NUXT: "nuxt",
} as const;

export const VUE_FRAMEWORKS_LIST = Object.values(VUE_FRAMEWORKS_MAP);

export const SOLID_FRAMEWORKS_MAP = {
	SOLID: "solid",
} as const;

export const SOLID_FRAMEWORKS_LIST = Object.values(SOLID_FRAMEWORKS_MAP);

export const SVELTE_FRAMEWORKS_MAP = {
	SVELTE: "svelte",
} as const;

export const SVELTE_FRAMEWORKS_LIST = Object.values(SVELTE_FRAMEWORKS_MAP);

export const WEB_FRONTEND_FRAMEWORKS_MAP = {
	...REACT_FRAMEWORKS_MAP,
	...VUE_FRAMEWORKS_MAP,
	...SOLID_FRAMEWORKS_MAP,
	...SVELTE_FRAMEWORKS_MAP,
} as const;

export const WEB_FRONTEND_FRAMEWORKS_LIST = Object.values(
	WEB_FRONTEND_FRAMEWORKS_MAP,
);

export const NATIVE_FRAMEWORKS_MAP = {
	NATIVE_NATIVEWIND: "native-nativewind",
	NATIVE_UNISTYLES: "native-unistyles",
} as const;

export const NATIVE_FRAMEWORKS_LIST = Object.values(NATIVE_FRAMEWORKS_MAP);

export const FRONTEND_FRAMEWORKS_WITHOUT_NONE_MAP = {
	...WEB_FRONTEND_FRAMEWORKS_MAP,
	...NATIVE_FRAMEWORKS_MAP,
} as const;

export const FRONTEND_FRAMEWORKS_MAP = withNone(
	FRONTEND_FRAMEWORKS_WITHOUT_NONE_MAP,
);

export const FRONTEND_FRAMEWORKS_WITHOUT_NONE = Object.values(
	FRONTEND_FRAMEWORKS_WITHOUT_NONE_MAP,
);
export const FRONTEND_FRAMEWORKS = Object.values(FRONTEND_FRAMEWORKS_MAP);
