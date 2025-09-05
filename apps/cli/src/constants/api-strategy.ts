import { withNone } from "@/utils/common";

export const API_STRATEGIES_WITHOUT_NONE_MAP = {
	TRPC: "trpc",
	ORPC: "orpc",
} as const;

export const API_STRATEGIES_MAP = withNone(API_STRATEGIES_WITHOUT_NONE_MAP);

export const API_STRATEGIES_WITHOUT_NONE = Object.values(
	API_STRATEGIES_WITHOUT_NONE_MAP,
);
export const API_STRATEGIES = Object.values(API_STRATEGIES_MAP);
