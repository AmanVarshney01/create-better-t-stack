import path from "node:path";
import { isCancel, log, multiselect, spinner } from "@clack/prompts";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { PKG_ROOT } from "../../constants";
import type { ProjectConfig } from "../../types";
import { exitCancelled } from "../../utils/errors";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { processTemplate } from "../../utils/template-processor";

export async function setupVibeRules(config: ProjectConfig) {
	const { packageManager, projectDir } = config;

	try {
		log.info("Setting up vibe-rules...");

		const rulesDir = path.join(projectDir, ".bts");
		const ruleFile = path.join(rulesDir, "rules.md");
		if (!(await fs.pathExists(ruleFile))) {
			const templatePath = path.join(
				PKG_ROOT,
				"templates",
				"addons",
				"vibe-rules",
				".bts",
				"rules.md.hbs",
			);
			if (await fs.pathExists(templatePath)) {
				await fs.ensureDir(rulesDir);
				await processTemplate(templatePath, ruleFile, config);
			} else {
				log.error(pc.red("Rules template not found for vibe-rules addon"));
				return;
			}
		}

		const EDITORS = {
			cursor: { label: "Cursor", hint: ".cursor/rules/*.mdc" },
			windsurf: { label: "Windsurf", hint: ".windsurfrules" },
			"claude-code": { label: "Claude Code", hint: "CLAUDE.md" },
			vscode: {
				label: "VSCode",
				hint: ".github/instructions/*.instructions.md",
			},
			gemini: { label: "Gemini", hint: "GEMINI.md" },
			codex: { label: "Codex", hint: "AGENTS.md" },
			clinerules: { label: "Cline/Roo", hint: ".clinerules/*.md" },
			roo: { label: "Roo", hint: ".clinerules/*.md" },
			zed: { label: "Zed", hint: ".rules/*.md" },
			unified: { label: "Unified", hint: ".rules/*.md" },
		} as const;

		const selectedEditors = await multiselect<keyof typeof EDITORS>({
			message: "Choose editors to install BTS rule",
			options: Object.entries(EDITORS).map(([key, v]) => ({
				value: key as keyof typeof EDITORS,
				label: v.label,
				hint: v.hint,
			})),
			required: false,
		});

		if (isCancel(selectedEditors)) return exitCancelled("Operation cancelled");

		const editorsArg = selectedEditors.join(", ");
		const s = spinner();
		s.start("Saving and applying BTS rules...");

		try {
			const saveCmd = getPackageExecutionCommand(
				packageManager,
				`vibe-rules@latest save bts -f ${JSON.stringify(
					path.relative(projectDir, ruleFile),
				)}`,
			);
			await execa(saveCmd, {
				cwd: projectDir,
				env: { CI: "true" },
				shell: true,
			});

			for (const editor of selectedEditors) {
				const loadCmd = getPackageExecutionCommand(
					packageManager,
					`vibe-rules@latest load bts ${editor}`,
				);
				await execa(loadCmd, {
					cwd: projectDir,
					env: { CI: "true" },
					shell: true,
				});
			}

			s.stop(`Applied BTS rules to: ${editorsArg}`);
		} catch (error) {
			s.stop(pc.red("Failed to apply BTS rules"));
			throw error;
		}

		try {
			await fs.remove(rulesDir);
		} catch (_) {}

		log.success("vibe-rules setup successfully!");
	} catch (error) {
		log.error(pc.red("Failed to set up vibe-rules"));
		if (error instanceof Error) {
			console.error(pc.red(error.message));
		}
	}
}
