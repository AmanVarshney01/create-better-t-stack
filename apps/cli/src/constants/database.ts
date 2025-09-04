export const DATABASE_WITHOUT_NONE = {
	sqlite: "sqlite",
	postgres: "postgres",
	mysql: "mysql",
	mongodb: "mongodb",
} as const;

export const DATABASE = {
	...DATABASE_WITHOUT_NONE,
	none: "none",
} as const;

export const DATABASES_WITHOUT_NONE = Object.values(DATABASE_WITHOUT_NONE);
export const DATABASES = Object.values(DATABASE);
