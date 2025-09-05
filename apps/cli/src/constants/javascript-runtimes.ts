import { withNone } from "@/utils/common";

export const JAVASCRIPT_RUNTIMES_WITHOUT_NONE_MAP = {
	BUN: "bun",
	NODE: "node",
	WORKER: "workers",
} as const;

export const JAVASCRIPT_RUNTIMES_MAP = withNone(
	JAVASCRIPT_RUNTIMES_WITHOUT_NONE_MAP,
);

export const JAVASCRIPT_RUNTIMES_WITHOUT_NONE = Object.values(
	JAVASCRIPT_RUNTIMES_WITHOUT_NONE_MAP,
);
export const JAVASCRIPT_RUNTIMES = Object.values(JAVASCRIPT_RUNTIMES_MAP);
