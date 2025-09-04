import {
	FRONTEND_FRAMEWORK_MAP,
	NATIVE_FRAMEWORK_LIST,
	REACT_FRAMEWORK_LIST,
	SOLID_FRAMEWORK_LIST,
	SVELTE_FRAMEWORK_LIST,
	VUE_FRAMEWORK_LIST,
} from "@/constants/frontend";
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
		hasNext: frontend.includes(FRONTEND_FRAMEWORK_MAP.next),
		hasNuxt: frontend.includes(FRONTEND_FRAMEWORK_MAP.nuxt),
		hasSolid: frontend.includes(FRONTEND_FRAMEWORK_MAP.solid),
		hasSvelte: frontend.includes(FRONTEND_FRAMEWORK_MAP.svelte),
		hasTanstackRouter: frontend.includes(FRONTEND_FRAMEWORK_MAP.tanstackRouter),
		hasReactRouter: frontend.includes(FRONTEND_FRAMEWORK_MAP.reactRouter),
		hasTanstackStart: frontend.includes(FRONTEND_FRAMEWORK_MAP.tanstackStart),
		hasNativeWind: frontend.includes(FRONTEND_FRAMEWORK_MAP.nativeNativewind),
		hasUnistyles: frontend.includes(FRONTEND_FRAMEWORK_MAP.nativeUnistyles),
	};
}

export function getEnabledFrontendFrameworksGroups(
	frontend: Frontend[],
): FrontendFrameworksGroups {
	return {
		hasReactFramework: frontend.some((f) => REACT_FRAMEWORK_LIST.includes(f)),
		hasVueFramework: frontend.some((f) => VUE_FRAMEWORK_LIST.includes(f)),
		hasSvelteFramework: frontend.some((f) => SVELTE_FRAMEWORK_LIST.includes(f)),
		hasSolidFramework: frontend.some((f) => SOLID_FRAMEWORK_LIST.includes(f)),
		hasNativeFramework: frontend.some((f) => NATIVE_FRAMEWORK_LIST.includes(f)),
	};
}

export function checkFrontendSelected(frontend: Frontend[]): boolean {
	const FrontendFrameworksGroups = getEnabledFrontendFrameworksGroups(frontend);
	return Object.values(FrontendFrameworksGroups).some((value) => value);
}
