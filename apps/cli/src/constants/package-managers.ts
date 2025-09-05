import { withNone } from "@/utils/common";

export const PACKAGE_MANAGERS_WITHOUT_NONE_MAP = {
	NPM: "npm",
	PNPM: "pnpm",
	BUN: "bun",
} as const;

export const PACKAGE_MANAGERS_MAP = withNone(PACKAGE_MANAGERS_WITHOUT_NONE_MAP);

export const PACKAGE_MANAGERS_WITHOUT_NONE = Object.values(
	PACKAGE_MANAGERS_WITHOUT_NONE_MAP,
);
export const PACKAGE_MANAGERS = Object.values(PACKAGE_MANAGERS_MAP);
