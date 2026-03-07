import { describe, expect, it } from "bun:test";

import { buildTauriInitArgs } from "../src/helpers/addons/tauri-setup";

describe("Tauri setup", () => {
  it("builds init args with split-value flags for cross-platform safety", () => {
    const args = buildTauriInitArgs({
      packageManager: "bun",
      frontend: ["next"],
      projectDir: "/tmp/my app",
    });

    expect(args).toContain("@tauri-apps/cli@latest");
    expect(args).toContain("--app-name");
    expect(args).toContain("my app");
    expect(args).toContain("--before-dev-command");
    expect(args).toContain("bun run dev");
    expect(args).toContain("--before-build-command");
    expect(args).toContain("bun run build");
    expect(args.some((arg) => arg.startsWith("--app-name="))).toBe(false);
    expect(args.some((arg) => arg.startsWith("--before-dev-command="))).toBe(false);
    expect(args.some((arg) => arg.startsWith("--before-build-command="))).toBe(false);
  });
});
