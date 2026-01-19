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
  fileUpload: "fu",
  backendLibraries: "bl",
  stateManagement: "sm",
  validation: "val",
  testing: "tst",
  realtime: "rt2",
  animation: "anim",
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
