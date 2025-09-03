import type { Frontend } from "../types";

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
		hasNext: frontend.includes("next"),
		hasNuxt: frontend.includes("nuxt"),
		hasSolid: frontend.includes("solid"),
		hasSvelte: frontend.includes("svelte"),
		hasTanstackRouter: frontend.includes("tanstack-router"),
		hasReactRouter: frontend.includes("react-router"),
		hasTanstackStart: frontend.includes("tanstack-start"),
		hasNativeWind: frontend.includes("native-nativewind"),
		hasUnistyles: frontend.includes("native-unistyles"),
	};
}

export function getEnabledFrontendFrameworksGroups(
	frontend: Frontend[],
): FrontendFrameworksGroups {
	return {
		hasReactFramework: frontend.some((f) =>
			["tanstack-router", "react-router", "tanstack-start", "next"].includes(f),
		),
		hasVueFramework: frontend.some((f) => ["nuxt"].includes(f)),
		hasSvelteFramework: frontend.some((f) => ["svelte"].includes(f)),
		hasSolidFramework: frontend.some((f) => ["solid"].includes(f)),
		hasNativeFramework: frontend.some((f) =>
			["native-nativewind", "native-unistyles"].includes(f),
		),
	};
}

export function checkFrontendSelected(frontend: Frontend[]): boolean {
	const FrontendFrameworksGroups = getEnabledFrontendFrameworksGroups(frontend);
	return Object.values(FrontendFrameworksGroups).some((value) => value);
}
