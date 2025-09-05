import {
	FRONTEND_FRAMEWORKS_MAP,
	NATIVE_FRAMEWORKS_LIST,
	REACT_FRAMEWORKS_LIST,
	SOLID_FRAMEWORKS_LIST,
	SVELTE_FRAMEWORKS_LIST,
	VUE_FRAMEWORKS_LIST,
} from "@/constants/frontend-frameworks";
import type { Frontend } from "@/types";

export type FrontendFrameworks = {
	hasNext: boolean;
	hasNuxt: boolean;
	hasSolid: boolean;
	hasSvelte: boolean;
	hasTanstackRouter: boolean;
	hasReactRouter: boolean;
	hasTanstackStart: boolean;
	hasNativeWind: boolean;
	hasUnistyles: boolean;
};

export type FrontendFrameworksGroups = {
	hasReactFramework: boolean;
	hasVueFramework: boolean;
	hasSvelteFramework: boolean;
	hasSolidFramework: boolean;
	hasNativeFramework: boolean;
};

export function getEnabledFrontendFramework(
	frontend: Frontend[],
): FrontendFrameworks {
	return {
		hasNext: frontend.includes(FRONTEND_FRAMEWORKS_MAP.NEXT),
		hasNuxt: frontend.includes(FRONTEND_FRAMEWORKS_MAP.NUXT),
		hasSolid: frontend.includes(FRONTEND_FRAMEWORKS_MAP.SOLID),
		hasSvelte: frontend.includes(FRONTEND_FRAMEWORKS_MAP.SVELTE),
		hasTanstackRouter: frontend.includes(
			FRONTEND_FRAMEWORKS_MAP.TANSTACK_ROUTER,
		),
		hasReactRouter: frontend.includes(FRONTEND_FRAMEWORKS_MAP.REACT_ROUTER),
		hasTanstackStart: frontend.includes(FRONTEND_FRAMEWORKS_MAP.TANSTACK_START),
		hasNativeWind: frontend.includes(FRONTEND_FRAMEWORKS_MAP.NATIVE_NATIVEWIND),
		hasUnistyles: frontend.includes(FRONTEND_FRAMEWORKS_MAP.NATIVE_UNISTYLES),
	};
}

export function getEnabledFrontendFrameworksGroups(
	frontend: Frontend[],
): FrontendFrameworksGroups {
	return {
		// calling frontend.some(f => REACT_FRAMEWORKS_LIST.includes(f)) will cause typescript error
		hasReactFramework: REACT_FRAMEWORKS_LIST.some((f) => frontend.includes(f)),
		hasVueFramework: VUE_FRAMEWORKS_LIST.some((f) => frontend.includes(f)),
		hasSvelteFramework: SVELTE_FRAMEWORKS_LIST.some((f) =>
			frontend.includes(f),
		),
		hasSolidFramework: SOLID_FRAMEWORKS_LIST.some((f) => frontend.includes(f)),
		hasNativeFramework: NATIVE_FRAMEWORKS_LIST.some((f) =>
			frontend.includes(f),
		),
	};
}

export function checkFrontendSelected(frontend: Frontend[]): boolean {
	const FrontendFrameworksGroups = getEnabledFrontendFrameworksGroups(frontend);
	return Object.values(FrontendFrameworksGroups).some((value) => value);
}
