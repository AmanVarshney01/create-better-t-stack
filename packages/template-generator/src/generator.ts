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
import { processAiDocs } from "./processors/ai-docs-generator";
import {
  type TemplateData,
  processBaseTemplate,
  processRustBaseTemplate,
  processPythonBaseTemplate,
  processGoBaseTemplate,
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
  processFeatureFlagsTemplates,
  processAnalyticsTemplates,
  processJobQueueTemplates,
  processCMSTemplates,
  processSearchTemplates,
  processFileStorageTemplates,
  processTestingTemplates,
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

    // Process base templates based on ecosystem
    if (config.ecosystem === "rust") {
      // Rust ecosystem - use Cargo.toml and Rust project structure
      await processRustBaseTemplate(vfs, templates, config);
    } else if (config.ecosystem === "python") {
      // Python ecosystem - use pyproject.toml and Python project structure
      await processPythonBaseTemplate(vfs, templates, config);
    } else if (config.ecosystem === "go") {
      // Go ecosystem - use go.mod and Go project structure
      await processGoBaseTemplate(vfs, templates, config);
    } else {
      // TypeScript ecosystem - use package.json and TypeScript project structure
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
      await processFeatureFlagsTemplates(vfs, templates, config);
      await processAnalyticsTemplates(vfs, templates, config);
      await processJobQueueTemplates(vfs, templates, config);
      await processCMSTemplates(vfs, templates, config);
      await processSearchTemplates(vfs, templates, config);
      await processFileStorageTemplates(vfs, templates, config);
      await processTestingTemplates(vfs, templates, config);

      processPackageConfigs(vfs, config);
      processDependencies(vfs, config);
      processEnvVariables(vfs, config);
      processAuthPlugins(vfs, config);
      processAlchemyPlugins(vfs, config);
      processPwaPlugins(vfs, config);
      processCatalogs(vfs, config);
    }

    processReadme(vfs, config);
    processAiDocs(vfs, config);

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
