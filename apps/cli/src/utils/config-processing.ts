import path from "node:path";

import type {
  API,
  AstroIntegration,
  Auth,
  Backend,
  CLIInput,
  CSSFramework,
  Database,
  DatabaseSetup,
  Effect,
  Email,
  ORM,
  PackageManager,
  Payments,
  ProjectConfig,
  Runtime,
  ServerDeploy,
  UILibrary,
  WebDeploy,
} from "../types";

export function processArrayOption<T>(options: (T | "none")[] | undefined) {
  if (!options || options.length === 0) return [];
  if (options.includes("none" as T | "none")) return [];
  return options.filter((item): item is T => item !== "none");
}

export function deriveProjectName(projectName?: string, projectDirectory?: string) {
  if (projectName) {
    return projectName;
  }
  if (projectDirectory) {
    return path.basename(path.resolve(process.cwd(), projectDirectory));
  }
  return "";
}

export function processFlags(options: CLIInput, projectName?: string) {
  const config: Partial<ProjectConfig> = {};

  if (options.api) {
    config.api = options.api as API;
  }

  if (options.backend) {
    config.backend = options.backend as Backend;
  }

  if (options.database) {
    config.database = options.database as Database;
  }

  if (options.orm) {
    config.orm = options.orm as ORM;
  }

  if (options.auth !== undefined) {
    config.auth = options.auth as Auth;
  }

  if (options.payments !== undefined) {
    config.payments = options.payments as Payments;
  }

  if (options.email !== undefined) {
    config.email = options.email as Email;
  }

  if (options.effect !== undefined) {
    config.effect = options.effect as Effect;
  }

  if (options.git !== undefined) {
    config.git = options.git;
  }

  if (options.install !== undefined) {
    config.install = options.install;
  }

  if (options.runtime) {
    config.runtime = options.runtime as Runtime;
  }

  if (options.dbSetup) {
    config.dbSetup = options.dbSetup as DatabaseSetup;
  }

  if (options.packageManager) {
    config.packageManager = options.packageManager as PackageManager;
  }

  if (options.webDeploy) {
    config.webDeploy = options.webDeploy as WebDeploy;
  }

  if (options.serverDeploy) {
    config.serverDeploy = options.serverDeploy as ServerDeploy;
  }

  const derivedName = deriveProjectName(projectName, options.projectDirectory);
  if (derivedName) {
    config.projectName = projectName || derivedName;
  }

  if (options.frontend && options.frontend.length > 0) {
    config.frontend = processArrayOption(options.frontend);
  }

  if (options.astroIntegration) {
    config.astroIntegration = options.astroIntegration as AstroIntegration;
  }

  if (options.cssFramework) {
    config.cssFramework = options.cssFramework as CSSFramework;
  }

  if (options.uiLibrary) {
    config.uiLibrary = options.uiLibrary as UILibrary;
  }

  if (options.addons && options.addons.length > 0) {
    config.addons = processArrayOption(options.addons);
  }

  if (options.examples && options.examples.length > 0) {
    config.examples = processArrayOption(options.examples);
  }

  return config;
}

export function getProvidedFlags(options: CLIInput) {
  return new Set(
    Object.keys(options).filter((key) => options[key as keyof CLIInput] !== undefined),
  );
}

export function validateNoneExclusivity<T>(
  options: (T | "none")[] | undefined,
  optionName: string,
) {
  if (!options || options.length === 0) return;

  if (options.includes("none" as T | "none") && options.length > 1) {
    throw new Error(`Cannot combine 'none' with other ${optionName}.`);
  }
}

export function validateArrayOptions(options: CLIInput) {
  validateNoneExclusivity(options.frontend, "frontend options");
  validateNoneExclusivity(options.addons, "addons");
  validateNoneExclusivity(options.examples, "examples");
}
