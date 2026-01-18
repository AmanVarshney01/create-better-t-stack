import { isCancel, log, select, spinner } from "@clack/prompts";
import { $ } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { UserCancelledError } from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type TuiTemplate = "core" | "react" | "solid";

const TEMPLATES = {
  core: {
    label: "Core",
    hint: "Basic OpenTUI template",
  },
  react: {
    label: "React",
    hint: "React-based OpenTUI template",
  },
  solid: {
    label: "Solid",
    hint: "SolidJS-based OpenTUI template",
  },
} as const;

export async function setupTui(config: ProjectConfig) {
  const { packageManager, projectDir } = config;

  try {
    log.info("Setting up OpenTUI...");

    const template = await select<TuiTemplate>({
      message: "Choose a template",
      options: Object.entries(TEMPLATES).map(([key, template]) => ({
        value: key as TuiTemplate,
        label: template.label,
        hint: template.hint,
      })),
      initialValue: "core",
    });

    if (isCancel(template)) throw new UserCancelledError({ message: "Operation cancelled" });

    const commandWithArgs = `create-tui@latest --template ${template} --no-git --no-install tui`;
    const args = getPackageExecutionArgs(packageManager, commandWithArgs);

    const appsDir = path.join(projectDir, "apps");
    await fs.ensureDir(appsDir);

    const s = spinner();
    s.start("Running OpenTUI create command...");

    await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;

    s.stop("OpenTUI setup complete!");
  } catch (error) {
    log.error(pc.red("Failed to set up OpenTUI"));
    if (error instanceof Error) {
      console.error(pc.red(error.message));
    }
  }
}
