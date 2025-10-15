import path from "node:path";
import {
	autocompleteMultiselect,
	isCancel,
	log,
	spinner,
} from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { exitCancelled } from "../../utils/errors";
import { getPackageExecutionCommand } from "../../utils/package-runner";

export async function setupRuler(config: ProjectConfig) {
	const { packageManager, projectDir } = config;

	try {
		log.info("Setting up Ruler...");

		const rulerDir = path.join(projectDir, ".ruler");

		if (!(await fs.pathExists(rulerDir))) {
			log.error(
				pc.red(
					"Ruler template directory not found. Please ensure ruler addon is properly installed.",
				),
			);
			return;
		}

		const EDITORS = {
			amp: { label: "AMP" },
			copilot: { label: "GitHub Copilot" },
			claude: { label: "Claude Code" },
			codex: { label: "OpenAI Codex CLI" },
			cursor: { label: "Cursor" },
			windsurf: { label: "Windsurf" },
			cline: { label: "Cline" },
			aider: { label: "Aider" },
			firebase: { label: "Firebase Studio" },
			"gemini-cli": { label: "Gemini CLI" },
			junie: { label: "Junie" },
			kilocode: { label: "Kilo Code" },
			opencode: { label: "OpenCode" },
			crush: { label: "Crush" },
			zed: { label: "Zed" },
			qwen: { label: "Qwen" },
			amazonqcli: { label: "Amazon Q CLI" },
			augmentcode: { label: "AugmentCode" },
			firebender: { label: "Firebender" },
			goose: { label: "Goose" },
			jules: { label: "Jules" },
			kiro: { label: "Kiro" },
			openhands: { label: "Open Hands" },
			roo: { label: "RooCode" },
			trae: { label: "Trae AI" },
			warp: { label: "Warp" },
		} as const;

		const selectedEditors = await autocompleteMultiselect({
			message: "Select AI assistants for Ruler",
			options: Object.entries(EDITORS).map(([key, v]) => ({
				value: key,
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
