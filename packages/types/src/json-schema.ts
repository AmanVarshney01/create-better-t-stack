import { z } from "zod";

import {
  DatabaseSchema,
  ORMSchema,
  BackendSchema,
  RuntimeSchema,
  FrontendSchema,
  AddonsSchema,
  ExamplesSchema,
  PackageManagerSchema,
  DatabaseSetupSchema,
  APISchema,
  AuthSchema,
  PaymentsSchema,
  WebDeploySchema,
  ServerDeploySchema,
  DirectoryConflictSchema,
  TemplateSchema,
  AddonOptionsSchema,
  DbSetupOptionsSchema,
  CreateInputSchema,
  AddInputSchema,
  ProjectConfigSchema,
  BetterTStackConfigSchema,
  InitResultSchema,
} from "./schemas";

// Generate JSON schemas for each type
export function getDatabaseJsonSchema() {
  return z.toJSONSchema(DatabaseSchema);
}

export function getORMJsonSchema() {
  return z.toJSONSchema(ORMSchema);
}

export function getBackendJsonSchema() {
  return z.toJSONSchema(BackendSchema);
}

export function getRuntimeJsonSchema() {
  return z.toJSONSchema(RuntimeSchema);
}

export function getFrontendJsonSchema() {
  return z.toJSONSchema(FrontendSchema);
}

export function getAddonsJsonSchema() {
  return z.toJSONSchema(AddonsSchema);
}

export function getExamplesJsonSchema() {
  return z.toJSONSchema(ExamplesSchema);
}

export function getPackageManagerJsonSchema() {
  return z.toJSONSchema(PackageManagerSchema);
}

export function getDatabaseSetupJsonSchema() {
  return z.toJSONSchema(DatabaseSetupSchema);
}

export function getAPIJsonSchema() {
  return z.toJSONSchema(APISchema);
}

export function getAuthJsonSchema() {
  return z.toJSONSchema(AuthSchema);
}

export function getPaymentsJsonSchema() {
  return z.toJSONSchema(PaymentsSchema);
}

export function getWebDeployJsonSchema() {
  return z.toJSONSchema(WebDeploySchema);
}

export function getServerDeployJsonSchema() {
  return z.toJSONSchema(ServerDeploySchema);
}

export function getDirectoryConflictJsonSchema() {
  return z.toJSONSchema(DirectoryConflictSchema);
}

export function getTemplateJsonSchema() {
  return z.toJSONSchema(TemplateSchema);
}

export function getAddonOptionsJsonSchema() {
  return z.toJSONSchema(AddonOptionsSchema);
}

export function getDbSetupOptionsJsonSchema() {
  return z.toJSONSchema(DbSetupOptionsSchema);
}

export function getCreateInputJsonSchema() {
  return z.toJSONSchema(CreateInputSchema);
}

export function getAddInputJsonSchema() {
  return z.toJSONSchema(AddInputSchema);
}

export function getProjectConfigJsonSchema() {
  return z.toJSONSchema(ProjectConfigSchema);
}

export function getBetterTStackConfigJsonSchema() {
  return z.toJSONSchema(BetterTStackConfigSchema);
}

export function getInitResultJsonSchema() {
  return z.toJSONSchema(InitResultSchema);
}

// Get all JSON schemas as a single object
export function getAllJsonSchemas() {
  return {
    database: getDatabaseJsonSchema(),
    orm: getORMJsonSchema(),
    backend: getBackendJsonSchema(),
    runtime: getRuntimeJsonSchema(),
    frontend: getFrontendJsonSchema(),
    addons: getAddonsJsonSchema(),
    examples: getExamplesJsonSchema(),
    packageManager: getPackageManagerJsonSchema(),
    databaseSetup: getDatabaseSetupJsonSchema(),
    api: getAPIJsonSchema(),
    auth: getAuthJsonSchema(),
    payments: getPaymentsJsonSchema(),
    webDeploy: getWebDeployJsonSchema(),
    serverDeploy: getServerDeployJsonSchema(),
    directoryConflict: getDirectoryConflictJsonSchema(),
    template: getTemplateJsonSchema(),
    addonOptions: getAddonOptionsJsonSchema(),
    dbSetupOptions: getDbSetupOptionsJsonSchema(),
    createInput: getCreateInputJsonSchema(),
    addInput: getAddInputJsonSchema(),
    projectConfig: getProjectConfigJsonSchema(),
    betterTStackConfig: getBetterTStackConfigJsonSchema(),
    initResult: getInitResultJsonSchema(),
  };
}
