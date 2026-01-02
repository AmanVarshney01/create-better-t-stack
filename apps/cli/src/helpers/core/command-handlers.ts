import { intro, log, outro } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { CreateInput, DirectoryConflict, ProjectConfig } from "../../types";

import { getDefaultConfig } from "../../constants";
import { gatherConfig } from "../../prompts/config-prompts";
import { getProjectName } from "../../prompts/project-name";
import { trackProjectCreation } from "../../utils/analytics";
import { isSilent, runWithContextAsync } from "../../utils/context";
import { displayConfig } from "../../utils/display-config";
import { CLIError, exitWithError, handleError, UserCancelledError } from "../../utils/errors";
import { generateReproducibleCommand } from "../../utils/generate-reproducible-command";
import { handleDirectoryConflict, setupProjectDirectory } from "../../utils/project-directory";
import { renderTitle } from "../../utils/render-title";
import { getTemplateConfig, getTemplateDescription } from "../../utils/templates";
import {
  getProvidedFlags,
  processAndValidateFlags,
  processProvidedFlagsWithoutValidation,
  validateConfigCompatibility,
} from "../../validation";
import { createProject } from "./create-project";
import { detectProjectConfig } from "./detect-project-config";
import { installDependencies } from "./install-dependencies";

export interface CreateHandlerOptions {
  silent?: boolean;
}

export async function createProjectHandler(
  input: CreateInput & { projectName?: string },
  options: CreateHandlerOptions = {},
) {
  const { silent = false } = options;

  return runWithContextAsync({ silent }, async () => {
    const startTime = Date.now();
    const timeScaffolded = new Date().toISOString();

    try {
      if (!isSilent() && input.renderTitle !== false) {
        renderTitle();
      }
      if (!isSilent()) intro(pc.magenta("Creating a new Better-T-Stack project"));

      if (!isSilent() && input.yolo) {
        consola.fatal("YOLO mode enabled - skipping checks. Things may break!");
      }

      let currentPathInput: string;
      if (input.yes && input.projectName) {
        currentPathInput = input.projectName;
      } else if (input.yes) {
        const defaultConfig = getDefaultConfig();
        let defaultName: string = defaultConfig.relativePath;
        let counter = 1;
        while (
          (await fs.pathExists(path.resolve(process.cwd(), defaultName))) &&
          (await fs.readdir(path.resolve(process.cwd(), defaultName))).length > 0
        ) {
          defaultName = `${defaultConfig.projectName}-${counter}`;
          counter++;
        }
        currentPathInput = defaultName;
      } else {
        currentPathInput = await getProjectName(input.projectName);
      }

      let finalPathInput: string;
      let shouldClearDirectory: boolean;

      try {
        if (input.directoryConflict) {
          const result = await handleDirectoryConflictProgrammatically(
            currentPathInput,
            input.directoryConflict,
          );
          finalPathInput = result.finalPathInput;
          shouldClearDirectory = result.shouldClearDirectory;
        } else {
          const result = await handleDirectoryConflict(currentPathInput);
          finalPathInput = result.finalPathInput;
          shouldClearDirectory = result.shouldClearDirectory;
        }
      } catch (error) {
        if (error instanceof UserCancelledError || error instanceof CLIError) {
          throw error;
        }
        const elapsedTimeMs = Date.now() - startTime;
        return {
          success: false,
          projectConfig: {
            projectName: "",
            projectDir: "",
            relativePath: "",
            database: "none",
            orm: "none",
            backend: "none",
            runtime: "none",
            frontend: [],
            addons: [],
            examples: [],
            auth: "none",
            payments: "none",
            git: false,
            packageManager: "npm",
            install: false,
            dbSetup: "none",
            api: "none",
            webDeploy: "none",
            serverDeploy: "none",
          } satisfies ProjectConfig,
          reproducibleCommand: "",
          timeScaffolded,
          elapsedTimeMs,
          projectDirectory: "",
          relativePath: "",
          error: error instanceof Error ? error.message : String(error),
        };
      }

      const { finalResolvedPath, finalBaseName } = await setupProjectDirectory(
        finalPathInput,
        shouldClearDirectory,
      );

      const originalInput = {
        ...input,
        projectDirectory: input.projectName,
      };

      const providedFlags = getProvidedFlags(originalInput);

      let cliInput = originalInput;

      if (input.template && input.template !== "none") {
        const templateConfig = getTemplateConfig(input.template);
        if (templateConfig) {
          const templateName = input.template.toUpperCase();
          const templateDescription = getTemplateDescription(input.template);
          if (!isSilent()) {
            log.message(pc.bold(pc.cyan(`Using template: ${pc.white(templateName)}`)));
            log.message(pc.dim(`   ${templateDescription}`));
          }
          const userOverrides: Record<string, unknown> = {};
          for (const [key, value] of Object.entries(originalInput)) {
            if (value !== undefined) {
              userOverrides[key] = value;
            }
          }
          cliInput = {
            ...templateConfig,
            ...userOverrides,
            template: input.template,
            projectDirectory: originalInput.projectDirectory,
          };
        }
      }

      let config: ProjectConfig;
      if (cliInput.yes) {
        const flagConfig = processProvidedFlagsWithoutValidation(cliInput, finalBaseName);

        config = {
          ...getDefaultConfig(),
          ...flagConfig,
          projectName: finalBaseName,
          projectDir: finalResolvedPath,
          relativePath: finalPathInput,
        };

        validateConfigCompatibility(config, providedFlags, cliInput);

        if (!isSilent()) {
          log.info(pc.yellow("Using default/flag options (config prompts skipped):"));
          log.message(displayConfig(config));
        }
      } else {
        const flagConfig = processAndValidateFlags(cliInput, providedFlags, finalBaseName);
        const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

        if (!isSilent() && Object.keys(otherFlags).length > 0) {
          log.info(pc.yellow("Using these pre-selected options:"));
          log.message(displayConfig(otherFlags));
          log.message("");
        }

        config = await gatherConfig(flagConfig, finalBaseName, finalResolvedPath, finalPathInput);
      }

      await createProject(config, {
        manualDb: cliInput.manualDb ?? input.manualDb,
      });

      const reproducibleCommand = generateReproducibleCommand(config);
      if (!isSilent()) {
        log.success(
          pc.blue(
            `You can reproduce this setup with the following command:\n${reproducibleCommand}`,
          ),
        );
      }

      await trackProjectCreation(config, input.disableAnalytics);

      const elapsedTimeMs = Date.now() - startTime;
      if (!isSilent()) {
        const elapsedTimeInSeconds = (elapsedTimeMs / 1000).toFixed(2);
        outro(
          pc.magenta(`Project created successfully in ${pc.bold(elapsedTimeInSeconds)} seconds!`),
        );
      }

      return {
        success: true,
        projectConfig: config,
        reproducibleCommand,
        timeScaffolded,
        elapsedTimeMs,
        projectDirectory: config.projectDir,
        relativePath: config.relativePath,
      };
    } catch (error) {
      if (error instanceof UserCancelledError) {
        if (isSilent()) {
          return {
            success: false,
            error: error.message,
            projectConfig: {} as ProjectConfig,
            reproducibleCommand: "",
            timeScaffolded,
            elapsedTimeMs: Date.now() - startTime,
            projectDirectory: "",
            relativePath: "",
          };
        }
        return;
      }
      if (error instanceof CLIError) {
        if (isSilent()) {
          return {
            success: false,
            error: error.message,
            projectConfig: {} as ProjectConfig,
            reproducibleCommand: "",
            timeScaffolded,
            elapsedTimeMs: Date.now() - startTime,
            projectDirectory: "",
            relativePath: "",
          };
        }
        throw error;
      }
      throw error;
    }
  });
}

async function handleDirectoryConflictProgrammatically(
  currentPathInput: string,
  strategy: DirectoryConflict,
) {
  const currentPath = path.resolve(process.cwd(), currentPathInput);

  if (!(await fs.pathExists(currentPath))) {
    return { finalPathInput: currentPathInput, shouldClearDirectory: false };
  }

  const dirContents = await fs.readdir(currentPath);
  const isNotEmpty = dirContents.length > 0;

  if (!isNotEmpty) {
    return { finalPathInput: currentPathInput, shouldClearDirectory: false };
  }

  switch (strategy) {
    case "overwrite":
      return { finalPathInput: currentPathInput, shouldClearDirectory: true };

    case "merge":
      return { finalPathInput: currentPathInput, shouldClearDirectory: false };

    case "increment": {
      let counter = 1;
      const baseName = currentPathInput;
      let finalPathInput = `${baseName}-${counter}`;

      while (
        (await fs.pathExists(path.resolve(process.cwd(), finalPathInput))) &&
        (await fs.readdir(path.resolve(process.cwd(), finalPathInput))).length > 0
      ) {
        counter++;
        finalPathInput = `${baseName}-${counter}`;
      }

      return { finalPathInput, shouldClearDirectory: false };
    }

    case "error":
      throw new Error(
        `Directory "${currentPathInput}" already exists and is not empty. Use directoryConflict: "overwrite", "merge", or "increment" to handle this.`,
      );

    default:
      throw new Error(`Unknown directory conflict strategy: ${strategy}`);
  }
}
