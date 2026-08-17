import { describe, expect, it } from "bun:test";

import { initTRPC } from "@trpc/server";

import { router } from "../src/index";

const caller = initTRPC.create().createCallerFactory(router)({});

describe("Schema command", () => {
  it("returns full schema payload for 'all'", async () => {
    const result = await caller.schema({ name: "all" });

    expect(result).toHaveProperty("cli");
    expect(result).toHaveProperty("schemas");
    expect(result.schemas).toHaveProperty("createInput");
    expect(result.schemas).toHaveProperty("addInput");
    expect(result.schemas).toHaveProperty("addonOptions");
    expect(result.schemas).toHaveProperty("dbSetupOptions");
    expect(Array.isArray(result.cli.commands)).toBe(true);
  });

  it("returns a specific schema payload", async () => {
    const result = await caller.schema({ name: "createInput" });

    expect(result).toHaveProperty("type", "object");
    expect(result).toHaveProperty("properties");
  });

  it("includes agent-focused commands in CLI introspection", async () => {
    const result = await caller.schema({ name: "cli" });
    const commandNames = result.commands.map((command) => command.name);

    expect(commandNames).toContain("create-json");
    expect(commandNames).toContain("add-json");
    expect(commandNames).toContain("schema");
  });

  it("describes the post-create launcher option", async () => {
    const result = await caller.schema({ name: "cli" });
    const createCommand = result.commands.find((command) => command.name === "create");
    const openOption = createCommand?.options.find((option) => option.name === "open");

    expect(openOption?.choices).toContain("vscode");
    expect(openOption?.choices).toContain("codex");
    expect(openOption?.choices).toContain("claude-code");
    expect(openOption?.choices).toContain("opencode");
    expect(openOption?.choices).toContain("pi");
    expect(openOption?.choices).toContain("goose");
    expect(openOption?.choices).toContain("continue");
  });
});
