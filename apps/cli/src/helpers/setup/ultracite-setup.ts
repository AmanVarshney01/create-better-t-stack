import { cancel, isCancel, log, multiselect } from "@clack/prompts";
import { execa } from "execa";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { setupBiome } from "./addons-setup";

type UltraciteEditor = "vscode" | "zed";
type UltraciteRule =
	| "vscode-copilot"
	| "cursor"
	| "windsurf"
	| "zed"
	| "claude"
	| "codex";

const EDITORS = {
	vscode: {
		label: "VSCode / Cursor / Windsurf",
		hint: "Visual Studio Code editor configuration",
	},
	zed: {
		label: "Zed",
		hint: "Zed editor configuration",
	},
} as const;

const RULES = {
	"vscode-copilot": {
		label: "VS Code Copilot",
		hint: "GitHub Copilot integration for VS Code",
	},
	cursor: {
		label: "Cursor",
		hint: "Cursor AI editor configuration",
	},
	windsurf: {
		label: "Windsurf",
		hint: "Windsurf editor configuration",
	},
	zed: {
		label: "Zed",
		hint: "Zed editor rules",
	},
	claude: {
		label: "Claude",
		hint: "Claude AI integration",
	},
	codex: {
		label: "Codex",
		hint: "Codex AI integration",
	},
} as const;

export async function setupUltracite(config: ProjectConfig, hasHusky: boolean) {
	const { packageManager, projectDir } = config;

	try {
		log.info("Setting up Ultracite...");

		await setupBiome(projectDir);

		const editors = await multiselect<UltraciteEditor>({
			message: "Choose editors",
			options: Object.entries(EDITORS).map(([key, editor]) => ({
				value: key as UltraciteEditor,
				label: editor.label,
				hint: editor.hint,
			})),
			required: false,
		});

		if (isCancel(editors)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		const rules = await multiselect<UltraciteRule>({
			message: "Choose rules",
			options: Object.entries(RULES).map(([key, rule]) => ({
				value: key as UltraciteRule,
				label: rule.label,
				hint: rule.hint,
			})),
			required: false,
		});

		if (isCancel(rules)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		const ultraciteArgs = ["init", "--pm", packageManager];

		if (editors.length > 0) {
			ultraciteArgs.push("--editors", ...editors);
		}

		if (rules.length > 0) {
			ultraciteArgs.push("--rules", ...rules);
		}

		if (hasHusky) {
			ultraciteArgs.push("--features", "husky", "lint-staged");
		}

		const ultraciteArgsString = ultraciteArgs.join(" ");
		const commandWithArgs = `ultracite@latest ${ultraciteArgsString} --skip-install`;

		const ultraciteInitCommand = getPackageExecutionCommand(
			packageManager,
			commandWithArgs,
		);

		await execa(ultraciteInitCommand, {
			cwd: projectDir,
			env: { CI: "true" },
			shell: true,
		});

		if (hasHusky) {
			await addPackageDependency({
				devDependencies: ["husky", "lint-staged"],
				projectDir,
			});
		}

		await addPackageDependency({
			devDependencies: ["ultracite"],
			projectDir,
		});

		log.success("Ultracite setup successfully!");
	} catch (error) {
		log.error(pc.red("Failed to set up Ultracite"));
		if (error instanceof Error) {
			console.error(pc.red(error.message));
		}
	}
}
