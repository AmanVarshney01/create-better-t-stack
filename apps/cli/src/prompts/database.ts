import type { Backend, Database, Runtime } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";
import { isCancel, navigableSelect } from "./navigable";

export async function getDatabaseChoice(database?: Database, backend?: Backend, runtime?: Runtime) {
  if (backend === "convex" || backend === "none") {
    return "none";
  }

  if (database !== undefined) return database;

  const databaseOptions: Array<{
    value: Database;
    label: string;
    hint: string;
  }> = [
    {
      value: "none",
      label: "None",
      hint: "No database setup",
    },
    {
      value: "sqlite",
      label: "SQLite",
      hint: "lightweight, server-less, embedded relational database",
    },
    {
      value: "postgres",
      label: "PostgreSQL",
      hint: "powerful, open source object-relational database system",
    },
    {
      value: "mysql",
      label: "MySQL",
      hint: "popular open-source relational database system",
    },
  ];

  if (runtime !== "workers") {
    databaseOptions.push({
      value: "mongodb",
      label: "MongoDB",
      hint: "open-source NoSQL database that stores data in JSON-like documents called BSON",
    });
    databaseOptions.push({
      value: "edgedb",
      label: "EdgeDB",
      hint: "graph-relational database with built-in query builder (no ORM needed)",
    });
    databaseOptions.push({
      value: "redis",
      label: "Redis",
      hint: "in-memory data store for caching, sessions, and real-time features",
    });
  }

  const response = await navigableSelect<Database>({
    message: "Select database",
    options: databaseOptions,
    initialValue: DEFAULT_CONFIG.database,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
