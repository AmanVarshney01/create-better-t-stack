import { $ } from "bun";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { setupBiome } from "./addons-setup";
import { log } from "../../utils/logger";

type UltraciteEditor = "vscode" | "zed";
type UltraciteAgent =
  | "vscode-copilot"
  | "cursor"
  | "windsurf"
  | "zed"
  | "claude"
  | "codex"
  | "kiro"
  | "cline"
  | "amp"
  | "aider"
  | "firebase-studio"
  | "open-hands"
  | "gemini-cli"
  | "junie"
  | "augmentcode"
  | "kilo-code"
  | "goose"
  | "roo-code";

type UltraciteHook = "cursor" | "claude";

export type UltraciteOptions = {
  editors?: UltraciteEditor[];
  agents?: UltraciteAgent[];
  hooks?: UltraciteHook[];
};

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
  hasHusky: boolean,
  options: UltraciteOptions = {},
) {
  const { packageManager, projectDir, frontend } = config;

  // Use defaults if not provided
  const editors = options.editors ?? ["vscode"];
  const agents = options.agents ?? ["cursor", "claude"];
  const hooks = options.hooks ?? [];

  try {
    log.info("Setting up Ultracite...");

    await setupBiome(projectDir);

    const frameworks = getFrameworksFromFrontend(frontend);

    const ultraciteArgs = ["init", "--pm", packageManager];

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

    if (hasHusky) {
      ultraciteArgs.push("--integrations", "husky", "lint-staged");
    }

    const ultraciteArgsString = ultraciteArgs.join(" ");
    const commandWithArgs = `ultracite@latest ${ultraciteArgsString} --skip-install`;

    const ultraciteInitCommand = getPackageExecutionCommand(packageManager, commandWithArgs);

    log.step("Running Ultracite init command...");

    await $`${{ raw: ultraciteInitCommand }}`.cwd(projectDir).env({ CI: "true" });

    if (hasHusky) {
      await addPackageDependency({
        devDependencies: ["husky", "lint-staged"],
        projectDir,
      });
    }

    log.success("Ultracite setup successfully!");
  } catch (error) {
    log.error("Failed to set up Ultracite");
    if (error instanceof Error) {
      console.error(pc.red(error.message));
    }
  }
}
