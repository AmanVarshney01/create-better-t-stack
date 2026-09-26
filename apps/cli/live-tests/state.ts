import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

import { ProjectConfigSchema, type ProjectConfig } from "@better-t-stack/types";
import { z } from "zod";

export const statusSchema = z.enum(["running", "passed", "failed", "blocked", "interrupted"]);
export type Status = z.infer<typeof statusSchema>;
const rowSchema = z.object({
  id: z.string(),
  config: z.string(),
  status: statusSchema,
  detail: z.string(),
  directory: z.string(),
});
export const resourceSchema = z.object({
  case_id: z.string(),
  provider: z.enum(["vercel", "vercel-intent", "neon", "neon-intent", "alchemy", "docker"]),
  id: z.string(),
  directory: z.string(),
  deleted: z.number(),
});
export type Resource = z.infer<typeof resourceSchema>;

export class RunState {
  readonly db: Database;
  constructor(
    readonly directory: string,
    identity: string | undefined,
  ) {
    if (!identity && !existsSync(path.join(directory, "results.sqlite")))
      throw new Error(`No existing live test results in ${directory}`);
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    this.db = new Database(path.join(directory, "results.sqlite"));
    this.db.exec(`PRAGMA journal_mode=WAL;
      CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS cases (id TEXT PRIMARY KEY, config TEXT NOT NULL, status TEXT NOT NULL, detail TEXT NOT NULL, directory TEXT NOT NULL, updated TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS resources (case_id TEXT NOT NULL, provider TEXT NOT NULL, id TEXT NOT NULL, directory TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(provider,id));`);
    const previous = z
      .object({ value: z.string() })
      .optional()
      .parse(this.db.query("SELECT value FROM metadata WHERE key='identity'").get() ?? undefined);
    if (identity && previous && previous.value !== identity) {
      this.db.close();
      throw new Error("Run belongs to different source/configuration. Use a new run directory.");
    }
    if (identity)
      this.db.query("INSERT OR IGNORE INTO metadata VALUES ('identity', ?)").run(identity);
  }
  result(id: string) {
    const row = rowSchema
      .optional()
      .parse(this.db.query("SELECT * FROM cases WHERE id=?").get(id) ?? undefined);
    return row ? { ...row, config: ProjectConfigSchema.parse(JSON.parse(row.config)) } : undefined;
  }
  record(id: string, config: ProjectConfig, status: Status, detail: string, directory: string) {
    this.db
      .query("INSERT OR REPLACE INTO cases VALUES (?,?,?,?,?,?)")
      .run(id, JSON.stringify(config), status, detail, directory, new Date().toISOString());
  }
  resource(caseId: string, provider: Resource["provider"], id: string, directory: string) {
    this.db
      .query("INSERT OR REPLACE INTO resources VALUES (?,?,?,?,0)")
      .run(caseId, provider, id, directory);
  }
  resources(caseId?: string) {
    return z
      .array(resourceSchema)
      .parse(
        caseId
          ? this.db.query("SELECT * FROM resources WHERE deleted=0 AND case_id=?").all(caseId)
          : this.db.query("SELECT * FROM resources WHERE deleted=0").all(),
      );
  }
  deleted(resource: Resource) {
    this.db
      .query("UPDATE resources SET deleted=1 WHERE provider=? AND id=?")
      .run(resource.provider, resource.id);
  }
  summary() {
    return this.db.query("SELECT status, count(*) AS count FROM cases GROUP BY status").all();
  }
  metadata(key: string, value: string) {
    this.db.query("INSERT OR REPLACE INTO metadata VALUES (?,?)").run(key, value);
  }
  close() {
    this.db.close();
  }
}
