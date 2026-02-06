import { Result } from "better-result";

import type { GeneratorOptions, VirtualFileTree } from "./types";

import { writeBtsConfigToVfs } from "./bts-config";
import { VirtualFileSystem } from "./core/virtual-fs";
import { processCatalogs, processPackageConfigs } from "./post-process";
import {
  processDependencies,
  processReadme,
  processAuthPlugins,
  processAlchemyPlugins,
  processPwaPlugins,
  processEnvVariables,
} from "./processors";
import {
  type TemplateData,
  processBaseTemplate,
  processFrontendTemplates,
  processBackendTemplates,
  processDbTemplates,
  processApiTemplates,
  processConfigPackage,
  processEnvPackage,
  processAuthTemplates,
  processPaymentsTemplates,
  processAddonTemplates,
  processExampleTemplates,
  processExtrasTemplates,
  processDeployTemplates,
} from "./template-handlers";
import { GeneratorError } from "./types";
import { generateReproducibleCommand } from "./utils/reproducible-command";

export type { TemplateData };

/**
 * Generates a virtual project file tree from templates and configuration.
 * Returns a Result type for type-safe error handling.
 *
 * @example
 * ```typescript
 * const result = await generate(options);
 * result.match({
 *   ok: (tree) => console.log(`Generated ${tree.fileCount} files`),
 *   err: (error) => console.error(`Failed: ${error.message}`),
 * });
 * ```
 */
export async function generate(
  options: GeneratorOptions,
): Promise<Result<VirtualFileTree, GeneratorError>> {
  return Result.tryPromise({
    try: async () => {
      const { config, templates } = options;

      if (!templates || templates.size === 0) {
        throw new GeneratorError({
          message: "No templates provided. Templates must be passed via the templates option.",
          phase: "initialization",
        });
      }

      const vfs = new VirtualFileSystem();

      await processBaseTemplate(vfs, templates, config);
      await processFrontendTemplates(vfs, templates, config);
      await processBackendTemplates(vfs, templates, config);
      await processDbTemplates(vfs, templates, config);
      await processApiTemplates(vfs, templates, config);
      await processConfigPackage(vfs, templates, config);
      await processEnvPackage(vfs, templates, config);
      await processAuthTemplates(vfs, templates, config);
      await processPaymentsTemplates(vfs, templates, config);
      await processAddonTemplates(vfs, templates, config);
      await processExampleTemplates(vfs, templates, config);
      await processExtrasTemplates(vfs, templates, config);
      await processDeployTemplates(vfs, templates, config);

      processPackageConfigs(vfs, config);
      processDependencies(vfs, config);
      processEnvVariables(vfs, config);
      processAuthPlugins(vfs, config);
      processAlchemyPlugins(vfs, config);
      processPwaPlugins(vfs, config);
      processCatalogs(vfs, config);
      processReadme(vfs, config);

      // Write bts.jsonc config file
      if (options.version) {
        const reproducibleCommand = generateReproducibleCommand(config);
        writeBtsConfigToVfs(vfs, config, options.version, reproducibleCommand);
      }

      const tree: VirtualFileTree = {
        root: vfs.toTree(config.projectName),
        fileCount: vfs.getFileCount(),
        directoryCount: vfs.getDirectoryCount(),
        config,
      };

      return tree;
    },
    catch: (e) => {
      if (GeneratorError.is(e)) {
        return e;
      }
      return new GeneratorError({
        message: e instanceof Error ? e.message : String(e),
        phase: "unknown",
        cause: e,
      });
    },
  });
}
