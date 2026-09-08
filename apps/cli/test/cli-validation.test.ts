import { expect, test, spyOn } from "bun:test";

import { FailedToExitError } from "trpc-cli";

import { createBtsCli } from "../src/index";
import { getAvailableAuthProviders } from "../src/prompts/auth";
import { getDBSetupChoice } from "../src/prompts/database-setup";
import * as navigable from "../src/prompts/navigable";
import type { CLIInput } from "../src/types";
import { validateDatabaseSetup, validateBackendConstraints } from "../src/utils/config-validation";
import { getProvidedFlags, processAndValidateFlags } from "../src/validation";

test("surfaces a friendly validation error for invalid addons", async () => {
  const logs: string[] = [];

  const result = await createBtsCli()
    .run({
      argv: ["create", "ryu", "--addons", "ruler"],
      logger: {
        error: (...args) => logs.push(args.map(String).join(" ")),
      },
      process: { exit: () => 0 as never },
    })
    .catch((error) => error);

  expect(result).toBeInstanceOf(FailedToExitError);
  expect(result.exitCode).toBe(1);

  const output = logs.join("\n");

  expect(output).toContain("Invalid option");
  expect(output).toContain("at [1].addons[0]");
  expect(output).not.toContain("ORPCError");
  expect(output).not.toContain("Input validation failed");
});

test("allows self + D1 flags before web deploy is resolved by prompts", () => {
  const options = {
    backend: "self",
    frontend: ["next"],
    database: "sqlite",
    orm: "drizzle",
    dbSetup: "d1",
    api: "trpc",
    auth: "better-auth",
    payments: "none",
    addons: ["none"],
    examples: ["none"],
    runtime: "none",
  } satisfies CLIInput;

  const result = processAndValidateFlags(options, getProvidedFlags(options), "my-app");

  expect(result.isOk()).toBe(true);
});

test("allows workers + D1 flags before server deploy is resolved by prompts", () => {
  const options = {
    backend: "hono",
    frontend: ["tanstack-router"],
    database: "sqlite",
    orm: "drizzle",
    dbSetup: "d1",
    api: "trpc",
    auth: "none",
    payments: "none",
    addons: ["none"],
    examples: ["none"],
    runtime: "workers",
  } satisfies CLIInput;

  const result = processAndValidateFlags(options, getProvidedFlags(options), "my-app");

  expect(result.isOk()).toBe(true);
});

test("still rejects D1 when the remaining prompt flow cannot resolve it to a valid target", () => {
  const options = {
    backend: "hono",
    frontend: ["tanstack-router"],
    database: "sqlite",
    orm: "drizzle",
    dbSetup: "d1",
    api: "trpc",
    auth: "none",
    payments: "none",
    addons: ["none"],
    examples: ["none"],
    runtime: "node",
  } satisfies CLIInput;

  const result = processAndValidateFlags(options, getProvidedFlags(options), "my-app");

  expect(result.isErr()).toBe(true);
  if (result.isErr()) {
    expect(result.error.message).toContain(
      "Cloudflare D1 setup requires SQLite database and either Cloudflare Workers runtime with server deployment or backend 'self' with Cloudflare web deployment.",
    );
  }
});

test("rejects Alchemy database provisioning without a matching deployment", () => {
  const options = {
    backend: "hono",
    frontend: ["tanstack-router"],
    database: "postgres",
    orm: "drizzle",
    dbSetup: "neon",
    dbSetupOptions: { mode: "alchemy" },
    api: "trpc",
    auth: "none",
    payments: "none",
    addons: ["none"],
    examples: ["none"],
    runtime: "bun",
    webDeploy: "none",
    serverDeploy: "vercel",
  } satisfies CLIInput;

  const result = processAndValidateFlags(options, getProvidedFlags(options), "my-app");

  expect(result.isErr()).toBe(true);
  if (result.isErr()) {
    expect(result.error.message).toContain(
      "Alchemy database provisioning requires Neon, PlanetScale, or Prisma Postgres",
    );
  }
});

test("rejects automatic PlanetScale provisioning with an actionable alternative", () => {
  const options = {
    backend: "hono",
    frontend: ["tanstack-router"],
    database: "postgres",
    orm: "drizzle",
    dbSetup: "planetscale",
    dbSetupOptions: { mode: "auto" },
    api: "trpc",
    auth: "none",
    payments: "none",
    addons: ["none"],
    examples: ["none"],
    runtime: "bun",
    webDeploy: "none",
    serverDeploy: "prisma",
  } satisfies CLIInput;

  const result = processAndValidateFlags(options, getProvidedFlags(options), "my-app");

  expect(result.isErr()).toBe(true);
  if (result.isErr()) {
    expect(result.error.message).toContain("PlanetScale does not support automatic database setup");
    expect(result.error.message).toContain("'alchemy' or 'manual'");
  }
});

test("database setup prompts exclude options rejected by Workers validation", async () => {
  const offered: string[][] = [];
  const select = spyOn(navigable, "navigableSelect").mockImplementation(async (options) => {
    offered.push(options.options.map((option) => String(option.value)));
    return options.options[0].value;
  });
  try {
    await getDBSetupChoice("postgres", undefined, "drizzle", "hono", "workers");
    await getDBSetupChoice("postgres", undefined, "drizzle", "hono", "bun");
    expect(offered[0]).toContain("neon");
    expect(offered[0]).not.toContain("docker");
    expect(offered[1]).toContain("docker");
    for (const dbSetup of offered[0]) {
      expect(
        validateDatabaseSetup(
          {
            database: "postgres",
            runtime: "workers",
            backend: "hono",
            dbSetup: dbSetup as CLIInput["dbSetup"],
          },
          new Set(["database", "dbSetup"]),
        ).isOk(),
      ).toBe(true);
    }
  } finally {
    select.mockRestore();
  }
});

test("native selection does not hide an unsupported web auth integration in prompts or validation", () => {
  const frontend = ["nuxt", "native-bare"] as const;
  expect(getAvailableAuthProviders("convex", frontend)).toEqual(["none"]);
  const config = { backend: "convex", frontend: [...frontend], auth: "clerk" } as const;
  expect(
    validateBackendConstraints(
      { ...config, frontend: [...frontend] },
      new Set(["auth", "frontend"]),
      {},
    ).isErr(),
  ).toBe(true);
});

test("server-only Clerk remains available without requiring a generated frontend", () => {
  expect(getAvailableAuthProviders("hono", [])).toContain("clerk");
  expect(
    validateBackendConstraints(
      { backend: "hono", frontend: ["none"], auth: "clerk" },
      new Set(["auth", "frontend"]),
      {},
    ).isOk(),
  ).toBe(true);
});
