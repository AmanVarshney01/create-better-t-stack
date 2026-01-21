import { z } from "zod";

import { DEFAULT_STACK } from "./constant";

// Helper function to create a comma-separated array parser with catch for defaults
const commaSeparatedArray = (defaultValue: string[]) =>
  z
    .string()
    .transform((val) => val.split(",").filter(Boolean))
    .catch(defaultValue);

// The raw search schema matches URL query params (using short keys)
export const stackSearchSchema = z.object({
  eco: z.enum(["typescript", "rust"]).catch(DEFAULT_STACK.ecosystem),
  name: z.string().catch(DEFAULT_STACK.projectName ?? "my-better-t-app"),
  "fe-w": commaSeparatedArray(DEFAULT_STACK.webFrontend),
  "fe-n": commaSeparatedArray(DEFAULT_STACK.nativeFrontend),
  ai: z.string().catch(DEFAULT_STACK.astroIntegration),
  css: z.string().catch(DEFAULT_STACK.cssFramework),
  ui: z.string().catch(DEFAULT_STACK.uiLibrary),
  rt: z.string().catch(DEFAULT_STACK.runtime),
  be: z.string().catch(DEFAULT_STACK.backend),
  api: z.string().catch(DEFAULT_STACK.api),
  db: z.string().catch(DEFAULT_STACK.database),
  orm: z.string().catch(DEFAULT_STACK.orm),
  dbs: z.string().catch(DEFAULT_STACK.dbSetup),
  au: z.string().catch(DEFAULT_STACK.auth),
  pay: z.string().catch(DEFAULT_STACK.payments),
  em: z.string().catch(DEFAULT_STACK.email),
  fu: z.string().catch(DEFAULT_STACK.fileUpload),
  log: z.string().catch(DEFAULT_STACK.logging),
  obs: z.string().catch(DEFAULT_STACK.observability),
  bl: z.string().catch(DEFAULT_STACK.backendLibraries),
  sm: z.string().catch(DEFAULT_STACK.stateManagement),
  frm: z.string().catch(DEFAULT_STACK.forms),
  val: z.string().catch(DEFAULT_STACK.validation),
  tst: z.string().catch(DEFAULT_STACK.testing),
  rt2: z.string().catch(DEFAULT_STACK.realtime),
  jq: z.string().catch(DEFAULT_STACK.jobQueue),
  cache: z.string().catch(DEFAULT_STACK.caching),
  anim: z.string().catch(DEFAULT_STACK.animation),
  cms: z.string().catch(DEFAULT_STACK.cms),
  cq: commaSeparatedArray(DEFAULT_STACK.codeQuality),
  doc: commaSeparatedArray(DEFAULT_STACK.documentation),
  ap: commaSeparatedArray(DEFAULT_STACK.appPlatforms),
  pm: z.string().catch(DEFAULT_STACK.packageManager),
  ex: commaSeparatedArray(DEFAULT_STACK.examples),
  aisdk: z.string().catch(DEFAULT_STACK.aiSdk),
  git: z.string().catch(DEFAULT_STACK.git),
  i: z.string().catch(DEFAULT_STACK.install),
  wd: z.string().catch(DEFAULT_STACK.webDeploy),
  sd: z.string().catch(DEFAULT_STACK.serverDeploy),
  yolo: z.string().catch(DEFAULT_STACK.yolo),
  // Rust ecosystem fields
  rwf: z.string().catch(DEFAULT_STACK.rustWebFramework),
  rfe: z.string().catch(DEFAULT_STACK.rustFrontend),
  rorm: z.string().catch(DEFAULT_STACK.rustOrm),
  rapi: z.string().catch(DEFAULT_STACK.rustApi),
  rcli: z.string().catch(DEFAULT_STACK.rustCli),
  rlib: z.string().catch(DEFAULT_STACK.rustLibraries),
  view: z.enum(["command", "preview"]).catch("command"),
  file: z.string().catch(""),
});

export type StackSearchParams = z.infer<typeof stackSearchSchema>;
