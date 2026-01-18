import { isCancel, log, select, spinner } from "@clack/prompts";
import consola from "consola";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { UserCancelledError } from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type FumadocsTemplate =
  | "next-mdx"
  | "waku"
  | "react-router"
  | "react-router-spa"
  | "tanstack-start";

const TEMPLATES = {
  "next-mdx": {
    label: "Next.js: Fumadocs MDX",
    hint: "Recommended template with MDX support",
    value: "+next+fuma-docs-mdx",
  },
  waku: {
    label: "Waku: Content Collections",
    hint: "Template using Waku with content collections",
    value: "waku",
  },
  "react-router": {
    label: "React Router: MDX Remote",
    hint: "Template for React Router with MDX remote",
    value: "react-router",
  },
  "react-router-spa": {
    label: "React Router: SPA",
    hint: "Template for React Router SPA",
    value: "react-router-spa",
  },
  "tanstack-start": {
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

    if (isCancel(template)) throw new UserCancelledError({ message: "Operation cancelled" });

    const templateArg = TEMPLATES[template].value;

    const commandWithArgs = `create-fumadocs-app@latest fumadocs --template ${templateArg} --src --pm ${packageManager} --no-git`;
    const args = getPackageExecutionArgs(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    const s = spinner();
    s.start("Running Fumadocs create command...");

    await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;

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

    s.stop("Fumadocs setup complete!");
  } catch (error) {
    log.error(pc.red("Failed to set up Fumadocs"));
    if (error instanceof Error) {
      consola.error(pc.red(error.message));
    }
  }
}
