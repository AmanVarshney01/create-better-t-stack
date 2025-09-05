import { withNone } from "@/utils/common";

export const DATABASE_PROVIDERS_WITHOUT_NONE_MAP = {
	TURSO: "turso",
	NEON: "neon",
	PRISMA_POSTGRES: "prisma-postgres",
	MONGO_DB_ATLAS: "mongodb-atlas",
	SUPABASE: "supabase",
	CLOUDFLARE_D1: "d1",
	DOCKER: "docker",
} as const;

export const DATABASE_PROVIDERS_MAP = withNone(
	DATABASE_PROVIDERS_WITHOUT_NONE_MAP,
);

export const DATABASES_PROVIDERS_WITHOUT_NONE = Object.values(
	DATABASE_PROVIDERS_WITHOUT_NONE_MAP,
);
export const DATABASES_PROVIDERS = Object.values(DATABASE_PROVIDERS_MAP);
