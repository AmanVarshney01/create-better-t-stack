import { describe, expect, it } from "bun:test";

import {
  mergeResolvedDbSetupOptions,
  resolveDbSetupMode,
  resolveProjectDbSetupOptions,
  withDbSetupMode,
} from "../src/helpers/core/db-setup-options";
import { getDbProvisioningChoice } from "../src/prompts/database-setup";
import { runWithContext } from "../src/utils/context";

describe("DB setup mode resolution", () => {
  it("does not force auto mode when manualDb is explicitly false", () => {
    const mode = runWithContext({ silent: false }, () =>
      resolveDbSetupMode("neon", { manualDb: false }),
    );

    expect(mode).toBeUndefined();
  });

  it("defaults remote provisioning setups to manual in silent mode", () => {
    const mode = runWithContext({ silent: true }, () => resolveDbSetupMode("supabase"));

    expect(mode).toBe("manual");
  });

  it("drops dbSetupOptions when dbSetup is none", () => {
    const merged = runWithContext({ silent: false }, () =>
      mergeResolvedDbSetupOptions("none", { mode: "manual" }),
    );

    expect(merged).toBeUndefined();
  });

  it("defaults to Alchemy when the database consumer deploys with Alchemy", () => {
    const options = runWithContext({ silent: true }, () =>
      resolveProjectDbSetupOptions({
        backend: "hono",
        dbSetup: "neon",
        webDeploy: "none",
        serverDeploy: "prisma",
      }),
    );

    expect(options).toEqual({ mode: "alchemy" });
  });

  it("preserves automatic and manual setup with an Alchemy deployment", () => {
    const config = {
      backend: "hono" as const,
      dbSetup: "neon" as const,
      webDeploy: "none" as const,
      serverDeploy: "prisma" as const,
    };

    expect(resolveProjectDbSetupOptions({ ...config, dbSetupOptions: { mode: "auto" } })).toEqual({
      mode: "auto",
    });
    expect(resolveProjectDbSetupOptions(config, { manualDb: true })).toEqual({ mode: "manual" });
  });

  it("does not let an unrelated Alchemy web deployment own a split backend database", () => {
    const options = runWithContext({ silent: true }, () =>
      resolveProjectDbSetupOptions({
        backend: "hono",
        dbSetup: "neon",
        webDeploy: "prisma",
        serverDeploy: "vercel",
      }),
    );

    expect(options).toEqual({ mode: "manual" });
  });

  it("removes a stale Alchemy mode while preserving provider options", async () => {
    const mode = await getDbProvisioningChoice("alchemy", "neon", "hono", "prisma", "vercel");

    expect(mode).toBeUndefined();
    expect(withDbSetupMode({ mode: "alchemy", neon: { method: "neon-new" } }, mode)).toEqual({
      neon: { method: "neon-new" },
    });
  });
});
