import { expect, test } from "bun:test";

import { FailedToExitError } from "trpc-cli";

import { createBtsCli } from "../src/index";
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
  } as const;

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
  } as const;

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
  } as const;

  const result = processAndValidateFlags(options, getProvidedFlags(options), "my-app");

  expect(result.isErr()).toBe(true);
  if (result.isErr()) {
    expect(result.error.message).toContain(
      "Cloudflare D1 setup requires SQLite database and either Cloudflare Workers runtime with server deployment or backend 'self' with Cloudflare web deployment.",
    );
  }
});
