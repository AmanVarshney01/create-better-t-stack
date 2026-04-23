import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import { navigableMultiselect, navigableSelect } from "../../prompts/navigable";
import { navigableGroup } from "../../prompts/navigable-group";
import type { ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageRunnerPrefix } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

type UltraciteLinter = "biome" | "eslint" | "oxlint";

type UltraciteEditor =
  | "vscode"
  | "cursor"
  | "windsurf"
  | "codebuddy"
  | "antigravity"
  | "bob"
  | "kiro"
  | "trae"
  | "void"
  | "zed";

type UltraciteAgent =
  | "universal"
  | "claude"
  | "codex"
  | "jules"
  | "replit"
  | "devin"
  | "lovable"
  | "zencoder"
  | "ona"
  | "openclaw"
  | "continue"
  | "snowflake-cortex"
  | "deepagents"
  | "qoder"
  | "kimi-cli"
  | "mcpjam"
  | "mux"
  | "pi"
  | "adal"
  | "copilot"
  | "cline"
  | "amp"
  | "aider"
  | "firebase-studio"
  | "open-hands"
  | "gemini"
  | "junie"
  | "augmentcode"
  | "bob"
  | "kilo-code"
  | "goose"
  | "roo-code"
  | "warp"
  | "droid"
  | "opencode"
  | "crush"
  | "qwen"
  | "amazon-q-cli"
  | "firebender"
  | "cursor-cli"
  | "mistral-vibe"
  | "vercel";

type UltraciteHook = "cursor" | "windsurf" | "codebuddy" | "claude" | "copilot";

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
  eslint: { label: "ESLint + Prettier + Stylelint" },
  oxlint: { label: "Oxlint + Oxfmt" },
} as const;

// Labels mirror @repo/data in the upstream ultracite repo (packages/data/src).
const EDITORS = {
  vscode: { label: "Visual Studio Code" },
  cursor: { label: "Cursor" },
  windsurf: { label: "Windsurf" },
  codebuddy: { label: "CodeBuddy" },
  antigravity: { label: "Antigravity" },
  bob: { label: "IBM Bob" },
  kiro: { label: "Kiro" },
  trae: { label: "Trae" },
  void: { label: "Void" },
  zed: { label: "Zed" },
} as const;

const AGENTS = {
  universal: { label: "Universal (AGENTS.md — covers all agents)" },
  claude: { label: "Claude Code" },
  codex: { label: "Codex" },
  jules: { label: "Jules" },
  replit: { label: "Replit Agent" },
  devin: { label: "Devin" },
  lovable: { label: "Lovable" },
  zencoder: { label: "Zencoder" },
  ona: { label: "Ona" },
  openclaw: { label: "OpenClaw" },
  continue: { label: "Continue" },
  "snowflake-cortex": { label: "Snowflake Cortex" },
  deepagents: { label: "Deepagents" },
  qoder: { label: "Qoder" },
  "kimi-cli": { label: "Kimi CLI" },
  mcpjam: { label: "MCPJam" },
  mux: { label: "Mux" },
  pi: { label: "Pi" },
  adal: { label: "AdaL" },
  copilot: { label: "GitHub Copilot" },
  cline: { label: "Cline" },
  amp: { label: "AMP" },
  aider: { label: "Aider" },
  "firebase-studio": { label: "Firebase Studio" },
  "open-hands": { label: "OpenHands" },
  gemini: { label: "Gemini" },
  junie: { label: "Junie" },
  augmentcode: { label: "Augment Code" },
  bob: { label: "IBM Bob" },
  "kilo-code": { label: "Kilo Code" },
  goose: { label: "Goose" },
  "roo-code": { label: "Roo Code" },
  warp: { label: "Warp" },
  droid: { label: "Droid" },
  opencode: { label: "OpenCode" },
  crush: { label: "Crush" },
  qwen: { label: "Qwen Code" },
  "amazon-q-cli": { label: "Amazon Q CLI" },
  firebender: { label: "Firebender" },
  "cursor-cli": { label: "Cursor CLI" },
  "mistral-vibe": { label: "Mistral Vibe" },
  vercel: { label: "Vercel Agent" },
} as const;

// Only editors/agents whose upstream data entry declares a `hooks` property.
const HOOKS = {
  cursor: { label: "Cursor" },
  windsurf: { label: "Windsurf" },
  codebuddy: { label: "CodeBuddy" },
  claude: { label: "Claude Code" },
  copilot: { label: "GitHub Copilot" },
} as const;

const DEFAULT_LINTER: UltraciteLinter = "biome";
const DEFAULT_EDITORS: UltraciteEditor[] = ["vscode"];
const DEFAULT_AGENTS: UltraciteAgent[] = ["universal"];
const DEFAULT_HOOKS: UltraciteHook[] = [];

function getFrameworksFromFrontend(frontend: string[]): string[] {
  const frameworkMap: Record<string, string> = {
    "tanstack-router": "react",
    "react-router": "react",
    "tanstack-start": "react",
    next: "next",
    nuxt: "vue",
    "native-bare": "react",
    "native-uniwind": "react",
    "native-unistyles": "react",
    svelte: "svelte",
    solid: "solid",
    astro: "astro",
  };

  const frameworks = new Set<string>();

  for (const f of frontend) {
    if (f !== "none" && frameworkMap[f]) {
      frameworks.add(frameworkMap[f]);
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
    "ultracite@latest",
    ...ultraciteArgs,
    "--skip-install",
    "--quiet",
  ];
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
          // Upstream prompt only exposes two options — vscode covers
          // VSCode/Cursor/Windsurf/CodeBuddy/Antigravity/Bob/Kiro/Trae/Void which
          // all share `.vscode/settings.json`. Zed is its own.
          return navigableMultiselect<UltraciteEditor>({
            message: "Which editors do you want to configure (recommended)?",
            required: false,
            options: [
              { value: "vscode", label: "VSCode / Cursor / Windsurf" },
              { value: "zed", label: "Zed" },
            ],
            initialValues: editors ?? [...DEFAULT_EDITORS],
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
            initialValues: agents ?? [...DEFAULT_AGENTS],
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
            initialValues: hooks ?? [...DEFAULT_HOOKS],
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

  s.stop("Ultracite setup successfully!");
  return Result.ok(undefined);
}
