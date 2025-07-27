import path from "node:path";
import { cancel, isCancel, log, select } from "@clack/prompts";
import consola from "consola";
import { execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";

type FumadocsTemplate =
	| "next-mdx"
	| "next-content-collections"
	| "react-router-mdx-remote"
	| "tanstack-start-mdx-remote";

const TEMPLATES = {
	"next-mdx": {
		label: "Next.js: Fumadocs MDX",
		hint: "Recommended template with MDX support",
		value: "+next+fuma-docs-mdx",
	},
	"next-content-collections": {
		label: "Next.js: Content Collections",
		hint: "Template using Next.js content collections",
		value: "+next+content-collections",
	},
	"react-router-mdx-remote": {
		label: "React Router: MDX Remote",
		hint: "Template for React Router with MDX remote",
		value: "react-router",
	},
	"tanstack-start-mdx-remote": {
		label: "Tanstack Start: MDX Remote",
		hint: "Template for Tanstack Start with MDX remote",
		value: "tanstack-start",
	},
} as const;

export async function setupFumadocs(config: ProjectConfig) {
	const { packageManager, projectDir } = config;

	try {
		log.info("Setting up Fumadocs...");

		const template = await select<FumadocsTemplate>({
			message: "Choose a template",
			options: Object.entries(TEMPLATES).map(([key, template]) => ({
				value: key as FumadocsTemplate,
				label: template.label,
				hint: template.hint,
			})),
			initialValue: "next-mdx",
		});

		if (isCancel(template)) {
			cancel(pc.red("Operation cancelled"));
			process.exit(0);
		}

		const templateArg = TEMPLATES[template].value;

		const commandWithArgs = `create-fumadocs-app@latest fumadocs --template ${templateArg} --src --no-install --pm ${packageManager} --no-eslint`;

		const fumadocsInitCommand = getPackageExecutionCommand(
			packageManager,
			commandWithArgs,
		);

		await execa(fumadocsInitCommand, {
			cwd: path.join(projectDir, "apps"),
			env: { CI: "true" },
			shell: true,
		});

		const fumadocsDir = path.join(projectDir, "apps", "fumadocs");
		const packageJsonPath = path.join(fumadocsDir, "package.json");

		if (await fs.pathExists(packageJsonPath)) {
			const packageJson = await fs.readJson(packageJsonPath);
			packageJson.name = "fumadocs";

			if (packageJson.scripts?.dev) {
				packageJson.scripts.dev = `${packageJson.scripts.dev} --port=4000`;
			}

			await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
		}

		log.success("Fumadocs setup successfully!");
	} catch (error) {
		log.error(pc.red("Failed to set up Fumadocs"));
		if (error instanceof Error) {
			consola.error(pc.red(error.message));
		}
	}
}
