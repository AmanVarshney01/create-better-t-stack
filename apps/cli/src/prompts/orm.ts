import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Database, ORM, Runtime } from "../types";
import { UserCancelledError, ValidationError } from "../utils/errors";
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
  if (orm !== undefined) {
    if (orm === "drizzle" && database === "mongodb") {
      throw new ValidationError({
        message:
          "Drizzle ORM does not support MongoDB. Please use '--orm mongoose' or '--orm prisma' or choose a different database.",
      });
    }
    if (orm === "mongoose" && database && database !== "mongodb") {
      throw new ValidationError({
        message:
          "Mongoose ORM requires MongoDB database. Please use '--database mongodb' or choose a different ORM.",
      });
    }
    return orm;
  }

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
