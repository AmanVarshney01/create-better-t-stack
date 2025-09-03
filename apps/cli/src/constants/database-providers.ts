export const DATABASE_PROVIDERS_WITHOUT_NONE = {
	drizzle: "turso",
	neon: "neon",
	prisma: "prisma-postgres",
	mongodb: "mongodb-atlas",
	supabase: "supabase",
	d1: "d1",
	docker: "docker",
} as const;

export const DATABASE_PROVIDERS = {
	...DATABASE_PROVIDERS_WITHOUT_NONE,
	none: "none",
};

export const DATABASES_PROVIDERS_WITHOUT_NONE = Object.values(
	DATABASE_PROVIDERS_WITHOUT_NONE,
);
export const DATABASES_PROVIDERS = Object.values(DATABASE_PROVIDERS);
