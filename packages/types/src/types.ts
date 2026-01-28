import type { z } from "zod";

import type {
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
  ProjectNameSchema,
  CreateInputSchema,
  AddInputSchema,
  CLIInputSchema,
  ProjectConfigSchema,
  BetterTStackConfigSchema,
  InitResultSchema,
  AstroIntegrationSchema,
  AISchema,
  EffectSchema,
  StateManagementSchema,
  FormsSchema,
  TestingSchema,
  EmailSchema,
  CSSFrameworkSchema,
  UILibrarySchema,
  ValidationSchema,
  RealtimeSchema,
  JobQueueSchema,
  AnimationSchema,
  FileUploadSchema,
  LoggingSchema,
  ObservabilitySchema,
  FeatureFlagsSchema,
  AnalyticsSchema,
  CMSSchema,
  CachingSchema,
  SearchSchema,
  FileStorageSchema,
  EcosystemSchema,
  RustWebFrameworkSchema,
  RustFrontendSchema,
  RustOrmSchema,
  RustApiSchema,
  RustCliSchema,
  RustLibrariesSchema,
  PythonWebFrameworkSchema,
  PythonOrmSchema,
  PythonValidationSchema,
  PythonAiSchema,
  PythonTaskQueueSchema,
  PythonQualitySchema,
  GoWebFrameworkSchema,
  GoOrmSchema,
  GoApiSchema,
  GoCliSchema,
  GoLoggingSchema,
  AiDocsSchema,
} from "./schemas";

// Inferred types from Zod schemas
export type Database = z.infer<typeof DatabaseSchema>;
export type ORM = z.infer<typeof ORMSchema>;
export type Backend = z.infer<typeof BackendSchema>;
export type Runtime = z.infer<typeof RuntimeSchema>;
export type Frontend = z.infer<typeof FrontendSchema>;
export type Addons = z.infer<typeof AddonsSchema>;
export type Examples = z.infer<typeof ExamplesSchema>;
export type PackageManager = z.infer<typeof PackageManagerSchema>;
export type DatabaseSetup = z.infer<typeof DatabaseSetupSchema>;
export type API = z.infer<typeof APISchema>;
export type Auth = z.infer<typeof AuthSchema>;
export type Payments = z.infer<typeof PaymentsSchema>;
export type WebDeploy = z.infer<typeof WebDeploySchema>;
export type ServerDeploy = z.infer<typeof ServerDeploySchema>;
export type DirectoryConflict = z.infer<typeof DirectoryConflictSchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type ProjectName = z.infer<typeof ProjectNameSchema>;
export type AstroIntegration = z.infer<typeof AstroIntegrationSchema>;
export type AI = z.infer<typeof AISchema>;
export type Effect = z.infer<typeof EffectSchema>;
export type StateManagement = z.infer<typeof StateManagementSchema>;
export type Forms = z.infer<typeof FormsSchema>;
export type Testing = z.infer<typeof TestingSchema>;
export type Email = z.infer<typeof EmailSchema>;
export type CSSFramework = z.infer<typeof CSSFrameworkSchema>;
export type UILibrary = z.infer<typeof UILibrarySchema>;
export type Validation = z.infer<typeof ValidationSchema>;
export type Realtime = z.infer<typeof RealtimeSchema>;
export type JobQueue = z.infer<typeof JobQueueSchema>;
export type Animation = z.infer<typeof AnimationSchema>;
export type FileUpload = z.infer<typeof FileUploadSchema>;
export type Logging = z.infer<typeof LoggingSchema>;
export type Observability = z.infer<typeof ObservabilitySchema>;
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type Analytics = z.infer<typeof AnalyticsSchema>;
export type CMS = z.infer<typeof CMSSchema>;
export type Caching = z.infer<typeof CachingSchema>;
export type Search = z.infer<typeof SearchSchema>;
export type FileStorage = z.infer<typeof FileStorageSchema>;
export type Ecosystem = z.infer<typeof EcosystemSchema>;
export type RustWebFramework = z.infer<typeof RustWebFrameworkSchema>;
export type RustFrontend = z.infer<typeof RustFrontendSchema>;
export type RustOrm = z.infer<typeof RustOrmSchema>;
export type RustApi = z.infer<typeof RustApiSchema>;
export type RustCli = z.infer<typeof RustCliSchema>;
export type RustLibraries = z.infer<typeof RustLibrariesSchema>;
export type PythonWebFramework = z.infer<typeof PythonWebFrameworkSchema>;
export type PythonOrm = z.infer<typeof PythonOrmSchema>;
export type PythonValidation = z.infer<typeof PythonValidationSchema>;
export type PythonAi = z.infer<typeof PythonAiSchema>;
export type PythonTaskQueue = z.infer<typeof PythonTaskQueueSchema>;
export type PythonQuality = z.infer<typeof PythonQualitySchema>;
export type GoWebFramework = z.infer<typeof GoWebFrameworkSchema>;
export type GoOrm = z.infer<typeof GoOrmSchema>;
export type GoApi = z.infer<typeof GoApiSchema>;
export type GoCli = z.infer<typeof GoCliSchema>;
export type GoLogging = z.infer<typeof GoLoggingSchema>;
export type AiDocs = z.infer<typeof AiDocsSchema>;

export type CreateInput = z.infer<typeof CreateInputSchema>;
export type AddInput = z.infer<typeof AddInputSchema>;
export type CLIInput = z.infer<typeof CLIInputSchema>;
export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export type BetterTStackConfig = z.infer<typeof BetterTStackConfigSchema>;
export type InitResult = z.infer<typeof InitResultSchema>;

export type WebFrontend = Extract<
  Frontend,
  | "tanstack-router"
  | "react-router"
  | "tanstack-start"
  | "next"
  | "nuxt"
  | "svelte"
  | "solid"
  | "astro"
  | "none"
>;

export type NativeFrontend = Extract<
  Frontend,
  "native-bare" | "native-uniwind" | "native-unistyles" | "none"
>;
