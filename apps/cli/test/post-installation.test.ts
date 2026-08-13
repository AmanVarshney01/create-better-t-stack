import { afterEach, describe, expect, it, mock, spyOn } from "bun:test";

import { displayPostInstallInstructions } from "../src/helpers/core/post-installation";
import type { ProjectConfig } from "../src/types";

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
      const stdout = spyOn(process.stdout, "write").mockImplementation(() => true);
      spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

      await displayPostInstallInstructions({
        ...baseConfig,
        orm: testCase.orm,
        depsInstalled: false,
      });

      const output = stdout.mock.calls.map(([chunk]) => String(chunk)).join("");
      const nextSteps = output.slice(
        output.indexOf("Next steps"),
        output.indexOf("Local development"),
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
    const stdout = spyOn(process.stdout, "write").mockImplementation(() => true);
    spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

    await displayPostInstallInstructions({
      ...baseConfig,
      backend: "hono",
      runtime: "workers",
      orm: "prisma",
      serverDeploy: "cloudflare",
      depsInstalled: false,
    });

    const output = stdout.mock.calls.map(([chunk]) => String(chunk)).join("");
    const nextSteps = output.slice(
      output.indexOf("Next steps"),
      output.indexOf("Local development"),
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

  for (const frontend of ["nuxt", "astro"] as const) {
    it(`uses Alchemy-owned local D1 setup for ${frontend}`, async () => {
      const stdout = spyOn(process.stdout, "write").mockImplementation(() => true);
      spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

      await displayPostInstallInstructions({
        ...baseConfig,
        frontend: [frontend],
        api: "orpc",
        orm: "drizzle",
        depsInstalled: false,
      });

      const output = stdout.mock.calls.map(([chunk]) => String(chunk)).join("");
      const nextSteps = output.slice(
        output.indexOf("Next steps"),
        output.indexOf("Local development"),
      );

      expect(nextSteps).toContain("bun run db:generate");
      expect(nextSteps).toContain("bun run dev");
      expect(nextSteps).not.toContain("db:migrate:local");
    });
  }

  it("shows external database steps when Alchemy deploys compute only", async () => {
    const stdout = spyOn(process.stdout, "write").mockImplementation(() => true);
    spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

    await displayPostInstallInstructions({
      ...baseConfig,
      projectName: "external-neon",
      database: "postgres",
      backend: "hono",
      runtime: "bun",
      frontend: ["tanstack-router"],
      orm: "prisma",
      dbSetup: "neon",
      dbSetupOptions: { mode: "manual" },
      webDeploy: "none",
      serverDeploy: "prisma",
      depsInstalled: false,
    });

    const output = stdout.mock.calls.map(([chunk]) => String(chunk)).join("");

    expect(output).not.toContain("Alchemy provisions Neon");
    expect(output).toContain("bun run db:push");
    expect(output).toContain("bun run db:studio");
  });

  it("shows the production origin handshake for split Alchemy deployments", async () => {
    const stdout = spyOn(process.stdout, "write").mockImplementation(() => true);
    spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

    await displayPostInstallInstructions({
      ...baseConfig,
      frontend: ["solid"],
      backend: "hono",
      runtime: "bun",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "none",
      auth: "better-auth",
      api: "orpc",
      webDeploy: "cloudflare",
      serverDeploy: "prisma",
      depsInstalled: true,
    });

    const output = stdout.mock.calls.map(([chunk]) => String(chunk)).join("");

    expect(output).toContain("Required after the first deploy: set CORS_ORIGIN");
    expect(output).toContain("BETTER_AUTH_URL in apps/server/.env");
  });

  it("only requests the Prisma Better Auth URL for a self deployment", async () => {
    const stdout = spyOn(process.stdout, "write").mockImplementation(() => true);
    spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline in test"));

    await displayPostInstallInstructions({
      ...baseConfig,
      frontend: ["solid"],
      backend: "self",
      runtime: "none",
      database: "postgres",
      orm: "drizzle",
      dbSetup: "none",
      auth: "better-auth",
      api: "orpc",
      webDeploy: "prisma",
      serverDeploy: "none",
      depsInstalled: true,
    });

    const output = stdout.mock.calls.map(([chunk]) => String(chunk)).join("");

    expect(output).not.toContain("CORS_ORIGIN");
    expect(output).toContain("BETTER_AUTH_URL in apps/web/.env");
  });
});
