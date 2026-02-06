import type { Backend, Database, ORM, Runtime } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

const ormOptions = {
  prisma: {
    value: "prisma" as const,
    label: "Prisma",
    hint: "Powerful, feature-rich ORM",
  },
  mongoose: {
    value: "mongoose" as const,
    label: "Mongoose",
    hint: "Elegant object modeling tool",
  },
  drizzle: {
    value: "drizzle" as const,
    label: "Drizzle",
    hint: "Lightweight and performant TypeScript ORM",
  },
};

export async function getORMChoice(
  orm: ORM | undefined,
  hasDatabase: boolean,
  database?: Database,
  backend?: Backend,
  runtime?: Runtime,
) {
  if (backend === "convex") {
    return "none";
  }

  if (!hasDatabase) return "none";
  if (orm !== undefined) return orm;

  const options =
    database === "mongodb"
      ? [ormOptions.prisma, ormOptions.mongoose]
      : [ormOptions.drizzle, ormOptions.prisma];

  const response = await navigableSelect<ORM>({
    message: "Select ORM",
    options,
    initialValue:
      database === "mongodb" ? "prisma" : runtime === "workers" ? "drizzle" : DEFAULT_CONFIG.orm,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
