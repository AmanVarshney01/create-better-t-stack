import type { UrlKeys } from "nuqs";

import type { StackState } from "@/lib/constant";

export const stackUrlKeys: UrlKeys<
  Record<keyof StackState, unknown> & { viewMode: unknown; selectedFile: unknown }
> = {
  projectName: "name",
  webFrontend: "fe-w",
  nativeFrontend: "fe-n",
  astroIntegration: "ai",
  runtime: "rt",
  backend: "be",
  api: "api",
  database: "db",
  orm: "orm",
  dbSetup: "dbs",
  auth: "au",
  payments: "pay",
  effect: "eff",
  packageManager: "pm",
  addons: "add",
  examples: "ex",
  git: "git",
  install: "i",
  webDeploy: "wd",
  serverDeploy: "sd",
  yolo: "yolo",
  viewMode: "view",
  selectedFile: "file",
};
