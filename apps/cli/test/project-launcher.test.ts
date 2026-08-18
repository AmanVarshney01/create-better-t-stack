import { describe, expect, it } from "bun:test";

import {
  PROJECT_LAUNCHERS,
  ProjectLauncherSchema,
  detectProjectLaunchers,
  getProjectLauncherChoice,
  launchProject,
} from "../src/utils/project-launcher";

describe("project launcher", () => {
  it("defines unique launcher ids accepted by the CLI schema", () => {
    const ids = PROJECT_LAUNCHERS.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(ProjectLauncherSchema.safeParse(id).success).toBe(true);
    }
    expect(ProjectLauncherSchema.safeParse("none").success).toBe(true);
  });

  it("detects installed editors and agents and resolves command aliases", async () => {
    const installed = new Set([
      "code",
      "zeditor",
      "webstorm",
      "intellij-idea",
      "codex",
      "claude",
      "pi",
    ]);
    const launchers = await detectProjectLaunchers(
      "/tmp/my-app",
      async (command) => installed.has(command),
      "darwin",
    );

    expect(launchers.map(({ id }) => id)).toEqual([
      "vscode",
      "zed",
      "webstorm",
      "intellij-idea",
      "codex-app",
      "codex",
      "claude-code",
      "pi",
    ]);
    expect(launchers.find(({ id }) => id === "zed")).toMatchObject({
      command: "zeditor",
      args: ["/tmp/my-app"],
    });
    expect(launchers.find(({ id }) => id === "intellij-idea")).toMatchObject({
      command: "intellij-idea",
      args: ["/tmp/my-app"],
    });
    expect(launchers.find(({ id }) => id === "claude-code")).toMatchObject({
      command: "claude",
      args: [],
      cwd: "/tmp/my-app",
    });
  });

  it("opens Neovim on the generated project directory", async () => {
    const launchers = await detectProjectLaunchers(
      "/tmp/my-app",
      async (command) => command === "nvim",
      "linux",
    );

    expect(launchers).toEqual([
      {
        id: "neovim",
        label: "Neovim",
        kind: "editor",
        command: "nvim",
        args: ["."],
        cwd: "/tmp/my-app",
      },
    ]);
  });

  it("only offers the Codex app launcher on supported platforms", async () => {
    const detectCommand = async (command: string) => command === "codex";
    const macLaunchers = await detectProjectLaunchers("/tmp/my-app", detectCommand, "darwin");
    const linuxLaunchers = await detectProjectLaunchers("/tmp/my-app", detectCommand, "linux");

    expect(macLaunchers.map(({ id }) => id)).toEqual(["codex-app", "codex"]);
    expect(linuxLaunchers.map(({ id }) => id)).toEqual(["codex"]);
  });

  it("uses the documented entry commands for additional coding agents", async () => {
    const installed = new Set(["kiro-cli", "droid", "goose", "cline", "cn", "crush"]);
    const launchers = await detectProjectLaunchers(
      "/tmp/my-app",
      async (command) => installed.has(command),
      "darwin",
    );

    expect(launchers.map(({ id }) => id)).toEqual([
      "kiro-cli",
      "droid",
      "goose",
      "cline",
      "continue",
      "crush",
    ]);
    expect(launchers.find(({ id }) => id === "goose")).toMatchObject({
      command: "goose",
      args: ["session"],
      cwd: "/tmp/my-app",
    });
    expect(launchers.find(({ id }) => id === "continue")).toMatchObject({
      command: "cn",
      args: [],
      cwd: "/tmp/my-app",
    });
  });

  it("uses the documented T3 Code and Orca project-opening commands", async () => {
    const installed = new Set(["t3", "orca"]);
    const launchers = await detectProjectLaunchers(
      "/tmp/my-app",
      async (command) => installed.has(command),
      "darwin",
    );

    expect(launchers.map(({ id }) => id)).toEqual(["t3-code", "orca"]);
    expect(launchers.find(({ id }) => id === "t3-code")).toMatchObject({
      command: "t3",
      args: [],
      cwd: "/tmp/my-app",
    });
    expect(launchers.find(({ id }) => id === "orca")).toMatchObject({
      command: "orca",
      launchSequence: [
        { command: "orca", args: ["open", "--json"] },
        {
          command: "orca",
          args: ["repo", "add", "--path", "/tmp/my-app", "--json"],
        },
      ],
    });
  });

  it("uses Orca's Linux-specific CLI name", async () => {
    const launchers = await detectProjectLaunchers(
      "/tmp/my-app",
      async (command) => command === "orca-ide",
      "linux",
    );

    expect(launchers.map(({ id }) => id)).toEqual(["orca"]);
    expect(launchers[0]).toMatchObject({
      command: "orca-ide",
      launchSequence: [
        { command: "orca-ide", args: ["open", "--json"] },
        {
          command: "orca-ide",
          args: ["repo", "add", "--path", "/tmp/my-app", "--json"],
        },
      ],
    });
  });

  it("returns a useful error for an explicitly requested missing launcher", async () => {
    const result = await getProjectLauncherChoice("opencode", "/tmp/my-app", {
      detectCommand: async () => false,
      prompt: false,
    });

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toContain("OpenCode");
      expect(result.error.message).toContain("PATH");
    }
  });

  it("does not scan PATH when the interactive picker is disabled", async () => {
    let detectionCount = 0;
    const result = await getProjectLauncherChoice(undefined, "/tmp/my-app", {
      detectCommand: async () => {
        detectionCount += 1;
        return true;
      },
      prompt: false,
    });

    expect(result.isOk()).toBe(true);
    expect(detectionCount).toBe(0);
  });

  it("opens GUI launchers with a path and terminal agents from the project directory", async () => {
    const calls: Array<{
      command: string;
      args: string[];
      options: { cwd?: string; stdio: "inherit" | "ignore" };
    }> = [];
    const runner = async (
      command: string,
      args: string[],
      options: { cwd?: string; stdio: "inherit" | "ignore" },
    ) => {
      calls.push({ command, args, options });
    };

    const editorResult = await launchProject(
      {
        id: "vscode",
        label: "Visual Studio Code",
        kind: "editor",
        command: "code",
        args: ["/tmp/my-app"],
      },
      { runner, skipExternalCommands: false },
    );
    const agentResult = await launchProject(
      {
        id: "opencode",
        label: "OpenCode",
        kind: "agent",
        command: "opencode",
        args: [],
        cwd: "/tmp/my-app",
      },
      { runner, skipExternalCommands: false },
    );

    expect(editorResult.isOk()).toBe(true);
    expect(agentResult.isOk()).toBe(true);
    expect(calls).toEqual([
      {
        command: "code",
        args: ["/tmp/my-app"],
        options: { cwd: undefined, stdio: "ignore" },
      },
      {
        command: "opencode",
        args: [],
        options: { cwd: "/tmp/my-app", stdio: "inherit" },
      },
    ]);
  });

  it("keeps launcher failures non-throwing", async () => {
    const result = await launchProject(
      {
        id: "vscode",
        label: "Visual Studio Code",
        kind: "editor",
        command: "code",
        args: ["/tmp/my-app"],
      },
      {
        runner: async () => {
          throw new Error("launch failed");
        },
        skipExternalCommands: false,
      },
    );

    expect(result.isErr()).toBe(true);
    if (result.isErr()) {
      expect(result.error.message).toBe("Could not open the project with Visual Studio Code.");
    }
  });

  it("runs multi-command launchers in order", async () => {
    const calls: Array<{ command: string; args: string[] }> = [];
    const result = await launchProject(
      {
        id: "orca",
        label: "Orca",
        kind: "agent",
        command: "orca",
        args: [],
        launchSequence: [
          { command: "orca", args: ["open", "--json"] },
          {
            command: "orca",
            args: ["repo", "add", "--path", "/tmp/my-app", "--json"],
          },
        ],
      },
      {
        runner: async (command, args) => {
          calls.push({ command, args });
        },
        skipExternalCommands: false,
      },
    );

    expect(result.isOk()).toBe(true);
    expect(calls).toEqual([
      { command: "orca", args: ["open", "--json"] },
      {
        command: "orca",
        args: ["repo", "add", "--path", "/tmp/my-app", "--json"],
      },
    ]);
  });

  it("honors external-command guards", async () => {
    let launched = false;
    const result = await launchProject(
      {
        id: "codex",
        label: "Codex CLI",
        kind: "agent",
        command: "codex",
        args: [],
        cwd: "/tmp/my-app",
      },
      {
        runner: async () => {
          launched = true;
        },
        skipExternalCommands: true,
      },
    );

    expect(result.isOk()).toBe(true);
    expect(launched).toBe(false);
  });
});
