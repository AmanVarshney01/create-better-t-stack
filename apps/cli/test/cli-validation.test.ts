import { expect, test } from "bun:test";

import { FailedToExitError } from "trpc-cli";

import { createBtsCli } from "../src/index";

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
