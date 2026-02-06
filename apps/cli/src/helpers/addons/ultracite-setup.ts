import { group, log, multiselect, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";

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

export async function setupUltracite(
  config: ProjectConfig,
  gitHooks: string[],
): Promise<UltraciteSetupResult> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir, frontend } = config;

  log.info("Setting up Ultracite...");

  let result: {
    linter: UltraciteLinter | symbol;
    editors: UltraciteEditor[] | symbol;
    agents: UltraciteAgent[] | symbol;
    hooks: UltraciteHook[] | symbol;
  };

  const groupResult = await Result.tryPromise({
    try: async () => {
      return await group(
        {
          linter: () =>
            select<UltraciteLinter>({
              message: "Choose linter/formatter",
              options: Object.entries(LINTERS).map(([key, linter]) => ({
                value: key as UltraciteLinter,
                label: linter.label,
                hint: linter.hint,
              })),
              initialValue: "biome" as UltraciteLinter,
            }),
          editors: () =>
            multiselect<UltraciteEditor>({
              message: "Choose editors",
              options: Object.entries(EDITORS).map(([key, editor]) => ({
                value: key as UltraciteEditor,
                label: editor.label,
              })),
              required: true,
            }),
          agents: () =>
            multiselect<UltraciteAgent>({
              message: "Choose agents",
              options: Object.entries(AGENTS).map(([key, agent]) => ({
                value: key as UltraciteAgent,
                label: agent.label,
              })),
              required: true,
            }),
          hooks: () =>
            multiselect<UltraciteHook>({
              message: "Choose hooks",
              options: Object.entries(HOOKS).map(([key, hook]) => ({
                value: key as UltraciteHook,
                label: hook.label,
              })),
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
    log.error(pc.red("Failed to set up Ultracite"));
    return groupResult;
  }

  result = groupResult.value;

  const linter = result.linter as UltraciteLinter;
  const editors = result.editors as UltraciteEditor[];
  const agents = result.agents as UltraciteAgent[];
  const hooks = result.hooks as UltraciteHook[];
  const frameworks = getFrameworksFromFrontend(frontend);

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
    const integrations = [...gitHooks];
    if (gitHooks.includes("husky")) {
      integrations.push("lint-staged");
    }
    ultraciteArgs.push("--integrations", ...integrations);
  }

  const ultraciteArgsString = ultraciteArgs.join(" ");
  const commandWithArgs = `ultracite@latest ${ultraciteArgsString} --skip-install`;
  const args = getPackageExecutionArgs(packageManager, commandWithArgs);

  const s = spinner();
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
    log.error(pc.red("Failed to set up Ultracite"));
    return initResult;
  }

  s.stop("Ultracite setup successfully!");
  return Result.ok(undefined);
}
