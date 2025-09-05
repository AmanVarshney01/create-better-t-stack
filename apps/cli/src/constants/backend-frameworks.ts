import { withNone } from "@/utils/common";

export const CORE_BACKEND_FRAMEWORKS_MAP = {
	HONO: "hono",
	EXPRESS: "express",
	FASTIFY: "fastify",
	NEXT: "next",
	ELYSIA: "elysia",
};

export const HOSTED_BACKEND_FRAMEWORKS_MAP = {
	CONVEX: "convex",
} as const;

export const BACKEND_FRAMEWORKS_WITHOUT_NONE_MAP = {
	...CORE_BACKEND_FRAMEWORKS_MAP,
	...HOSTED_BACKEND_FRAMEWORKS_MAP,
} as const;

export const BACKEND_FRAMEWORKS_MAPS = withNone(
	BACKEND_FRAMEWORKS_WITHOUT_NONE_MAP,
);

export const BACKENDS_FRAMEWORKS_WITHOUT_NONE = Object.values(
	BACKEND_FRAMEWORKS_WITHOUT_NONE_MAP,
);
export const BACKEND_FRAMEWORKS = Object.values(BACKEND_FRAMEWORKS_MAPS);
