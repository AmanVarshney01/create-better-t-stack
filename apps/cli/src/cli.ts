#!/usr/bin/env bun
/**
 * CLI entry point using commander directly
 * Replaces trpc-cli for bun compile compatibility
 */
import { Command } from "commander";
import { intro, log } from "@clack/prompts";
import pc from "picocolors";
import { addAddonsHandler, createProjectHandler } from "./helpers/core/command-handlers";
import { handleError } from "./utils/errors";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { openUrl } from "./utils/open-url";
import { renderTitle } from "./utils/render-title";
import { displaySponsors, fetchSponsors } from "./utils/sponsors";
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
} from "./types";

const program = new Command();

program
  .name("create-better-t-stack")
  .description("Create a new Better-T-Stack project")
  .version(getLatestCLIVersion())
  .argument("[project-name]", "Name of the project")
  .option("-t, --template <template>", "Use a predefined template")
  .option("-y, --yes", "Use default configuration", false)
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
  .option("--render-title", "Render the title banner")
  .option("--no-render-title", "Skip title banner")
  .option("--disable-analytics", "Disable analytics", false)
  .option("--manual-db", "Skip automatic database setup prompt", false)
  .action(async (projectName: string | undefined, options: Record<string, unknown>) => {
    try {
      const input = {
        projectName,
        template: options.template as Template | undefined,
        yes: options.yes as boolean,
        yolo: options.yolo as boolean,
        verbose: options.verbose as boolean,
        database: options.database as Database | undefined,
        orm: options.orm as ORM | undefined,
        auth: options.auth as Auth | undefined,
        payments: options.payments as Payments | undefined,
        frontend: options.frontend as Frontend[] | undefined,
        addons: options.addons as Addons[] | undefined,
        examples: options.examples as Examples[] | undefined,
        git: options.git as boolean | undefined,
        packageManager: options.packageManager as PackageManager | undefined,
        install: options.install as boolean | undefined,
        dbSetup: options.dbSetup as DatabaseSetup | undefined,
        backend: options.backend as Backend | undefined,
        runtime: options.runtime as Runtime | undefined,
        api: options.api as API | undefined,
        webDeploy: options.webDeploy as WebDeploy | undefined,
        serverDeploy: options.serverDeploy as ServerDeploy | undefined,
        directoryConflict: options.directoryConflict as DirectoryConflict | undefined,
        renderTitle: options.renderTitle as boolean | undefined,
        disableAnalytics: options.disableAnalytics as boolean,
        manualDb: options.manualDb as boolean,
      };

      const result = await createProjectHandler(input);

      if (options.verbose && result) {
        console.log(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      handleError(error, "Failed to create project");
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
    try {
      const input = {
        addons: (options.addons as Addons[] | undefined) || [],
        webDeploy: options.webDeploy as WebDeploy | undefined,
        serverDeploy: options.serverDeploy as ServerDeploy | undefined,
        projectDir: options.projectDir as string | undefined,
        install: options.install as boolean,
        packageManager: options.packageManager as PackageManager | undefined,
      };

      await addAddonsHandler(input);
    } catch (error) {
      handleError(error, "Failed to add addons");
      process.exit(1);
    }
  });

program
  .command("sponsors")
  .description("Show Better-T-Stack sponsors")
  .action(async () => {
    try {
      renderTitle();
      intro(pc.magenta("Better-T-Stack Sponsors"));
      const sponsors = await fetchSponsors();
      displaySponsors(sponsors);
    } catch (error) {
      handleError(error, "Failed to display sponsors");
      process.exit(1);
    }
  });

program
  .command("docs")
  .description("Open Better-T-Stack documentation")
  .action(async () => {
    const DOCS_URL = "https://better-t-stack.dev/docs";
    try {
      await openUrl(DOCS_URL);
      log.success(pc.blue("Opened docs in your default browser."));
    } catch {
      log.message(`Please visit ${DOCS_URL}`);
    }
  });

program
  .command("builder")
  .description("Open the web-based stack builder")
  .action(async () => {
    const BUILDER_URL = "https://better-t-stack.dev/new";
    try {
      await openUrl(BUILDER_URL);
      log.success(pc.blue("Opened builder in your default browser."));
    } catch {
      log.message(`Please visit ${BUILDER_URL}`);
    }
  });

program.parse();
