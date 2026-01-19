import type { GeneratorOptions, GeneratorResult, VirtualFileTree } from "./types";

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
  processEmailTemplates,
  processAddonTemplates,
  processExampleTemplates,
  processExtrasTemplates,
  processDeployTemplates,
  processLoggingTemplates,
  processObservabilityTemplates,
} from "./template-handlers";

export type { TemplateData };

export async function generateVirtualProject(options: GeneratorOptions): Promise<GeneratorResult> {
  try {
    const { config, templates } = options;

    if (!templates || templates.size === 0) {
      return {
        success: false,
        error: "No templates provided. Templates must be passed via the templates option.",
      };
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
    await processEmailTemplates(vfs, templates, config);
    await processAddonTemplates(vfs, templates, config);
    await processExampleTemplates(vfs, templates, config);
    await processExtrasTemplates(vfs, templates, config);
    await processDeployTemplates(vfs, templates, config);
    await processLoggingTemplates(vfs, templates, config);
    await processObservabilityTemplates(vfs, templates, config);

    processPackageConfigs(vfs, config);
    processDependencies(vfs, config);
    processEnvVariables(vfs, config);
    processAuthPlugins(vfs, config);
    processAlchemyPlugins(vfs, config);
    processPwaPlugins(vfs, config);
    processCatalogs(vfs, config);
    processReadme(vfs, config);

    const tree: VirtualFileTree = {
      root: vfs.toTree(config.projectName),
      fileCount: vfs.getFileCount(),
      directoryCount: vfs.getDirectoryCount(),
      config,
    };

    return { success: true, tree };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
