import path from "node:path";

import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

import { navigableMultiselect, navigableSelect } from "../../prompts/navigable";
import { navigableGroup } from "../../prompts/navigable-group";
import type { ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageRunnerPrefix } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

type UltraciteOptions = NonNullable<NonNullable<ProjectConfig["addonOptions"]>["ultracite"]>;
type UltraciteLinter = NonNullable<UltraciteOptions["linter"]>;
type UltraciteEditor = NonNullable<UltraciteOptions["editors"]>[number];
type UltraciteAgent = NonNullable<UltraciteOptions["agents"]>[number];
type UltraciteHook = NonNullable<UltraciteOptions["hooks"]>[number];

type UltraciteSetupResult = Result<void, AddonSetupError | UserCancelledError>;
type UltraciteInitArgsInput = {
  packageManager: ProjectConfig["packageManager"];
  linter: UltraciteLinter;
  frameworks: string[];
  editors: UltraciteEditor[];
  agents: UltraciteAgent[];
  hooks: UltraciteHook[];
  gitHooks: string[];
};

const LINTERS = {
  biome: { label: "Biome (Recommended)" },
  oxlint: { label: "Oxlint + Oxfmt" },
} as const;

const EDITORS = {
  vscode: { label: "VS Code" },
  cursor: { label: "Cursor" },
  devin: { label: "Devin Desktop" },
  codebuddy: { label: "CodeBuddy" },
  antigravity: { label: "Antigravity IDE" },
  bob: { label: "IBM Bob" },
  kiro: { label: "Kiro" },
  trae: { label: "Trae" },
  void: { label: "Void" },
  zed: { label: "Zed" },
  universal: { label: "Universal (.vscode/settings.json)" },
} as const;

const AGENTS = {
  universal: { label: "Universal (AGENTS.md — covers all agents)" },
  claude: { label: "Claude Code" },
  replit: { label: "Replit Agent" },
  aider: { label: "Aider" },
  gemini: { label: "Gemini CLI" },
} as const;

const HOOKS = {
  cursor: { label: "Cursor" },
  devin: { label: "Devin Desktop" },
  codebuddy: { label: "CodeBuddy" },
  claude: { label: "Claude Code" },
  codex: { label: "Codex" },
  deepagents: { label: "Deep Agents" },
  copilot: { label: "GitHub Copilot" },
  grok: { label: "Grok Build" },
} as const;

// Pin the preset version so generated lint behavior is reproducible.
// Validate both linter presets against generated projects when bumping.
const ULTRACITE_VERSION = "8.0.0";

const DEFAULT_LINTER: UltraciteLinter = "biome";
const DEFAULT_EDITORS: UltraciteEditor[] = ["vscode"];
const DEFAULT_AGENTS: UltraciteAgent[] = ["universal"];
const DEFAULT_HOOKS: UltraciteHook[] = [];

function getFrameworksFromFrontend(frontend: string[]): string[] {
  // Tags mirror ultracite's own package.json detection (react-router -> remix rules)
  const frameworkMap = new Map<string, string[]>([
    ["tanstack-router", ["react", "tanstack"]],
    ["react-router", ["react", "remix"]],
    ["tanstack-start", ["react", "tanstack"]],
    ["next", ["react", "next"]],
    ["nuxt", ["vue"]],
    ["native-bare", ["react"]],
    ["native-uniwind", ["react"]],
    ["native-unistyles", ["react"]],
    ["svelte", ["svelte"]],
    ["solid", ["solid"]],
    ["astro", ["astro"]],
  ]);

  const frameworks = new Set<string>();

  for (const f of frontend) {
    for (const framework of frameworkMap.get(f) ?? []) {
      frameworks.add(framework);
    }
  }

  return Array.from(frameworks);
}

export function buildUltraciteInitArgs({
  packageManager,
  linter,
  frameworks,
  editors,
  agents,
  hooks,
  gitHooks,
}: UltraciteInitArgsInput): string[] {
  const ultraciteArgs = ["init", "--pm", packageManager, "--linter", linter];

  if (frameworks.length > 0) {
    ultraciteArgs.push("--frameworks", ...frameworks);
  }

  if (editors.length > 0) {
    ultraciteArgs.push("--editors", ...editors);
  }

  if (agents.length > 0) {
    ultraciteArgs.push("--agents", ...agents);
  }

  if (hooks.length > 0) {
    ultraciteArgs.push("--hooks", ...hooks);
  }

  if (gitHooks.length > 0) {
    ultraciteArgs.push("--integrations", ...gitHooks);
  }

  return [
    ...getPackageRunnerPrefix(packageManager),
    `ultracite@${ULTRACITE_VERSION}`,
    ...ultraciteArgs,
    "--skip-install",
    "--yes",
    "--quiet",
  ];
}

// `husky init` (run by ultracite's husky integration) writes a sample "<pm> test" hook line
async function removeHuskySampleHook(projectDir: string): Promise<void> {
  const hookPath = path.join(projectDir, ".husky", "pre-commit");
  if (!(await fs.pathExists(hookPath))) return;
  const content = await fs.readFile(hookPath, "utf-8");
  const cleaned = content
    .split("\n")
    .filter((line) => !/^(?:npm|pnpm|yarn|bun|deno)(?: run)? test$/.test(line.trim()))
    .join("\n");
  if (cleaned !== content) {
    await fs.writeFile(hookPath, cleaned);
  }
}

export async function setupUltracite(
  config: ProjectConfig,
  gitHooks: string[],
): Promise<UltraciteSetupResult> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir, frontend } = config;

  cliLog.info("Setting up Ultracite...");

  const configuredOptions = config.addonOptions?.ultracite;
  let linter = configuredOptions?.linter;
  let editors = configuredOptions?.editors;
  let agents = configuredOptions?.agents;
  let hooks = configuredOptions?.hooks;

  if (!linter || !editors || !agents || !hooks) {
    if (isSilent()) {
      linter = linter ?? DEFAULT_LINTER;
      editors = editors ?? [...DEFAULT_EDITORS];
      agents = agents ?? [...DEFAULT_AGENTS];
      hooks = hooks ?? [...DEFAULT_HOOKS];
    } else {
      const results = await navigableGroup<{
        linter: UltraciteLinter;
        editors: UltraciteEditor[];
        agents: UltraciteAgent[];
        hooks: UltraciteHook[];
      }>({
        linter: async () => {
          if (linter !== undefined) return linter;
          return navigableSelect<UltraciteLinter>({
            message: "Which linter do you want to use?",
            options: Object.entries(LINTERS).map(([key, linterOption]) => ({
              value: key as UltraciteLinter,
              label: linterOption.label,
            })),
            initialValue: linter ?? DEFAULT_LINTER,
          });
        },
        editors: async () => {
          if (editors !== undefined) return editors;
          return navigableMultiselect<UltraciteEditor>({
            message: "Which editors do you want to configure (recommended)?",
            required: false,
            options: Object.entries(EDITORS).map(([key, editor]) => ({
              value: key as UltraciteEditor,
              label: editor.label,
            })),
          });
        },
        agents: async () => {
          if (agents !== undefined) return agents;
          return navigableMultiselect<UltraciteAgent>({
            message: "Which agent files do you want to add (optional)?",
            required: false,
            options: Object.entries(AGENTS).map(([key, agent]) => ({
              value: key as UltraciteAgent,
              label: agent.label,
            })),
          });
        },
        hooks: async () => {
          if (hooks !== undefined) return hooks;
          return navigableMultiselect<UltraciteHook>({
            message: "Which agent hooks do you want to enable (optional)?",
            required: false,
            options: Object.entries(HOOKS).map(([key, hook]) => ({
              value: key as UltraciteHook,
              label: hook.label,
            })),
          });
        },
      });

      if (
        results.linter === undefined ||
        results.editors === undefined ||
        results.agents === undefined ||
        results.hooks === undefined
      ) {
        return userCancelled("Operation cancelled");
      }

      linter = results.linter;
      editors = results.editors;
      agents = results.agents;
      hooks = results.hooks;
    }
  }

  const frameworks = getFrameworksFromFrontend(frontend);
  const args = buildUltraciteInitArgs({
    packageManager,
    linter,
    frameworks,
    editors,
    agents,
    hooks,
    gitHooks,
  });

  const s = createSpinner();
  s.start("Running Ultracite init command...");

  const initResult = await Result.tryPromise({
    try: async () => {
      await $({ cwd: projectDir, env: { CI: "true" } })`${args}`;
    },
    catch: (e) => {
      s.stop(pc.red("Failed to run Ultracite init command"));
      return new AddonSetupError({
        addon: "ultracite",
        message: `Failed to set up Ultracite: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });

  if (initResult.isErr()) {
    cliLog.error(pc.red("Failed to set up Ultracite"));
    return initResult;
  }

  if (gitHooks.includes("husky")) {
    // best-effort: a failed sample-hook cleanup must not fail a successful init
    await Result.tryPromise({
      try: () => removeHuskySampleHook(projectDir),
      catch: (e) => e,
    });
  }

  s.stop("Ultracite setup successfully!");
  return Result.ok(undefined);
}
