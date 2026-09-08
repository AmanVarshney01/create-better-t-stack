import { ProjectConfigSchema } from "@better-t-stack/types";
import { z } from "zod";

import { DEFAULT_STACK, TECH_OPTIONS, type StackState } from "./constant";
import { formatProjectName } from "./stack-utils";

const option = (category: keyof typeof TECH_OPTIONS) =>
  z.enum(TECH_OPTIONS[category].map(({ id }) => id));

export const StackStateSchema = z.object({
  projectName: z.string().nullable().default(DEFAULT_STACK.projectName),
  webFrontend: z.array(option("webFrontend")).default(DEFAULT_STACK.webFrontend),
  nativeFrontend: z.array(option("nativeFrontend")).default(DEFAULT_STACK.nativeFrontend),
  runtime: option("runtime").default(DEFAULT_STACK.runtime),
  backend: option("backend").default(DEFAULT_STACK.backend),
  database: option("database").default(DEFAULT_STACK.database),
  orm: option("orm").default(DEFAULT_STACK.orm),
  dbSetup: option("dbSetup").default(DEFAULT_STACK.dbSetup),
  auth: option("auth").default(DEFAULT_STACK.auth),
  payments: option("payments").default(DEFAULT_STACK.payments),
  packageManager: option("packageManager").default(DEFAULT_STACK.packageManager),
  addons: z
    .array(z.enum(["none", ...TECH_OPTIONS.addons.map(({ id }) => id)]))
    .default(DEFAULT_STACK.addons),
  examples: z
    .array(z.enum(["none", ...TECH_OPTIONS.examples.map(({ id }) => id)]))
    .default(DEFAULT_STACK.examples),
  git: option("git").default(DEFAULT_STACK.git),
  install: option("install").default(DEFAULT_STACK.install),
  api: option("api").default(DEFAULT_STACK.api),
  webDeploy: option("webDeploy").default(DEFAULT_STACK.webDeploy),
  serverDeploy: option("serverDeploy").default(DEFAULT_STACK.serverDeploy),
  yolo: z.enum(["true", "false"]).default("false"),
});

export function stackStateToConfig(stack: StackState) {
  const frontend = [...stack.webFrontend, ...stack.nativeFrontend].filter((id) => id !== "none");
  const projectPath = formatProjectName(stack.projectName);
  const projectName = projectPath.split(/[\\/]/).filter(Boolean).at(-1) || "my-better-t-app";
  return ProjectConfigSchema.parse({
    ...stack,
    projectName: projectName === "." ? "my-better-t-app" : projectName,
    projectDir: "/virtual",
    relativePath: "./virtual",
    frontend: frontend.length ? frontend : ["none"],
    backend: stack.backend.startsWith("self-") ? "self" : stack.backend,
    addons: stack.addons.filter((id) => id !== "none"),
    examples: stack.examples.filter((id) => id !== "none"),
    git: stack.git === "true",
    install: false,
  });
}
