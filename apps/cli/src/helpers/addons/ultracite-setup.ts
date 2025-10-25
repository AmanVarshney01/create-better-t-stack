import {
	autocompleteMultiselect,
	group,
	log,
	multiselect,
	spinner,
} from "@clack/prompts";
import { execa } from "execa";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { addPackageDependency } from "../../utils/add-package-deps";
import { exitCancelled } from "../../utils/errors";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { setupBiome } from "./addons-setup";

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
	| "goose";

const EDITORS = {
	vscode: {
		label: "VSCode / Cursor / Windsurf",
	},
	zed: {
		label: "Zed",
	},
} as const;

const AGENTS = {
	"vscode-copilot": {
		label: "VS Code Copilot",
	},
	cursor: {
		label: "Cursor",
	},
	windsurf: {
		label: "Windsurf",
	},
	zed: {
		label: "Zed",
	},
	claude: {
		label: "Claude",
	},
	codex: {
		label: "Codex",
	},
	kiro: {
		label: "Kiro",
	},
	cline: {
		label: "Cline",
	},
	amp: {
		label: "Amp",
	},
	aider: {
		label: "Aider",
	},
	"firebase-studio": {
		label: "Firebase Studio",
	},
	"open-hands": {
		label: "Open Hands",
	},
	"gemini-cli": {
		label: "Gemini CLI",
	},
	junie: {
		label: "Junie",
	},
	augmentcode: {
		label: "AugmentCode",
	},
	"kilo-code": {
		label: "Kilo Code",
	},
	goose: {
		label: "Goose",
	},
} as const;

export async function setupUltracite(config: ProjectConfig, hasHusky: boolean) {
	const { packageManager, projectDir } = config;

	try {
		log.info("Setting up Ultracite...");

		await setupBiome(projectDir);

		const result = await group(
			{
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
					autocompleteMultiselect<UltraciteAgent>({
						message: "Choose agents",
						options: Object.entries(AGENTS).map(([key, agent]) => ({
							value: key as UltraciteAgent,
							label: agent.label,
						})),
						required: true,
					}),
			},
			{
				onCancel: () => {
					exitCancelled("Operation cancelled");
				},
			},
		);

		const editors = result.editors as UltraciteEditor[];
		const agents = result.agents as UltraciteAgent[];

		const ultraciteArgs = ["init", "--pm", packageManager, "--frameworks", "react,next"];

		if (editors.length > 0) {
			ultraciteArgs.push("--editors", ...editors);
		}

		if (agents.length > 0) {
			ultraciteArgs.push("--agents", ...agents);
		}

		if (hasHusky) {
			ultraciteArgs.push("--integrations", "husky", "lint-staged");
		}

		const ultraciteArgsString = ultraciteArgs.join(" ");
		const commandWithArgs = `ultracite@latest ${ultraciteArgsString} --skip-install`;

		const ultraciteInitCommand = getPackageExecutionCommand(
			packageManager,
			commandWithArgs,
		);

		const s = spinner();
		s.start("Setting up Ultracite...");

		await execa(ultraciteInitCommand, {
			cwd: projectDir,
			env: { CI: "true" },
			shell: true,
		});

		s.stop("Ultracite setup complete!");

		if (hasHusky) {
			await addPackageDependency({
				devDependencies: ["husky", "lint-staged"],
				projectDir,
			});
		}

		log.success("Ultracite setup successfully!");
	} catch (error) {
		log.error(pc.red("Failed to set up Ultracite"));
		if (error instanceof Error) {
			console.error(pc.red(error.message));
		}
	}
}
