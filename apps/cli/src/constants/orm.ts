import { withNone } from "@/utils/common";

const ORM_WITHOUT_NONE_MAP = {
	DRIZZLE: "drizzle",
	PRISMA: "prisma",
	MONGO_DB: "mongoose",
} as const;

const ORM_MAP = withNone(ORM_WITHOUT_NONE_MAP);

export const ORM_WITHOUT_NONE = Object.values(ORM_WITHOUT_NONE_MAP);
export const ORM = Object.values(ORM_MAP);
