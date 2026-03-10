import { describe, expect, it } from "bun:test";

import type { ProjectConfig } from "../src/types";

import { generateReproducibleCommand } from "../src/utils/generate-reproducible-command";

function makeConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    projectName: "my-app",
    projectDir: "/tmp/my-app",
    relativePath: "my-app",
    ecosystem: "typescript",
    database: "sqlite",
    orm: "drizzle",
    backend: "hono",
    runtime: "bun",
    frontend: ["tanstack-router"],
    addons: ["turborepo"],
    examples: [],
    auth: "better-auth",
    payments: "none",
    git: true,
    packageManager: "bun",
    install: true,
    dbSetup: "none",
    api: "trpc",
    webDeploy: "none",
    serverDeploy: "none",
    ai: "none",
    effect: "none",
    stateManagement: "none",
    forms: "react-hook-form",
    testing: "vitest",
    email: "none",
    cssFramework: "tailwind",
    uiLibrary: "shadcn-ui",
    shadcnBase: "radix",
    shadcnStyle: "nova",
    shadcnIconLibrary: "lucide",
    shadcnColorTheme: "neutral",
    shadcnBaseColor: "neutral",
    shadcnFont: "inter",
    shadcnRadius: "default",
    validation: "zod",
    realtime: "none",
    jobQueue: "none",
    animation: "none",
    fileUpload: "none",
    logging: "none",
    observability: "none",
    featureFlags: "none",
    analytics: "none",
    cms: "none",
    caching: "none",
    search: "none",
    fileStorage: "none",
    rustWebFramework: "none",
    rustFrontend: "none",
    rustOrm: "none",
    rustApi: "none",
    rustCli: "none",
    rustLibraries: [],
    pythonWebFramework: "none",
    pythonOrm: "none",
    pythonValidation: "none",
    pythonAi: [],
    pythonTaskQueue: "none",
    pythonQuality: "none",
    goWebFramework: "none",
    goOrm: "none",
    goApi: "none",
    goCli: "none",
    goLogging: "none",
    aiDocs: ["claude-md"],
    ...overrides,
  };
}

describe("generateReproducibleCommand", () => {
  it("generates a Python command with explicit none selections", () => {
    const config = makeConfig({
      ecosystem: "python",
      frontend: [],
      addons: [],
      auth: "none",
      packageManager: "bun",
      install: false,
      git: false,
      database: "none",
      orm: "none",
      backend: "none",
      runtime: "none",
      api: "none",
      payments: "none",
      email: "none",
      fileUpload: "none",
      effect: "none",
      stateManagement: "none",
      forms: "none",
      testing: "none",
      validation: "none",
      cssFramework: "none",
      uiLibrary: "none",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      search: "none",
      fileStorage: "none",
      pythonWebFramework: "django",
      pythonOrm: "sqlalchemy",
      pythonValidation: "pydantic",
      pythonAi: [],
      pythonTaskQueue: "celery",
      pythonQuality: "ruff",
      aiDocs: ["claude-md"],
    });

    expect(generateReproducibleCommand(config)).toBe(
      "bun create better-fullstack@latest my-app " +
        "--ecosystem python " +
        "--python-web-framework django " +
        "--python-orm sqlalchemy " +
        "--python-validation pydantic " +
        "--python-ai none " +
        "--python-task-queue celery " +
        "--python-quality ruff " +
        "--addons none " +
        "--examples none " +
        "--db-setup none " +
        "--web-deploy none " +
        "--server-deploy none " +
        "--ai-docs claude-md " +
        "--no-git " +
        "--package-manager bun " +
        "--no-install",
    );
  });

  it("generates a populated Python command without TypeScript flags", () => {
    const config = makeConfig({
      ecosystem: "python",
      frontend: [],
      addons: ["skills"],
      auth: "none",
      packageManager: "npm",
      install: false,
      git: false,
      database: "none",
      orm: "none",
      backend: "none",
      runtime: "none",
      api: "none",
      payments: "none",
      email: "none",
      fileUpload: "none",
      effect: "none",
      stateManagement: "none",
      forms: "none",
      testing: "none",
      validation: "none",
      cssFramework: "none",
      uiLibrary: "none",
      realtime: "none",
      jobQueue: "none",
      animation: "none",
      logging: "none",
      observability: "none",
      cms: "none",
      caching: "none",
      search: "none",
      fileStorage: "none",
      pythonWebFramework: "fastapi",
      pythonOrm: "sqlmodel",
      pythonValidation: "pydantic",
      pythonAi: ["langchain", "openai-sdk"],
      pythonTaskQueue: "celery",
      pythonQuality: "ruff",
      aiDocs: ["claude-md", "agents-md"],
    });

    const command = generateReproducibleCommand(config);

    expect(command).toBe(
      "npx create-better-fullstack@latest my-app " +
        "--ecosystem python " +
        "--python-web-framework fastapi " +
        "--python-orm sqlmodel " +
        "--python-validation pydantic " +
        "--python-ai langchain openai-sdk " +
        "--python-task-queue celery " +
        "--python-quality ruff " +
        "--addons skills " +
        "--examples none " +
        "--db-setup none " +
        "--web-deploy none " +
        "--server-deploy none " +
        "--ai-docs claude-md agents-md " +
        "--no-git " +
        "--package-manager npm " +
        "--no-install",
    );
    expect(command).not.toContain("--frontend");
  });

  it("generates a Rust command with its own ecosystem flags", () => {
    const config = makeConfig({
      ecosystem: "rust",
      frontend: [],
      addons: [],
      auth: "none",
      packageManager: "pnpm",
      rustWebFramework: "axum",
      rustFrontend: "leptos",
      rustOrm: "sqlx",
      rustApi: "tonic",
      rustCli: "clap",
      rustLibraries: ["serde", "validator"],
      aiDocs: [],
    });

    expect(generateReproducibleCommand(config)).toBe(
      "pnpm create better-fullstack@latest my-app " +
        "--ecosystem rust " +
        "--rust-web-framework axum " +
        "--rust-frontend leptos " +
        "--rust-orm sqlx " +
        "--rust-api tonic " +
        "--rust-cli clap " +
        "--rust-libraries serde validator " +
        "--addons none " +
        "--examples none " +
        "--db-setup none " +
        "--web-deploy none " +
        "--server-deploy none " +
        "--ai-docs none " +
        "--git " +
        "--package-manager pnpm " +
        "--install",
    );
  });

  it("generates a Go command with the Go auth/runtime selections", () => {
    const config = makeConfig({
      ecosystem: "go",
      frontend: [],
      addons: [],
      auth: "go-better-auth",
      packageManager: "bun",
      install: false,
      git: false,
      goWebFramework: "gin",
      goOrm: "gorm",
      goApi: "grpc-go",
      goCli: "cobra",
      goLogging: "zap",
      aiDocs: ["agents-md"],
    });

    expect(generateReproducibleCommand(config)).toBe(
      "bun create better-fullstack@latest my-app " +
        "--ecosystem go " +
        "--go-web-framework gin " +
        "--go-orm gorm " +
        "--go-api grpc-go " +
        "--go-cli cobra " +
        "--go-logging zap " +
        "--auth go-better-auth " +
        "--addons none " +
        "--examples none " +
        "--db-setup none " +
        "--web-deploy none " +
        "--server-deploy none " +
        "--ai-docs agents-md " +
        "--no-git " +
        "--package-manager bun " +
        "--no-install",
    );
  });
});
