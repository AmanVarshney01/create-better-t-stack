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
  name: z.string().catch(DEFAULT_STACK.projectName ?? "my-better-t-app"),
  "fe-w": commaSeparatedArray(DEFAULT_STACK.webFrontend),
  "fe-n": commaSeparatedArray(DEFAULT_STACK.nativeFrontend),
  ai: z.string().catch(DEFAULT_STACK.astroIntegration),
  rt: z.string().catch(DEFAULT_STACK.runtime),
  be: z.string().catch(DEFAULT_STACK.backend),
  api: z.string().catch(DEFAULT_STACK.api),
  db: z.string().catch(DEFAULT_STACK.database),
  orm: z.string().catch(DEFAULT_STACK.orm),
  dbs: z.string().catch(DEFAULT_STACK.dbSetup),
  au: z.string().catch(DEFAULT_STACK.auth),
  pay: z.string().catch(DEFAULT_STACK.payments),
  eff: z.string().catch(DEFAULT_STACK.effect),
  pm: z.string().catch(DEFAULT_STACK.packageManager),
  add: commaSeparatedArray(DEFAULT_STACK.addons),
  ex: commaSeparatedArray(DEFAULT_STACK.examples),
  git: z.string().catch(DEFAULT_STACK.git),
  i: z.string().catch(DEFAULT_STACK.install),
  wd: z.string().catch(DEFAULT_STACK.webDeploy),
  sd: z.string().catch(DEFAULT_STACK.serverDeploy),
  yolo: z.string().catch(DEFAULT_STACK.yolo),
  view: z.enum(["command", "preview"]).catch("command"),
  file: z.string().catch(""),
});

export type StackSearchParams = z.infer<typeof stackSearchSchema>;
