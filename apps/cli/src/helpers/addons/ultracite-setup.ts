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
	| "goose"
	| "roo-code";

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
	"roo-code": {
		label: "Roo Code",
	},
} as const;

function getFrameworksFromFrontend(frontend: string[]): string[] {
	const frameworkMap: Record<string, string> = {
		"tanstack-router": "react",
		"react-router": "react",
		"tanstack-start": "react",
		next: "next",
		nuxt: "vue",
		"native-nativewind": "react",
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

export async function setupUltracite(config: ProjectConfig, hasHusky: boolean) {
	const { packageManager, projectDir, frontend } = config;

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
