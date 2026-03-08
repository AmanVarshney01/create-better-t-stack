import path from "node:path";

import { isCancel, select } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";

import type { ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

type FumadocsTemplate =
  | "next-mdx"
  | "next-mdx-static"
  | "waku"
  | "react-router"
  | "react-router-spa"
  | "tanstack-start"
  | "tanstack-start-spa";

const TEMPLATES = {
  "next-mdx": {
    label: "Next.js: Fumadocs MDX",
    hint: "Recommended template with MDX support",
    value: "+next+fuma-docs-mdx",
  },
  "next-mdx-static": {
    label: "Next.js: Fumadocs MDX (Static)",
    hint: "Static export template with MDX support",
    value: "+next+fuma-docs-mdx+static",
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
  "tanstack-start-spa": {
    label: "Tanstack Start: SPA",
    hint: "Template for Tanstack Start SPA",
    value: "tanstack-start-spa",
  },
} as const;

const DEFAULT_TEMPLATE: FumadocsTemplate = "next-mdx";
const DEFAULT_DEV_PORT = 4000;

export async function setupFumadocs(
  config: ProjectConfig,
): Promise<Result<void, AddonSetupError | UserCancelledError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;

  cliLog.info("Setting up Fumadocs...");

  const configuredOptions = config.addonOptions?.fumadocs;
  let template = configuredOptions?.template;

  if (!template) {
    if (isSilent()) {
      template = DEFAULT_TEMPLATE;
    } else {
      const selectedTemplate = await select<FumadocsTemplate>({
        message: "Choose a template",
        options: Object.entries(TEMPLATES).map(([key, templateOption]) => ({
          value: key as FumadocsTemplate,
          label: templateOption.label,
          hint: templateOption.hint,
        })),
        initialValue: DEFAULT_TEMPLATE,
      });

      if (isCancel(selectedTemplate)) {
        return userCancelled("Operation cancelled");
      }

      template = selectedTemplate;
    }
  }

  const templateArg = TEMPLATES[template].value;
  const isNextTemplate = template.startsWith("next-");
  const devPort = configuredOptions?.devPort ?? DEFAULT_DEV_PORT;

  // Build command with options
  const options: string[] = [`--template ${templateArg}`, `--pm ${packageManager}`, "--no-git"];

  // Add --src only for Next.js templates
  if (isNextTemplate) {
    options.push("--src");
  }

  // Use biome if the addon is enabled
  if (config.addons.includes("biome")) {
    options.push("--linter biome");
  }

  const commandWithArgs = `create-fumadocs-app@latest fumadocs ${options.join(" ")}`;
  const args = getPackageExecutionArgs(packageManager, commandWithArgs);

  const appsDir = path.join(projectDir, "apps");
  await fs.ensureDir(appsDir);

  const s = createSpinner();
  s.start("Running Fumadocs create command...");

  const result = await Result.tryPromise({
    try: async () => {
      await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;

      const fumadocsDir = path.join(projectDir, "apps", "fumadocs");
      const packageJsonPath = path.join(fumadocsDir, "package.json");

      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = "fumadocs";

        if (packageJson.scripts?.dev) {
          packageJson.scripts.dev = `${packageJson.scripts.dev} --port=${devPort}`;
        }

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "fumadocs",
        message: `Failed to set up Fumadocs: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (result.isErr()) {
    s.stop("Failed to set up Fumadocs");
    return result;
  }

  s.stop("Fumadocs setup complete!");
  return Result.ok(undefined);
}
