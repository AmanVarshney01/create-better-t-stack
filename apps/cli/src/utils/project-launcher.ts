import { Result } from "better-result";
import { execa } from "execa";
import z from "zod";

import { isCancel, navigableSelect, setIsFirstPrompt } from "../prompts/navigable";
import { commandExists } from "./command-exists";
import { CLIError } from "./errors";
import { shouldSkipExternalCommands } from "./external-commands";

export const ProjectLauncherSchema = z
  .enum([
    "cursor",
    "vscode",
    "vscode-insiders",
    "zed",
    "windsurf",
    "vscodium",
    "webstorm",
    "intellij-idea",
    "sublime-text",
    "neovim",
    "codex-app",
    "codex",
    "t3-code",
    "claude-code",
    "opencode",
    "pi",
    "gemini-cli",
    "github-copilot",
    "kiro-cli",
    "droid",
    "goose",
    "cline",
    "continue",
    "amp",
    "aider",
    "qwen-code",
    "crush",
    "cursor-agent",
    "orca",
    "none",
  ])
  .describe("Editor, IDE, or coding agent to open after creating the project");

export type ProjectLauncher = z.infer<typeof ProjectLauncherSchema>;
export type ProjectLauncherKind = "editor" | "agent";

interface ProjectLauncherDefinition {
  id: Exclude<ProjectLauncher, "none">;
  label: string;
  kind: ProjectLauncherKind;
  commands: readonly string[];
  commandsByPlatform?: Partial<Record<NodeJS.Platform, readonly string[]>>;
  args?: (projectDir: string) => string[];
  cwd?: (projectDir: string) => string;
  launchSequence?: (command: string, projectDir: string) => ProjectLaunchCommand[];
  platforms?: readonly NodeJS.Platform[];
}

interface ProjectLaunchCommand {
  command: string;
  args: string[];
  cwd?: string;
}

export interface AvailableProjectLauncher {
  id: Exclude<ProjectLauncher, "none">;
  label: string;
  kind: ProjectLauncherKind;
  command: string;
  args: string[];
  cwd?: string;
  launchSequence?: ProjectLaunchCommand[];
}

export const PROJECT_LAUNCHERS = [
  {
    id: "cursor",
    label: "Cursor",
    kind: "editor",
    commands: ["cursor"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "vscode",
    label: "Visual Studio Code",
    kind: "editor",
    commands: ["code"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "vscode-insiders",
    label: "Visual Studio Code Insiders",
    kind: "editor",
    commands: ["code-insiders"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "zed",
    label: "Zed",
    kind: "editor",
    commands: ["zed", "zeditor"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "windsurf",
    label: "Windsurf",
    kind: "editor",
    commands: ["windsurf"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "vscodium",
    label: "VSCodium",
    kind: "editor",
    commands: ["codium"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "webstorm",
    label: "JetBrains WebStorm",
    kind: "editor",
    commands: ["webstorm", "webstorm64.exe", "webstorm.bat", "webstorm.sh"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "intellij-idea",
    label: "JetBrains IntelliJ IDEA",
    kind: "editor",
    commands: ["idea", "intellij-idea", "idea64.exe", "idea.bat", "idea.sh"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "sublime-text",
    label: "Sublime Text",
    kind: "editor",
    commands: ["subl"],
    args: (projectDir) => [projectDir],
  },
  {
    id: "neovim",
    label: "Neovim",
    kind: "editor",
    commands: ["nvim"],
    args: () => ["."],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "codex-app",
    label: "Codex app",
    kind: "agent",
    commands: ["codex"],
    args: (projectDir) => ["app", projectDir],
    platforms: ["darwin"],
  },
  {
    id: "codex",
    label: "Codex CLI",
    kind: "agent",
    commands: ["codex"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "t3-code",
    label: "T3 Code",
    kind: "agent",
    commands: ["t3"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "claude-code",
    label: "Claude Code",
    kind: "agent",
    commands: ["claude"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "opencode",
    label: "OpenCode",
    kind: "agent",
    commands: ["opencode"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "pi",
    label: "Pi",
    kind: "agent",
    commands: ["pi"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "gemini-cli",
    label: "Gemini CLI",
    kind: "agent",
    commands: ["gemini"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "github-copilot",
    label: "GitHub Copilot CLI",
    kind: "agent",
    commands: ["copilot"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "kiro-cli",
    label: "Kiro CLI",
    kind: "agent",
    commands: ["kiro-cli"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "droid",
    label: "Factory Droid",
    kind: "agent",
    commands: ["droid"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "goose",
    label: "goose",
    kind: "agent",
    commands: ["goose"],
    args: () => ["session"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "cline",
    label: "Cline CLI",
    kind: "agent",
    commands: ["cline"],
    cwd: (projectDir) => projectDir,
    platforms: ["darwin", "linux"],
  },
  {
    id: "continue",
    label: "Continue CLI",
    kind: "agent",
    commands: ["cn"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "amp",
    label: "Amp",
    kind: "agent",
    commands: ["amp"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "aider",
    label: "Aider",
    kind: "agent",
    commands: ["aider"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "qwen-code",
    label: "Qwen Code",
    kind: "agent",
    commands: ["qwen"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "crush",
    label: "Crush",
    kind: "agent",
    commands: ["crush"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "cursor-agent",
    label: "Cursor Agent",
    kind: "agent",
    commands: ["cursor-agent"],
    cwd: (projectDir) => projectDir,
  },
  {
    id: "orca",
    label: "Orca",
    kind: "agent",
    commands: ["orca"],
    commandsByPlatform: { linux: ["orca-ide"] },
    launchSequence: (command, projectDir) => [
      { command, args: ["open", "--json"] },
      { command, args: ["repo", "add", "--path", projectDir, "--json"] },
    ],
  },
] as const satisfies readonly ProjectLauncherDefinition[];

type CommandDetector = (command: string) => Promise<boolean>;

export async function detectProjectLaunchers(
  projectDir: string,
  detectCommand: CommandDetector = commandExists,
  platform: NodeJS.Platform = process.platform,
): Promise<AvailableProjectLauncher[]> {
  const definitions: readonly ProjectLauncherDefinition[] = PROJECT_LAUNCHERS;
  const supportedDefinitions = definitions.filter(
    ({ platforms }) => platforms === undefined || platforms.includes(platform),
  );
  const commandsFor = (launcher: ProjectLauncherDefinition) =>
    launcher.commandsByPlatform?.[platform] ?? launcher.commands;
  const commands = [...new Set(supportedDefinitions.flatMap(commandsFor))];
  const detectedCommands = new Map(
    await Promise.all(
      commands.map(async (command) => [command, await detectCommand(command)] as const),
    ),
  );

  return supportedDefinitions.flatMap((launcher) => {
    const command = commandsFor(launcher).find((candidate) => detectedCommands.get(candidate));
    if (!command) return [];

    const availableLauncher: AvailableProjectLauncher = {
      id: launcher.id,
      label: launcher.label,
      kind: launcher.kind,
      command,
      args: launcher.args?.(projectDir) ?? [],
      cwd: launcher.cwd?.(projectDir),
    };
    if (launcher.launchSequence) {
      availableLauncher.launchSequence = launcher.launchSequence(command, projectDir);
    }
    return [availableLauncher];
  });
}

export async function getProjectLauncherChoice(
  requestedLauncher: ProjectLauncher | undefined,
  projectDir: string,
  options: {
    detectCommand?: CommandDetector;
    platform?: NodeJS.Platform;
    prompt?: boolean;
  } = {},
): Promise<Result<AvailableProjectLauncher | undefined, CLIError>> {
  if (requestedLauncher === "none") return Result.ok(undefined);
  if (!requestedLauncher && options.prompt === false) return Result.ok(undefined);

  const availableLaunchers = await detectProjectLaunchers(
    projectDir,
    options.detectCommand,
    options.platform,
  );

  if (requestedLauncher) {
    const launcher = availableLaunchers.find(({ id }) => id === requestedLauncher);
    if (launcher) return Result.ok(launcher);

    const definition = PROJECT_LAUNCHERS.find(({ id }) => id === requestedLauncher);
    return Result.err(
      new CLIError({
        message: `${definition?.label ?? requestedLauncher} is not installed or its command is not available in PATH.`,
      }),
    );
  }

  if (availableLaunchers.length === 0) {
    return Result.ok(undefined);
  }

  setIsFirstPrompt(true);
  try {
    const selected = await navigableSelect<ProjectLauncher>({
      message: "Open project with?",
      options: [
        ...availableLaunchers.map(({ id, label, kind }) => ({
          value: id,
          label,
          hint: kind === "editor" ? "editor / IDE" : "coding agent",
        })),
        { value: "none" as const, label: "Not now" },
      ],
      initialValue: "none",
      maxItems: 12,
    });

    if (isCancel(selected) || selected === "none") return Result.ok(undefined);
    return Result.ok(availableLaunchers.find(({ id }) => id === selected));
  } finally {
    setIsFirstPrompt(false);
  }
}

type CommandRunner = (
  command: string,
  args: string[],
  options: { cwd?: string; stdio: "inherit" | "ignore" },
) => Promise<void>;

const runCommand: CommandRunner = async (command, args, options) => {
  await execa(command, args, options);
};

export async function launchProject(
  launcher: AvailableProjectLauncher,
  options: {
    runner?: CommandRunner;
    skipExternalCommands?: boolean;
  } = {},
): Promise<Result<void, CLIError>> {
  if (options.skipExternalCommands ?? shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  return Result.tryPromise({
    try: async () => {
      const commands = launcher.launchSequence ?? [launcher];
      for (const command of commands) {
        await (options.runner ?? runCommand)(command.command, command.args, {
          cwd: command.cwd,
          stdio: command.cwd ? "inherit" : "ignore",
        });
      }
    },
    catch: (cause: unknown) =>
      new CLIError({
        message: `Could not open the project with ${launcher.label}.`,
        cause,
      }),
  });
}
