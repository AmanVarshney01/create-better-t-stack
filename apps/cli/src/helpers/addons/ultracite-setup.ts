import { group, multiselect, select } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

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
  | "antigravity"
  | "kiro"
  | "trae"
  | "void"
  | "zed";

type UltraciteAgent =
  | "claude"
  | "codex"
  | "jules"
  | "copilot"
  | "cline"
  | "amp"
  | "aider"
  | "firebase-studio"
  | "open-hands"
  | "gemini"
  | "junie"
  | "augmentcode"
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

type UltraciteHook = "cursor" | "windsurf" | "claude";

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
  biome: { label: "Biome", hint: "Fast formatter and linter" },
  eslint: { label: "ESLint", hint: "Traditional JavaScript linter" },
  oxlint: { label: "Oxlint", hint: "Oxidation compiler linter" },
} as const;

const EDITORS = {
  vscode: { label: "VS Code" },
  cursor: { label: "Cursor" },
  windsurf: { label: "Windsurf" },
  antigravity: { label: "Antigravity" },
  kiro: { label: "Kiro" },
  trae: { label: "Trae" },
  void: { label: "Void" },
  zed: { label: "Zed" },
} as const;

const AGENTS = {
  claude: { label: "Claude" },
  codex: { label: "Codex" },
  jules: { label: "Jules" },
  copilot: { label: "GitHub Copilot" },
  cline: { label: "Cline" },
  amp: { label: "Amp" },
  aider: { label: "Aider" },
  "firebase-studio": { label: "Firebase Studio" },
  "open-hands": { label: "Open Hands" },
  gemini: { label: "Gemini" },
  junie: { label: "Junie" },
  augmentcode: { label: "AugmentCode" },
  "kilo-code": { label: "Kilo Code" },
  goose: { label: "Goose" },
  "roo-code": { label: "Roo Code" },
  warp: { label: "Warp" },
  droid: { label: "Droid" },
  opencode: { label: "OpenCode" },
  crush: { label: "Crush" },
  qwen: { label: "Qwen" },
  "amazon-q-cli": { label: "Amazon Q CLI" },
  firebender: { label: "Firebender" },
  "cursor-cli": { label: "Cursor CLI" },
  "mistral-vibe": { label: "Mistral Vibe" },
  vercel: { label: "Vercel" },
} as const;

const HOOKS = {
  cursor: { label: "Cursor" },
  windsurf: { label: "Windsurf" },
  claude: { label: "Claude" },
} as const;

const DEFAULT_LINTER: UltraciteLinter = "biome";
const DEFAULT_EDITORS: UltraciteEditor[] = ["vscode", "cursor"];
const DEFAULT_AGENTS: UltraciteAgent[] = ["claude", "codex"];
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
    const integrations = gitHooks.includes("husky")
      ? [...new Set([...gitHooks, "lint-staged"])]
      : gitHooks;
    ultraciteArgs.push("--integrations", ...integrations);
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
      const groupResult = await Result.tryPromise({
        try: async () => {
          return await group(
            {
              linter: () =>
                select<UltraciteLinter>({
                  message: "Choose linter/formatter",
                  options: Object.entries(LINTERS).map(([key, linterOption]) => ({
                    value: key as UltraciteLinter,
                    label: linterOption.label,
                    hint: linterOption.hint,
                  })),
                  initialValue: linter ?? DEFAULT_LINTER,
                }),
              editors: () =>
                multiselect<UltraciteEditor>({
                  message: "Choose editors",
                  required: false,
                  options: Object.entries(EDITORS).map(([key, editor]) => ({
                    value: key as UltraciteEditor,
                    label: editor.label,
                  })),
                  initialValues: editors ?? [...DEFAULT_EDITORS],
                }),
              agents: () =>
                multiselect<UltraciteAgent>({
                  message: "Choose agents",
                  required: false,
                  options: Object.entries(AGENTS).map(([key, agent]) => ({
                    value: key as UltraciteAgent,
                    label: agent.label,
                  })),
                  initialValues: agents ?? [...DEFAULT_AGENTS],
                }),
              hooks: () =>
                multiselect<UltraciteHook>({
                  message: "Choose hooks",
                  required: false,
                  options: Object.entries(HOOKS).map(([key, hook]) => ({
                    value: key as UltraciteHook,
                    label: hook.label,
                  })),
                  initialValues: hooks ?? [...DEFAULT_HOOKS],
                }),
            },
            {
              onCancel: () => {
                throw new UserCancelledError({ message: "Operation cancelled" });
              },
            },
          );
        },
        catch: (e) => {
          if (e instanceof UserCancelledError) return e;
          return new AddonSetupError({
            addon: "ultracite",
            message: `Failed to get user preferences: ${e instanceof Error ? e.message : String(e)}`,
            cause: e,
          });
        },
      });

      if (groupResult.isErr()) {
        if (UserCancelledError.is(groupResult.error)) {
          return userCancelled(groupResult.error.message);
        }
        cliLog.error(pc.red("Failed to set up Ultracite"));
        return groupResult;
      }

      linter = groupResult.value.linter as UltraciteLinter;
      editors = groupResult.value.editors as UltraciteEditor[];
      agents = groupResult.value.agents as UltraciteAgent[];
      hooks = groupResult.value.hooks as UltraciteHook[];
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
