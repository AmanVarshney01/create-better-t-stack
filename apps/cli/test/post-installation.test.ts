import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";

import { displayPostInstallInstructions } from "../src/helpers/core/post-installation";
import type { ProjectConfig } from "../src/types";
import { cliConsola } from "../src/utils/terminal-output";

const baseConfig = {
  projectName: "cloudflare-d1-app",
  projectDir: "/tmp/cloudflare-d1-app",
  relativePath: "cloudflare-d1-app",
  database: "sqlite",
  backend: "self",
  runtime: "none",
  frontend: ["next"],
  addons: ["none"],
  examples: ["none"],
  auth: "none",
  payments: "none",
  git: false,
  packageManager: "bun",
  install: false,
  dbSetup: "d1",
  api: "trpc",
  webDeploy: "cloudflare",
  serverDeploy: "none",
} satisfies Omit<ProjectConfig, "orm">;

afterEach(() => {
  mock.restore();
});

describe("post-install instructions", () => {
  for (const testCase of [
    {
      orm: "drizzle" as const,
      commands: ["bun install", "bun run db:generate", "bun run db:migrate:local", "bun run dev"],
    },
    {
      orm: "prisma" as const,
      commands: [
        "bun install",
        "bun run db:generate",
        "bun run db:migrate",
        "bun run db:migrate:local",
        "bun run dev",
      ],
    },
  ]) {
    it(`places ${testCase.orm} D1 setup before development`, async () => {
      const box = spyOn(cliConsola, "box").mockImplementation(() => {});
      spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

      await displayPostInstallInstructions({
        ...baseConfig,
        orm: testCase.orm,
        depsInstalled: false,
      });

      const output = String(box.mock.calls[0]?.[0] ?? "");
      const nextSteps = output.slice(
        output.indexOf("Next steps"),
        output.indexOf("Your project will be available at:"),
      );
      const positions = testCase.commands.map((command) => nextSteps.indexOf(command));

      expect(positions.every((position) => position >= 0)).toBe(true);
      expect(positions).toEqual([...positions].sort((a, b) => a - b));
      expect(output.match(/bun run db:generate/g)).toHaveLength(1);
      expect(output.match(/bun run db:migrate:local/g)).toHaveLength(1);
      if (testCase.orm === "prisma") {
        expect(output.match(/bun run db:migrate(?!:)/g)).toHaveLength(1);
      }
    });
  }

  it("places standalone Worker D1 schema setup before development", async () => {
    const box = spyOn(cliConsola, "box").mockImplementation(() => {});
    spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

    await displayPostInstallInstructions({
      ...baseConfig,
      backend: "hono",
      runtime: "workers",
      orm: "prisma",
      serverDeploy: "cloudflare",
      depsInstalled: false,
    });

    const output = String(box.mock.calls[0]?.[0] ?? "");
    const nextSteps = output.slice(
      output.indexOf("Next steps"),
      output.indexOf("Your project will be available at:"),
    );
    const commands = ["bun install", "bun run db:generate", "bun run db:migrate", "bun run dev"];
    const positions = commands.map((command) => nextSteps.indexOf(command));

    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(nextSteps).not.toContain("db:migrate:local");
    expect(nextSteps).not.toContain("Complete D1 database setup first");
    expect(output.match(/bun run db:generate/g)).toHaveLength(1);
    expect(output.match(/bun run db:migrate(?!:)/g)).toHaveLength(1);
  });
});
