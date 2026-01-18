import { autocompleteMultiselect, isCancel, log, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { getPackageExecutionArgs, getPackageExecutionCommand } from "../../utils/package-runner";

export async function setupRuler(
  config: ProjectConfig,
): Promise<Result<void, AddonSetupError | UserCancelledError>> {
  const { packageManager, projectDir } = config;

  log.info("Setting up Ruler...");

  const rulerDir = path.join(projectDir, ".ruler");

  if (!(await fs.pathExists(rulerDir))) {
    log.error(
      pc.red(
        "Ruler template directory not found. Please ensure ruler addon is properly installed.",
      ),
    );
    return Result.ok(undefined);
  }

  const EDITORS = {
    agentsmd: { label: "Agents.md" },
    aider: { label: "Aider" },
    amazonqcli: { label: "Amazon Q CLI" },
    amp: { label: "AMP" },
    antigravity: { label: "Antigravity" },
    augmentcode: { label: "AugmentCode" },
    claude: { label: "Claude Code" },
    cline: { label: "Cline" },
    codex: { label: "OpenAI Codex CLI" },
    copilot: { label: "GitHub Copilot" },
    crush: { label: "Crush" },
    cursor: { label: "Cursor" },
    firebase: { label: "Firebase Studio" },
    firebender: { label: "Firebender" },
    "gemini-cli": { label: "Gemini CLI" },
    goose: { label: "Goose" },
    jules: { label: "Jules" },
    junie: { label: "Junie" },
    kilocode: { label: "Kilo Code" },
    kiro: { label: "Kiro" },
    mistral: { label: "Mistral" },
    opencode: { label: "OpenCode" },
    openhands: { label: "Open Hands" },
    qwen: { label: "Qwen" },
    roo: { label: "RooCode" },
    trae: { label: "Trae AI" },
    warp: { label: "Warp" },
    windsurf: { label: "Windsurf" },
    zed: { label: "Zed" },
  } as const;

  const selectedEditors = await autocompleteMultiselect({
    message: "Select AI assistants for Ruler",
    options: Object.entries(EDITORS).map(([key, v]) => ({
      value: key,
      label: v.label,
    })),
    required: false,
  });

  if (isCancel(selectedEditors)) {
    return userCancelled("Operation cancelled");
  }

  if (selectedEditors.length === 0) {
    log.info("No AI assistants selected. To apply rules later, run:");
    log.info(
      pc.cyan(
        `${getPackageExecutionCommand(packageManager, "@intellectronica/ruler@latest apply --local-only")}`,
      ),
    );
    return Result.ok(undefined);
  }

  const configFile = path.join(rulerDir, "ruler.toml");
  const currentConfig = await fs.readFile(configFile, "utf-8");

  let updatedConfig = currentConfig;

  const defaultAgentsLine = `default_agents = [${selectedEditors.map((editor) => `"${editor}"`).join(", ")}]`;
  updatedConfig = updatedConfig.replace(/default_agents = \[\]/, defaultAgentsLine);

  await fs.writeFile(configFile, updatedConfig);

  await addRulerScriptToPackageJson(projectDir, packageManager);

  const s = spinner();
  s.start("Applying rules with Ruler...");

  const applyResult = await Result.tryPromise({
    try: async () => {
      const rulerApplyArgs = getPackageExecutionArgs(
        packageManager,
        `@intellectronica/ruler@latest apply --agents ${selectedEditors.join(",")} --local-only`,
      );
      await $({ cwd: projectDir, env: { CI: "true" } })`${rulerApplyArgs}`;
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "ruler",
        message: `Failed to apply rules: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (applyResult.isErr()) {
    s.stop(pc.red("Failed to apply rules"));
    return applyResult;
  }

  s.stop("Applied rules with Ruler");
  return Result.ok(undefined);
}

async function addRulerScriptToPackageJson(
  projectDir: string,
  packageManager: ProjectConfig["packageManager"],
) {
  const rootPackageJsonPath = path.join(projectDir, "package.json");

  if (!(await fs.pathExists(rootPackageJsonPath))) {
    log.warn("Root package.json not found, skipping ruler:apply script addition");
    return;
  }

  const packageJson = await fs.readJson(rootPackageJsonPath);

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  const rulerApplyCommand = getPackageExecutionCommand(
    packageManager,
    "@intellectronica/ruler@latest apply --local-only",
  );
  packageJson.scripts["ruler:apply"] = rulerApplyCommand;

  await fs.writeJson(rootPackageJsonPath, packageJson, { spaces: 2 });
}
