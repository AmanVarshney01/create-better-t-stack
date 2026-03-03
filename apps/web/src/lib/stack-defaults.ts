import type { Ecosystem } from "./types";

export type StackState = {
  ecosystem: Ecosystem;
  projectName: string | null;
  webFrontend: string[];
  nativeFrontend: string[];
  astroIntegration: string;
  runtime: string;
  backend: string;
  database: string;
  orm: string;
  dbSetup: string;
  auth: string;
  payments: string;
  email: string;
  fileUpload: string;
  logging: string;
  observability: string;
  featureFlags: string;
  analytics: string;
  backendLibraries: string;
  stateManagement: string;
  forms: string;
  validation: string;
  testing: string;
  realtime: string;
  jobQueue: string;
  caching: string;
  animation: string;
  cssFramework: string;
  uiLibrary: string;
  shadcnBase: string;
  shadcnStyle: string;
  shadcnIconLibrary: string;
  shadcnColorTheme: string;
  shadcnBaseColor: string;
  shadcnFont: string;
  shadcnRadius: string;
  cms: string;
  search: string;
  fileStorage: string;
  codeQuality: string[];
  documentation: string[];
  appPlatforms: string[];
  packageManager: string;
  examples: string[];
  aiSdk: string;
  aiDocs: string[];
  git: string;
  install: string;
  api: string;
  webDeploy: string;
  serverDeploy: string;
  yolo: string;
  rustWebFramework: string;
  rustFrontend: string;
  rustOrm: string;
  rustApi: string;
  rustCli: string;
  rustLibraries: string;
  pythonWebFramework: string;
  pythonOrm: string;
  pythonValidation: string;
  pythonAi: string;
  pythonTaskQueue: string;
  pythonQuality: string;
  goWebFramework: string;
  goOrm: string;
  goApi: string;
  goCli: string;
  goLogging: string;
};

export const DEFAULT_STACK: StackState = {
  ecosystem: "typescript",
  projectName: "my-app",
  webFrontend: ["tanstack-router"],
  nativeFrontend: ["none"],
  astroIntegration: "none",
  runtime: "bun",
  backend: "hono",
  database: "sqlite",
  orm: "drizzle",
  dbSetup: "none",
  auth: "better-auth",
  payments: "none",
  email: "none",
  fileUpload: "none",
  logging: "none",
  observability: "none",
  featureFlags: "none",
  analytics: "none",
  backendLibraries: "none",
  stateManagement: "none",
  forms: "react-hook-form",
  validation: "zod",
  testing: "vitest",
  realtime: "none",
  jobQueue: "none",
  caching: "none",
  animation: "none",
  cssFramework: "tailwind",
  uiLibrary: "shadcn-ui",
  shadcnBase: "radix",
  shadcnStyle: "nova",
  shadcnIconLibrary: "lucide",
  shadcnColorTheme: "neutral",
  shadcnBaseColor: "neutral",
  shadcnFont: "inter",
  shadcnRadius: "default",
  cms: "none",
  search: "none",
  fileStorage: "none",
  codeQuality: [],
  documentation: [],
  appPlatforms: ["turborepo"],
  packageManager: "bun",
  examples: [],
  aiSdk: "vercel-ai",
  aiDocs: ["claude-md"],
  git: "true",
  install: "true",
  api: "trpc",
  webDeploy: "none",
  serverDeploy: "none",
  yolo: "false",
  rustWebFramework: "axum",
  rustFrontend: "none",
  rustOrm: "sea-orm",
  rustApi: "none",
  rustCli: "none",
  rustLibraries: "serde",
  pythonWebFramework: "fastapi",
  pythonOrm: "sqlalchemy",
  pythonValidation: "pydantic",
  pythonAi: "none",
  pythonTaskQueue: "none",
  pythonQuality: "ruff",
  goWebFramework: "gin",
  goOrm: "gorm",
  goApi: "none",
  goCli: "none",
  goLogging: "zap",
};

export const isStackDefault = <K extends keyof StackState>(
  stack: StackState,
  key: K,
  value: StackState[K],
): boolean => {
  const defaultValue = DEFAULT_STACK[key];

  if (stack.backend === "convex") {
    if (key === "runtime" && value === "none") return true;
    if (key === "database" && value === "none") return true;
    if (key === "orm" && value === "none") return true;
    if (key === "api" && value === "none") return true;
    if (key === "auth" && value === "none") return true;
    if (key === "dbSetup" && value === "none") return true;
  }

  if (
    key === "webFrontend" ||
    key === "nativeFrontend" ||
    key === "codeQuality" ||
    key === "documentation" ||
    key === "appPlatforms" ||
    key === "examples" ||
    key === "aiDocs"
  ) {
    if (Array.isArray(defaultValue) && Array.isArray(value)) {
      const sortedDefault = [...defaultValue].sort();
      const sortedValue = [...value].sort();
      return (
        sortedDefault.length === sortedValue.length &&
        sortedDefault.every((item, index) => item === sortedValue[index])
      );
    }
  }

  if (Array.isArray(defaultValue) && Array.isArray(value)) {
    const sortedDefault = [...defaultValue].sort();
    const sortedValue = [...value].sort();
    return (
      sortedDefault.length === sortedValue.length &&
      sortedDefault.every((item, index) => item === sortedValue[index])
    );
  }

  return defaultValue === value;
};
