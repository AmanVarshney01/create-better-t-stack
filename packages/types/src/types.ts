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
