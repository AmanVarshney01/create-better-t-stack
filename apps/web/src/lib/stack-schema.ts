import { ProjectConfigSchema } from "@better-t-stack/types";
import { z } from "zod";

import { DEFAULT_STACK, TECH_OPTIONS, getStackOptionIds, type StackState } from "./constant";
import { getStackBackend, getStackFrontends } from "./stack-model";
import { formatProjectName } from "./stack-utils";

const option = <K extends keyof typeof TECH_OPTIONS>(category: K) =>
  z.enum(getStackOptionIds(category));

const stackFields = {
  projectName: z.string().nullable(),
  webFrontend: z.array(option("webFrontend")),
  nativeFrontend: z.array(option("nativeFrontend")),
  runtime: option("runtime"),
  backend: option("backend"),
  database: option("database"),
  orm: option("orm"),
  dbSetup: option("dbSetup"),
  auth: option("auth"),
  payments: option("payments"),
  packageManager: option("packageManager"),
  addons: z.array(z.enum(["none", ...getStackOptionIds("addons")])),
  examples: z.array(z.enum(["none", ...getStackOptionIds("examples")])),
  git: option("git"),
  install: option("install"),
  api: option("api"),
  webDeploy: option("webDeploy"),
  serverDeploy: option("serverDeploy"),
  yolo: z.enum(["true", "false"]),
};

export const StackUpdateSchema = z.object(stackFields).partial();

export const StackStateSchema = z.object({
  projectName: stackFields.projectName.default(DEFAULT_STACK.projectName),
  webFrontend: stackFields.webFrontend.default(DEFAULT_STACK.webFrontend),
  nativeFrontend: stackFields.nativeFrontend.default(DEFAULT_STACK.nativeFrontend),
  runtime: stackFields.runtime.default(DEFAULT_STACK.runtime),
  backend: stackFields.backend.default(DEFAULT_STACK.backend),
  database: stackFields.database.default(DEFAULT_STACK.database),
  orm: stackFields.orm.default(DEFAULT_STACK.orm),
  dbSetup: stackFields.dbSetup.default(DEFAULT_STACK.dbSetup),
  auth: stackFields.auth.default(DEFAULT_STACK.auth),
  payments: stackFields.payments.default(DEFAULT_STACK.payments),
  packageManager: stackFields.packageManager.default(DEFAULT_STACK.packageManager),
  addons: stackFields.addons.default(DEFAULT_STACK.addons),
  examples: stackFields.examples.default(DEFAULT_STACK.examples),
  git: stackFields.git.default(DEFAULT_STACK.git),
  install: stackFields.install.default(DEFAULT_STACK.install),
  api: stackFields.api.default(DEFAULT_STACK.api),
  webDeploy: stackFields.webDeploy.default(DEFAULT_STACK.webDeploy),
  serverDeploy: stackFields.serverDeploy.default(DEFAULT_STACK.serverDeploy),
  yolo: stackFields.yolo.default(DEFAULT_STACK.yolo),
});

export function stackStateToConfig(stack: StackState) {
  const projectPath = formatProjectName(stack.projectName);
  const projectName = projectPath.split(/[\\/]/).filter(Boolean).at(-1) || "my-better-t-app";
  return ProjectConfigSchema.parse({
    ...stack,
    projectName: projectName === "." ? "my-better-t-app" : projectName,
    projectDir: "/virtual",
    relativePath: "./virtual",
    frontend: getStackFrontends(stack),
    backend: getStackBackend(stack.backend),
    addons: stack.addons.filter((id) => id !== "none"),
    examples: stack.examples.filter((id) => id !== "none"),
    git: stack.git === "true",
    install: false,
  });
}
