import path from "node:path";
import { isCancel, log, multiselect, spinner } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { PKG_ROOT } from "../../constants";
import type { ProjectConfig } from "../../types";
import { exitCancelled } from "../../utils/errors";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { processAndCopyFiles } from "../project-generation/template-manager";

export async function setupVibeRules(config: ProjectConfig) {
	const { packageManager, projectDir } = config;

	try {
		log.info("Setting up Ruler...");

		const rulerDir = path.join(projectDir, ".ruler");
		const rulerTemplateDir = path.join(
			PKG_ROOT,
			"templates",
			"addons",
			"vibe-rules",
			".ruler",
		);

		if (!(await fs.pathExists(rulerDir))) {
			if (await fs.pathExists(rulerTemplateDir)) {
				await processAndCopyFiles("**/*", rulerTemplateDir, rulerDir, config);
			} else {
				log.error(pc.red("Ruler template directory not found"));
				return;
			}
		}

		const EDITORS = {
			cursor: {
				label: "Cursor",
			},
			windsurf: {
				label: "Windsurf",
			},
			claude: { label: "Claude Code" },
			copilot: {
				label: "GitHub Copilot",
			},
			"gemini-cli": { label: "Gemini CLI" },
			codex: { label: "OpenAI Codex CLI" },
			jules: { label: "Jules" },
			cline: { label: "Cline" },
			aider: { label: "Aider" },
			firebase: { label: "Firebase Studio" },
			openhands: { label: "Open Hands" },
			junie: { label: "Junie" },
			augmentcode: {
				label: "AugmentCode",
			},
			kilocode: {
				label: "Kilo Code",
			},
			opencode: { label: "OpenCode" },
		} as const;

		const selectedEditors = await multiselect<keyof typeof EDITORS>({
			message: "Select AI assistants for Ruler",
			options: Object.entries(EDITORS).map(([key, v]) => ({
				value: key as keyof typeof EDITORS,
				label: v.label,
			})),
			required: false,
		});

		if (isCancel(selectedEditors)) return exitCancelled("Operation cancelled");

		if (selectedEditors.length === 0) {
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

		const defaultAgentsLine = `default_agents = [${selectedEditors.map((editor) => `"${editor}"`).join(", ")}]`;
		updatedConfig = updatedConfig.replace(
			/default_agents = \[\]/,
			defaultAgentsLine,
		);

		await fs.writeFile(configFile, updatedConfig);

		await addRulerScriptToPackageJson(projectDir, packageManager);

		const s = spinner();
		s.start("Applying rules with Ruler...");

		try {
			const rulerApplyCmd = getPackageExecutionCommand(
				packageManager,
				`@intellectronica/ruler@latest apply --agents ${selectedEditors.join(",")} --local-only`,
			);
			await execa(rulerApplyCmd, {
				cwd: projectDir,
				env: { CI: "true" },
				shell: true,
			});

			s.stop("Applied rules with Ruler");
		} catch (_error) {
			s.stop(pc.red("Failed to apply rules"));
		}
	} catch (error) {
		log.error(pc.red("Failed to set up Ruler"));
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
		log.warn(
			"Root package.json not found, skipping ruler:apply script addition",
		);
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
