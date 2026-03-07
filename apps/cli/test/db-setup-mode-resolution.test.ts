import { describe, expect, it } from "bun:test";

import {
  mergeResolvedDbSetupOptions,
  resolveDbSetupMode,
} from "../src/helpers/core/db-setup-options";
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
});
