import { withNone } from "@/utils/common";

export const EXAMPLES_WITHOUT_NONE_MAP = {
	TODO: "todo",
	AI: "ai",
} as const;

export const EXAMPLES_MAP = withNone(EXAMPLES_WITHOUT_NONE_MAP);

export const EXAMPLES_WITHOUT_NONE = Object.values(EXAMPLES_WITHOUT_NONE_MAP);
export const EXAMPLES = Object.values(EXAMPLES_MAP);
