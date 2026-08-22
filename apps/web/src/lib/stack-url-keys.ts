import type { UrlKeys } from "nuqs";

import type { StackState } from "@/lib/constant";

type StackUrlState = StackState & { viewMode: string; selectedFile: string };

export const stackUrlKeys: UrlKeys<StackUrlState> = {
  projectName: "name",
  webFrontend: "fe-w",
  nativeFrontend: "fe-n",
  runtime: "rt",
  backend: "be",
  api: "api",
  database: "db",
  orm: "orm",
  dbSetup: "dbs",
  auth: "au",
  payments: "pay",
  packageManager: "pm",
  addons: "add",
  examples: "ex",
  git: "git",
  install: "i",
  webDeploy: "wd",
  serverDeploy: "sd",
  apps: "apps",
  yolo: "yolo",
  viewMode: "view",
  selectedFile: "file",
};
