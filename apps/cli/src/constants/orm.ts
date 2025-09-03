const ORM_WITHOUT_NONE = {
	drizzle: "drizzle",
	prisma: "prisma",
	mongoose: "mongoose",
} as const;

const ORM = {
	...ORM_WITHOUT_NONE,
	none: "none",
} as const;

export const ORMS_WITHOUT_NONE = Object.values(ORM_WITHOUT_NONE);
export const ORMS = Object.values(ORM);
