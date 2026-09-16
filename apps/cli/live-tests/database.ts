import { Database } from "bun:sqlite";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ProjectConfig } from "@better-t-stack/types";
import { expect } from "@playwright/test";
import { SQL } from "bun";
import { z } from "zod";

import type { Commands } from "./command";

export async function migrateDatabase(config: ProjectConfig, commands: Commands) {
  const directory = path.join(config.projectDir, "packages/db");
  if (config.orm === "prisma") {
    await commands.run("prisma-generate", directory, config.packageManager, ["run", "db:generate"]);
    const sql = await commands.run("migration-generate", directory, "node", [
      "node_modules/prisma/build/index.js",
      "migrate",
      "diff",
      "--from-empty",
      "--to-schema",
      "prisma/schema",
      "--script",
    ]);
    const migrations = path.join(directory, "prisma/migrations");
    await mkdir(path.join(migrations, "0_init"), { recursive: true });
    await writeFile(path.join(migrations, "0_init/migration.sql"), sql);
    await writeFile(
      path.join(migrations, "migration_lock.toml"),
      `provider = "${config.database === "postgres" ? "postgresql" : config.database}"\n`,
    );
  } else {
    await commands.run("migration-generate", directory, config.packageManager, [
      "run",
      "db:generate",
    ]);
  }
  for (const step of ["apply", "repeat"])
    await commands.run(`migration-${step}`, directory, config.packageManager, [
      "run",
      "db:migrate:deploy",
    ]);
  await commands.run("database-push", directory, config.packageManager, ["run", "db:push"]);
}

export class DatabaseAssertions {
  private sqlite?: Database;
  private postgres?: SQL;
  constructor(url: string) {
    if (url.startsWith("file:")) this.sqlite = new Database(url.slice(5), { readonly: true });
    else this.postgres = new SQL(url, { max: 1, connectionTimeout: 15 });
  }
  private async rows(query: string, value: string) {
    const rows = this.sqlite
      ? this.sqlite.query(query).all(value)
      : await this.postgres!.unsafe(query.replace("?", "$1"), [value]);
    return z
      .array(
        z.object({
          name: z.string().optional(),
          completed: z.union([z.boolean(), z.literal(0), z.literal(1)]).optional(),
        }),
      )
      .parse(rows);
  }
  async user(email: string) {
    const rows = await this.rows('SELECT "name" FROM "user" WHERE "email" = ?', email);
    expect(rows, "Signup persisted exactly one user in the configured database").toEqual([
      { name: "Live Test" },
    ]);
  }
  async todo(text: string, completed: boolean | undefined) {
    const rows = await this.rows('SELECT "completed" FROM "todo" WHERE "text" = ?', text);
    if (completed === undefined)
      expect(rows, "Deleted todo is absent from the database").toEqual([]);
    else {
      expect(rows, "Todo persisted exactly once in the configured database").toHaveLength(1);
      expect(rows[0]?.completed, "Todo completion column exists").toBeDefined();
      expect(Boolean(rows[0]?.completed), "Database stores the expected completion state").toBe(
        completed,
      );
    }
  }
  async close() {
    this.sqlite?.close();
    await this.postgres?.close();
  }
}
