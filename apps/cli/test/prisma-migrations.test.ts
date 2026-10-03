import { expect, test } from "bun:test";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { expectSuccess, runCreateTest } from "./test-utils";

test("manual Prisma projects do not leave an empty initial migration directory", async () => {
  const result = await runCreateTest({
    projectName: "manual-prisma-migrations",
    frontend: ["next"],
    backend: "hono",
    runtime: "node",
    database: "postgres",
    orm: "prisma",
    dbSetup: "prisma-postgres",
    auth: "better-auth",
    examples: ["todo"],
  });
  expectSuccess(result);
  const entries = await readdir(path.join(result.projectDir!, "packages/db/prisma/migrations"));
  expect(entries).not.toContain("0000_init");
});
