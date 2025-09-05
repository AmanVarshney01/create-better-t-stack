import { withNone } from "@/utils/common";

export const DATABASES_WITHOUT_NONE_MAP = {
	SQLITE: "sqlite",
	POSTGRES: "postgres",
	MYSQL: "mysql",
	MONGODB: "mongodb",
} as const;

export const DATABASE_MAPS = withNone(DATABASES_WITHOUT_NONE_MAP);

export const DATABASES_WITHOUT_NONE = Object.values(DATABASES_WITHOUT_NONE_MAP);
export const DATABASES = Object.values(DATABASE_MAPS);
