import path from "node:path";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { log } from "../../utils/logger";

type RulerAgent =
  | "amp"
  | "copilot"
  | "claude"
  | "codex"
  | "cursor"
  | "windsurf"
  | "cline"
  | "aider"
  | "firebase"
  | "gemini-cli"
  | "junie"
  | "kilocode"
  | "opencode"
  | "crush"
  | "zed"
  | "qwen"
  | "amazonqcli"
  | "augmentcode"
  | "firebender"
  | "goose"
  | "jules"
  | "kiro"
  | "openhands"
  | "roo"
  | "trae"
  | "warp";

export async function setupRuler(
  config: ProjectConfig,
  agents: RulerAgent[] = ["cursor", "claude"],
) {
  const { packageManager, projectDir } = config;

  try {
    log.info("Setting up Ruler...");

    const rulerDir = path.join(projectDir, ".ruler");

    if (!(await fs.pathExists(rulerDir))) {
      log.error(
        "Ruler template directory not found. Please ensure ruler addon is properly installed.",
      );
      return;
    }

    if (agents.length === 0) {
      log.info("No AI assistants selected. To apply rules later, run:");
      log.info(
        pc.cyan(
          `${getPackageExecutionCommand(packageManager, "@intellectronica/ruler@latest apply --local-only")}`,
        ),
      );
      return;
    }

    const configFile = path.join(rulerDir, "ruler.toml");
    const currentConfig = await fs.readFile(configFile, "utf-8");

    let updatedConfig = currentConfig;

    const defaultAgentsLine = `default_agents = [${agents.map((agent) => `"${agent}"`).join(", ")}]`;
    updatedConfig = updatedConfig.replace(/default_agents = \[\]/, defaultAgentsLine);

    await fs.writeFile(configFile, updatedConfig);

    await addRulerScriptToPackageJson(projectDir, packageManager);

    log.step("Applying rules with Ruler...");

    try {
      const rulerApplyCmd = getPackageExecutionCommand(
        packageManager,
        `@intellectronica/ruler@latest apply --agents ${agents.join(",")} --local-only`,
      );
      await $`${{ raw: rulerApplyCmd }}`.cwd(projectDir).env({ CI: "true" });

      log.success("Applied rules with Ruler");
    } catch {
      log.error("Failed to apply rules");
    }
  } catch (error) {
    log.error("Failed to set up Ruler");
    if (error instanceof Error) {
      console.error(pc.red(error.message));
    }
  }
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
