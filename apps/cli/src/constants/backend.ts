export const BACKEND_WITHOUT_NONE = {
	hono: "hono",
	express: "express",
	fastify: "fastify",
	next: "next",
	elysia: "elysia",
	convex: "convex",
} as const;

export const BACKEND = {
	...BACKEND_WITHOUT_NONE,
	none: "none",
} as const;

export const BACKENDS_WITHOUT_NONE = Object.values(BACKEND_WITHOUT_NONE);
export const BACKENDS = Object.values(BACKEND);
