#!/usr/bin/env bun
/**
 * CLI entry point with TUI support
 * Replaces the old clack-prompts based CLI with OpenTUI
 */
import { Command } from "commander";
import { renderTui } from "./tui/app";
import { create, type CreateOptions } from "./api";
import { createProject } from "./helpers/core/create-project";
import { getDefaultConfig } from "./constants";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import path from "node:path";
import type {
  PackageManager,
  Database,
  ORM,
  Backend,
  Runtime,
  Frontend,
  Addons,
  Examples,
  DatabaseSetup,
  API,
  WebDeploy,
  ServerDeploy,
  DirectoryConflict,
  Template,
  Auth,
  Payments,
  ProjectConfig,
} from "./types";

const program = new Command();

program
  .name("create-better-t-stack")
  .description("Create a new Better-T-Stack project")
  .version(getLatestCLIVersion())
  .argument("[project-name]", "Name of the project")
  .option("-t, --template <template>", "Use a predefined template")
  .option("-y, --yes", "Use default configuration (skip TUI)", false)
  .option("--yolo", "(WARNING) Bypass validations and compatibility checks", false)
  .option("--verbose", "Show detailed result information", false)
  .option("--database <database>", "Database to use")
  .option("--orm <orm>", "ORM to use")
  .option("--auth <auth>", "Authentication provider")
  .option("--payments <payments>", "Payments provider")
  .option("--frontend <frontend...>", "Frontend framework(s)")
  .option("--addons <addons...>", "Addons to include")
  .option("--examples <examples...>", "Examples to include")
  .option("--git", "Initialize git repository")
  .option("--no-git", "Skip git initialization")
  .option("--package-manager <pm>", "Package manager to use")
  .option("--install", "Install dependencies")
  .option("--no-install", "Skip dependency installation")
  .option("--db-setup <setup>", "Database setup method")
  .option("--backend <backend>", "Backend framework")
  .option("--runtime <runtime>", "Runtime to use")
  .option("--api <api>", "API framework")
  .option("--web-deploy <deploy>", "Web deployment target")
  .option("--server-deploy <deploy>", "Server deployment target")
  .option("--directory-conflict <action>", "How to handle directory conflicts")
  .option("--disable-analytics", "Disable analytics", false)
  .option("--manual-db", "Skip automatic database setup prompt", false)
  .action(async (projectName: string | undefined, options: Record<string, unknown>) => {
    try {
      // Check if we should use TUI (interactive mode)
      const useInteractive = !options.yes && process.stdin.isTTY && process.stdout.isTTY;

      if (useInteractive) {
        // Launch TUI
        await renderTui({
          initialConfig: {
            projectName,
            frontend: options.frontend as Frontend[] | undefined,
            backend: options.backend as Backend | undefined,
            runtime: options.runtime as Runtime | undefined,
            database: options.database as Database | undefined,
            orm: options.orm as ORM | undefined,
            auth: options.auth as Auth | undefined,
            payments: options.payments as Payments | undefined,
            addons: options.addons as Addons[] | undefined,
          },
          onComplete: async (config: ProjectConfig) => {
            // Create project in logs panel
            console.log("\nCreating project...\n");

            await createProject(config, {
              manualDb: options.manualDb as boolean,
            });

            const reproducibleCommand = generateReproducibleCommand(config);
            console.log(`\n✓ Project created at: ${config.projectDir}`);
            console.log(`\nReproducible command:\n${reproducibleCommand}\n`);
          },
          onCancel: () => {
            console.log("\nOperation cancelled.\n");
            process.exit(0);
          },
        });
      } else {
        // Non-interactive mode: use defaults or provided flags
        const result = await create({
          projectName,
          defaults: options.yes as boolean,
          frontend: options.frontend as Frontend[] | undefined,
          backend: options.backend as Backend | undefined,
          runtime: options.runtime as Runtime | undefined,
          database: options.database as Database | undefined,
          orm: options.orm as ORM | undefined,
          auth: options.auth as Auth | undefined,
          payments: options.payments as Payments | undefined,
          api: options.api as API | undefined,
          addons: options.addons as Addons[] | undefined,
          examples: options.examples as Examples[] | undefined,
          dbSetup: options.dbSetup as DatabaseSetup | undefined,
          webDeploy: options.webDeploy as WebDeploy | undefined,
          serverDeploy: options.serverDeploy as ServerDeploy | undefined,
          git: options.git as boolean | undefined,
          packageManager: options.packageManager as PackageManager | undefined,
          install: options.install as boolean | undefined,
        });

        if (result.success) {
          if (options.verbose) {
            console.log(JSON.stringify(result, null, 2));
          } else {
            console.log(`\n✓ Project created at: ${result.projectDirectory}`);
            console.log(`\nReproducible command:\n${result.reproducibleCommand}\n`);
          }
        } else {
          console.error(`\n✗ Failed to create project: ${result.error}\n`);
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(`\n✗ Error: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });

program
  .command("add")
  .description("Add addons or deployment configurations to an existing project")
  .option("--addons <addons...>", "Addons to add")
  .option("--web-deploy <deploy>", "Web deployment target")
  .option("--server-deploy <deploy>", "Server deployment target")
  .option("--project-dir <dir>", "Project directory")
  .option("--install", "Install dependencies after adding", false)
  .option("--package-manager <pm>", "Package manager to use")
  .action(async (options: Record<string, unknown>) => {
    // TODO: Implement add command with TUI
    console.log("Add command - TUI coming soon");
  });

program
  .command("docs")
  .description("Open Better-T-Stack documentation")
  .action(async () => {
    const { openUrl } = await import("./utils/open-url");
    const DOCS_URL = "https://better-t-stack.dev/docs";
    try {
      await openUrl(DOCS_URL);
      console.log("Opened docs in your default browser.");
    } catch {
      console.log(`Please visit ${DOCS_URL}`);
    }
  });

program
  .command("builder")
  .description("Open the web-based stack builder")
  .action(async () => {
    const { openUrl } = await import("./utils/open-url");
    const BUILDER_URL = "https://better-t-stack.dev/new";
    try {
      await openUrl(BUILDER_URL);
      console.log("Opened builder in your default browser.");
    } catch {
      console.log(`Please visit ${BUILDER_URL}`);
    }
  });

program.parse();
