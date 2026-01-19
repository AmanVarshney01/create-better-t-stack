import type { UrlKeys } from "nuqs";

import type { StackState } from "@/lib/constant";

export const stackUrlKeys: UrlKeys<
  Record<keyof StackState, unknown> & { viewMode: unknown; selectedFile: unknown }
> = {
  projectName: "name",
  webFrontend: "fe-w",
  nativeFrontend: "fe-n",
  astroIntegration: "ai",
  cssFramework: "css",
  uiLibrary: "ui",
  runtime: "rt",
  backend: "be",
  api: "api",
  database: "db",
  orm: "orm",
  dbSetup: "dbs",
  auth: "au",
  payments: "pay",
  email: "em",
  backendLibraries: "bl",
  stateManagement: "sm",
  validation: "val",
  realtime: "rt2",
  codeQuality: "cq",
  documentation: "doc",
  appPlatforms: "ap",
  packageManager: "pm",
  examples: "ex",
  git: "git",
  install: "i",
  webDeploy: "wd",
  serverDeploy: "sd",
  yolo: "yolo",
  viewMode: "view",
  selectedFile: "file",
};
