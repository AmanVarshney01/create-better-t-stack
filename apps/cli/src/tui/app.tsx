/**
 * TUI Entry Point using @opentui/react
 * Stacked prompt design EXACTLY matching src/prompts/*
 */
import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard, useTerminalDimensions } from "@opentui/react";
import { useState, useCallback, useEffect } from "react";
import type {
  ProjectConfig,
  Frontend,
  Backend,
  Runtime,
  Database,
  ORM,
  API,
  Auth,
  Payments,
  Addons,
  Examples,
  DatabaseSetup,
  WebDeploy,
  ServerDeploy,
  PackageManager,
} from "../types";
import { getDefaultConfig, DEFAULT_CONFIG } from "../constants";

// Dark theme
const theme = {
  bg: "#111111",
  surface: "#1a1a1a",
  text: "#e4e4e7",
  subtext: "#a1a1aa",
  muted: "#52525b",
  primary: "#8b5cf6",
  success: "#22c55e",
  error: "#ef4444",
  border: "#27272a",
};

export interface TuiOptions {
  initialConfig?: Partial<ProjectConfig>;
  onComplete: (config: ProjectConfig) => Promise<void>;
  onCancel: () => void;
}

interface StepConfig {
  id: string;
  title: string;
  type: "input" | "select" | "multiselect" | "confirm";
  skip?: (config: any) => boolean;
  getDefault?: (config: any) => any;
  getOptions?: (config: any) => { name: string; value: string; hint?: string }[];
  options?: { name: string; value: string; hint?: string }[];
}

// Steps EXACTLY matching config-prompts.ts order
const STEPS: StepConfig[] = [
  // Project Name
  { id: "projectName", title: "Project name", type: "input" },

  // Frontend - first asks for project type (web/native)
  {
    id: "projectType",
    title: "Select project type",
    type: "multiselect",
    options: [
      { name: "Web", value: "web", hint: "React, Vue or Svelte Web Application" },
      { name: "Native", value: "native", hint: "Create a React Native/Expo app" },
    ],
  },

  // Web Framework - matching frontend.ts exactly
  {
    id: "webFramework",
    title: "Choose web",
    type: "select",
    skip: (c) => !c.projectType?.includes("web"),
    options: [
      {
        name: "TanStack Router",
        value: "tanstack-router",
        hint: "Modern and scalable routing for React Applications",
      },
      {
        name: "React Router",
        value: "react-router",
        hint: "A user‑obsessed, standards‑focused, multi‑strategy router",
      },
      { name: "Next.js", value: "next", hint: "The React Framework for the Web" },
      { name: "Nuxt", value: "nuxt", hint: "The Progressive Web Framework for Vue.js" },
      { name: "Svelte", value: "svelte", hint: "web development for the rest of us" },
      {
        name: "Solid",
        value: "solid",
        hint: "Simple and performant reactivity for building user interfaces",
      },
      {
        name: "TanStack Start",
        value: "tanstack-start",
        hint: "SSR, Server Functions, API Routes and more with TanStack Router",
      },
    ],
  },

  // Native Framework - matching frontend.ts exactly
  {
    id: "nativeFramework",
    title: "Choose native",
    type: "select",
    skip: (c) => !c.projectType?.includes("native"),
    options: [
      { name: "Bare", value: "native-bare", hint: "Bare Expo without styling library" },
      {
        name: "Uniwind",
        value: "native-uniwind",
        hint: "Fastest Tailwind bindings for React Native with HeroUI Native",
      },
      { name: "Unistyles", value: "native-unistyles", hint: "Consistent styling for React Native" },
    ],
  },

  // Backend - matching backend.ts exactly
  {
    id: "backend",
    title: "Select backend",
    type: "select",
    getOptions: (c) => {
      const frontends = c.frontend || [];
      const hasFullstack = frontends.some((f: string) => ["next", "tanstack-start"].includes(f));
      const hasSolid = frontends.some((f: string) => f === "solid");

      const opts = [];
      if (hasFullstack) {
        opts.push({
          name: "Self (Fullstack)",
          value: "self",
          hint: "Use frontend's built-in api routes",
        });
      }
      opts.push(
        { name: "Hono", value: "hono", hint: "Lightweight, ultrafast web framework" },
        {
          name: "Express",
          value: "express",
          hint: "Fast, unopinionated, minimalist web framework for Node.js",
        },
        { name: "Fastify", value: "fastify", hint: "Fast, low-overhead web framework for Node.js" },
        {
          name: "Elysia",
          value: "elysia",
          hint: "Ergonomic web framework for building backend servers",
        },
      );
      if (!hasSolid) {
        opts.push({
          name: "Convex",
          value: "convex",
          hint: "Reactive backend-as-a-service platform",
        });
      }
      opts.push({ name: "None", value: "none", hint: "No backend server" });
      return opts;
    },
  },

  // Runtime - matching runtime.ts exactly
  {
    id: "runtime",
    title: "Select runtime",
    type: "select",
    skip: (c) => c.backend === "none" || c.backend === "convex" || c.backend === "self",
    getDefault: () => "none",
    getOptions: (c) => {
      const opts = [
        { name: "Bun", value: "bun", hint: "Fast all-in-one JavaScript runtime" },
        { name: "Node.js", value: "node", hint: "Traditional Node.js runtime" },
      ];
      if (c.backend === "hono") {
        opts.push({
          name: "Cloudflare Workers",
          value: "workers",
          hint: "Edge runtime on Cloudflare's global network",
        });
      }
      return opts;
    },
  },

  // Database - matching database.ts exactly
  {
    id: "database",
    title: "Select database",
    type: "select",
    skip: (c) => c.backend === "none" || c.backend === "convex",
    getDefault: () => "none",
    getOptions: (c) => {
      const opts = [
        { name: "None", value: "none", hint: "No database setup" },
        {
          name: "SQLite",
          value: "sqlite",
          hint: "lightweight, server-less, embedded relational database",
        },
        {
          name: "PostgreSQL",
          value: "postgres",
          hint: "powerful, open source object-relational database system",
        },
        { name: "MySQL", value: "mysql", hint: "popular open-source relational database system" },
      ];
      if (c.runtime !== "workers") {
        opts.push({
          name: "MongoDB",
          value: "mongodb",
          hint: "open-source NoSQL database that stores data in JSON-like documents",
        });
      }
      return opts;
    },
  },

  // ORM - matching orm.ts exactly
  {
    id: "orm",
    title: "Select ORM",
    type: "select",
    skip: (c) => c.database === "none" || c.backend === "convex",
    getDefault: () => "none",
    getOptions: (c) => {
      if (c.database === "mongodb") {
        return [
          { name: "Prisma", value: "prisma", hint: "Powerful, feature-rich ORM" },
          { name: "Mongoose", value: "mongoose", hint: "Elegant object modeling tool" },
        ];
      }
      return [
        { name: "Drizzle", value: "drizzle", hint: "Lightweight and performant TypeScript ORM" },
        { name: "Prisma", value: "prisma", hint: "Powerful, feature-rich ORM" },
      ];
    },
  },

  // API - matching api.ts exactly
  {
    id: "api",
    title: "Select API type",
    type: "select",
    skip: (c) => c.backend === "none" || c.backend === "convex",
    getDefault: () => "none",
    options: [
      { name: "tRPC", value: "trpc", hint: "End-to-end typesafe APIs made easy" },
      {
        name: "oRPC",
        value: "orpc",
        hint: "End-to-end type-safe APIs that adhere to OpenAPI standards",
      },
      {
        name: "None",
        value: "none",
        hint: "No API layer (e.g. for full-stack frameworks with Route Handlers)",
      },
    ],
  },

  // Auth - matching auth.ts exactly
  {
    id: "auth",
    title: "Select authentication provider",
    type: "select",
    skip: (c) => c.backend === "none",
    getDefault: () => "none",
    getOptions: (c) => {
      if (c.backend === "convex") {
        const frontends = c.frontend || [];
        const opts = [];
        const supportsBetterAuth = frontends.some((f: string) =>
          [
            "tanstack-router",
            "tanstack-start",
            "next",
            "native-bare",
            "native-uniwind",
            "native-unistyles",
          ].includes(f),
        );
        const supportsClerk = frontends.some((f: string) =>
          [
            "react-router",
            "tanstack-router",
            "tanstack-start",
            "next",
            "native-bare",
            "native-uniwind",
            "native-unistyles",
          ].includes(f),
        );
        if (supportsBetterAuth) {
          opts.push({
            name: "Better-Auth",
            value: "better-auth",
            hint: "comprehensive auth framework for TypeScript",
          });
        }
        if (supportsClerk) {
          opts.push({
            name: "Clerk",
            value: "clerk",
            hint: "More than auth, Complete User Management",
          });
        }
        opts.push({ name: "None", value: "none", hint: "No auth" });
        return opts;
      }
      return [
        {
          name: "Better-Auth",
          value: "better-auth",
          hint: "comprehensive auth framework for TypeScript",
        },
        { name: "None", value: "none" },
      ];
    },
  },

  // Payments - matching payments.ts exactly
  {
    id: "payments",
    title: "Select payments provider",
    type: "select",
    skip: (c) => {
      if (c.backend === "none") return true;
      if (c.auth !== "better-auth") return true;
      if (c.backend === "convex") return true;
      const frontends = c.frontend || [];
      const hasWeb = frontends.some((f: string) =>
        [
          "tanstack-router",
          "react-router",
          "next",
          "nuxt",
          "svelte",
          "solid",
          "tanstack-start",
        ].includes(f),
      );
      if (frontends.length > 0 && !hasWeb) return true;
      return false;
    },
    getDefault: () => "none",
    options: [
      {
        name: "Polar",
        value: "polar",
        hint: "Turn your software into a business. 6 lines of code.",
      },
      { name: "None", value: "none", hint: "No payments integration" },
    ],
  },

  // Addons - matching addons.ts exactly (grouped)
  {
    id: "addons",
    title: "Select addons",
    type: "multiselect",
    options: [
      // Documentation
      { name: "Starlight", value: "starlight", hint: "Build stellar docs with astro" },
      { name: "Fumadocs", value: "fumadocs", hint: "Build excellent documentation site" },
      // Linting
      { name: "Biome", value: "biome", hint: "Format, lint, and more" },
      { name: "Oxlint", value: "oxlint", hint: "Oxlint + Oxfmt (linting & formatting)" },
      {
        name: "Ultracite",
        value: "ultracite",
        hint: "Zero-config Biome preset with AI integration",
      },
      // Other
      { name: "Ruler", value: "ruler", hint: "Centralize your AI rules" },
      { name: "PWA", value: "pwa", hint: "Make your app installable and work offline" },
      { name: "Tauri", value: "tauri", hint: "Build native desktop apps from your web frontend" },
      { name: "Husky", value: "husky", hint: "Modern native Git hooks made easy" },
      { name: "OpenTUI", value: "opentui", hint: "Build terminal user interfaces" },
      { name: "WXT", value: "wxt", hint: "Build browser extensions" },
      { name: "Turborepo", value: "turborepo", hint: "High-performance build system" },
    ],
  },

  // Examples - matching examples.ts exactly
  {
    id: "examples",
    title: "Include examples",
    type: "multiselect",
    skip: (c) => {
      if (c.backend === "none") return true;
      if (c.backend !== "convex") {
        if (c.api === "none" || c.database === "none") return true;
      }
      return false;
    },
    options: [
      { name: "Todo App", value: "todo", hint: "A simple CRUD example app" },
      { name: "AI Chat", value: "ai", hint: "A simple AI chat interface using AI SDK" },
    ],
  },

  // Database Setup - matching database-setup.ts
  {
    id: "dbSetup",
    title: "Select database setup option",
    type: "select",
    skip: (c) => c.database === "none" || c.backend === "convex",
    getDefault: () => "none",
    getOptions: (c) => {
      if (c.database === "sqlite") {
        const opts = [
          { name: "Turso", value: "turso", hint: "SQLite for Production. Powered by libSQL" },
        ];
        if (c.runtime === "workers") {
          opts.push({
            name: "Cloudflare D1",
            value: "d1",
            hint: "Cloudflare's managed, serverless database",
          });
        }
        opts.push({ name: "None", value: "none", hint: "Manual setup" });
        return opts;
      }
      if (c.database === "postgres") {
        return [
          {
            name: "Neon Postgres",
            value: "neon",
            hint: "Serverless Postgres with branching capability",
          },
          { name: "PlanetScale", value: "planetscale", hint: "Postgres & Vitess (MySQL) on NVMe" },
          { name: "Supabase", value: "supabase", hint: "Local Supabase stack (requires Docker)" },
          {
            name: "Prisma Postgres",
            value: "prisma-postgres",
            hint: "Instant Postgres for Global Applications",
          },
          { name: "Docker", value: "docker", hint: "Run locally with docker compose" },
          { name: "None", value: "none", hint: "Manual setup" },
        ];
      }
      if (c.database === "mysql") {
        return [
          { name: "PlanetScale", value: "planetscale", hint: "MySQL on Vitess (NVMe, HA)" },
          { name: "Docker", value: "docker", hint: "Run locally with docker compose" },
          { name: "None", value: "none", hint: "Manual setup" },
        ];
      }
      if (c.database === "mongodb") {
        return [
          {
            name: "MongoDB Atlas",
            value: "mongodb-atlas",
            hint: "The most effective way to deploy MongoDB",
          },
          { name: "Docker", value: "docker", hint: "Run locally with docker compose" },
          { name: "None", value: "none", hint: "Manual setup" },
        ];
      }
      return [{ name: "None", value: "none", hint: "Manual setup" }];
    },
  },

  // Web Deploy - matching web-deploy.ts
  {
    id: "webDeploy",
    title: "Select web deployment",
    type: "select",
    skip: (c) => {
      const frontends = c.frontend || [];
      const hasWeb = frontends.some((f: string) =>
        [
          "tanstack-router",
          "react-router",
          "next",
          "nuxt",
          "svelte",
          "solid",
          "tanstack-start",
        ].includes(f),
      );
      return !hasWeb;
    },
    getDefault: () => "none",
    options: [
      { name: "Alchemy", value: "alchemy", hint: "Deploy to Cloudflare Workers using Alchemy" },
      { name: "None", value: "none", hint: "No deployment" },
    ],
  },

  // Git - matching git.ts (confirm)
  {
    id: "git",
    title: "Initialize git repository?",
    type: "confirm",
  },

  // Package Manager - matching package-manager.ts exactly (NO YARN!)
  {
    id: "packageManager",
    title: "Choose package manager",
    type: "select",
    options: [
      { name: "npm", value: "npm", hint: "Node Package Manager" },
      { name: "pnpm", value: "pnpm", hint: "Fast, disk space efficient package manager" },
      { name: "bun", value: "bun", hint: "All-in-one JavaScript runtime & toolkit" },
    ],
  },

  // Install - matching install.ts (confirm)
  {
    id: "install",
    title: "Install dependencies?",
    type: "confirm",
  },
];

export async function renderTui(options: TuiOptions): Promise<void> {
  const renderer = await createCliRenderer({ exitOnCtrlC: false });

  return new Promise((resolve) => {
    const handleExit = () => {
      options.onCancel();
      process.exit(0);
    };

    createRoot(renderer).render(
      <App
        initialConfig={options.initialConfig}
        onComplete={options.onComplete}
        onExit={handleExit}
      />,
    );
  });
}

// Spinner component using useEffect interval
function Spinner(props: { text: string }) {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((f: number) => (f + 1) % frames.length);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <text>
      <span fg={theme.primary}>{frames[frame]}</span>
      <span fg={theme.text}> {props.text}</span>
    </text>
  );
}

type Phase = "prompts" | "creating" | "done";

function App(props: {
  initialConfig?: Partial<ProjectConfig>;
  onComplete: (config: ProjectConfig) => Promise<void>;
  onExit: () => void;
}) {
  const { width, height } = useTerminalDimensions();
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<any>(props.initialConfig ?? {});
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<Phase>("prompts");
  const [finalConfig, setFinalConfig] = useState<ProjectConfig | null>(null);
  const [creationStatus, setCreationStatus] = useState("Preparing...");

  useKeyboard((key) => {
    if (key.ctrl && key.name === "c") props.onExit();
    // Exit on any key when done
    if (phase === "done" && key.name !== "c") {
      process.exit(0);
    }
  });

  const updateConfig = useCallback((key: string, value: any) => {
    setConfig((prev: any) => {
      const newConfig = { ...prev, [key]: value };
      if (key === "webFramework" || key === "nativeFramework" || key === "projectType") {
        const frontends: string[] = [];
        if (newConfig.webFramework) frontends.push(newConfig.webFramework);
        if (newConfig.nativeFramework) frontends.push(newConfig.nativeFramework);
        newConfig.frontend = frontends.length > 0 ? frontends : [];
      }
      return newConfig;
    });
  }, []);

  const getVisibleSteps = useCallback(() => {
    const visible: { step: StepConfig; index: number }[] = [];
    for (let i = 0; i < STEPS.length; i++) {
      const step = STEPS[i];
      if (!step.skip || !step.skip(config)) visible.push({ step, index: i });
    }
    return visible;
  }, [config]);

  const visibleSteps = getVisibleSteps();
  const currentVisibleIndex = visibleSteps.findIndex((v) => v.index === stepIndex);

  const goNext = useCallback(() => {
    let next = stepIndex + 1;
    while (next < STEPS.length) {
      const step = STEPS[next];
      if (!step.skip || !step.skip(config)) {
        setStepIndex(next);
        return;
      }
      if (step.getDefault) updateConfig(step.id, step.getDefault(config));
      next++;
    }
    setCompleted(true);
  }, [stepIndex, config, updateConfig]);

  const goPrev = useCallback(() => {
    let prev = stepIndex - 1;
    while (prev >= 0) {
      const step = STEPS[prev];
      if (!step.skip || !step.skip(config)) {
        setStepIndex(prev);
        return;
      }
      prev--;
    }
  }, [stepIndex, config]);

  const handleComplete = useCallback(async () => {
    const defaultConfig = getDefaultConfig();
    const cfg: ProjectConfig = {
      ...defaultConfig,
      ...config,
      projectName: config.projectName ?? "my-app",
      projectDir: process.cwd() + "/" + (config.projectName ?? "my-app"),
      relativePath: config.projectName ?? "my-app",
      frontend: config.frontend?.length ? config.frontend : ["tanstack-router"],
      addons: config.addons?.length ? config.addons : ["none"],
      examples: config.examples ?? [],
      git: config.git === true,
      install: config.install === true,
    } as ProjectConfig;

    setFinalConfig(cfg);
    setPhase("creating");
    setCreationStatus("Creating project...");

    try {
      await props.onComplete(cfg);
      setPhase("done");
    } catch (error) {
      setCreationStatus(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }, [config, props.onComplete]);

  const currentStep = STEPS[stepIndex];
  const getValue = (stepId: string) => {
    const val = config[stepId];
    if (typeof val === "boolean") return val ? "yes" : "no";
    if (Array.isArray(val)) return val.length > 0 ? val.join(", ") : "none";
    return val;
  };
  const getOptions = (step: StepConfig) =>
    step.getOptions ? step.getOptions(config) : step.options || [];

  // Get run command for package manager
  const runCmd =
    config.packageManager === "npm"
      ? "npm run"
      : config.packageManager === "pnpm"
        ? "pnpm run"
        : "bun run";

  return (
    <box style={{ width, height, backgroundColor: theme.bg, flexDirection: "column" }}>
      <box
        style={{
          height: 5,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.surface,
        }}
      >
        <ascii-font text="Better T Stack" font="tiny" />
      </box>

      <box
        style={{
          flexGrow: 1,
          flexDirection: "column",
          padding: 1,
          paddingLeft: 2,
          overflow: "scroll",
        }}
      >
        {/* Prompts Phase */}
        {phase === "prompts" && (
          <>
            {visibleSteps.slice(0, currentVisibleIndex).map(({ step }) => (
              <box key={step.id} style={{ flexDirection: "row" }}>
                <text>
                  <span fg={theme.success}>◆</span>
                  <span fg={theme.muted}> {step.title}: </span>
                  <span fg={theme.text}>{getValue(step.id) || "none"}</span>
                </text>
              </box>
            ))}

            {!completed && currentStep && (
              <box style={{ marginTop: 1 }}>
                <box style={{ flexDirection: "row", marginBottom: 1 }}>
                  <text>
                    <span fg={theme.primary}>◇</span>
                    <span fg={theme.text}> {currentStep.title}</span>
                  </text>
                </box>
                {currentStep.type === "input" && (
                  <InputPrompt
                    onSubmit={(v) => {
                      updateConfig(currentStep.id, v);
                      if (currentStep.id === "projectName") {
                        updateConfig("projectDir", process.cwd() + "/" + v);
                        updateConfig("relativePath", v);
                      }
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
                {currentStep.type === "select" && (
                  <SelectPrompt
                    options={getOptions(currentStep)}
                    onSelect={(v) => {
                      updateConfig(currentStep.id, v);
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
                {currentStep.type === "multiselect" && (
                  <MultiSelectPrompt
                    options={getOptions(currentStep)}
                    selected={config[currentStep.id] ?? []}
                    onSubmit={(v) => {
                      updateConfig(
                        currentStep.id,
                        v.length > 0 ? v : currentStep.id === "projectType" ? ["web"] : [],
                      );
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
                {currentStep.type === "confirm" && (
                  <ConfirmPrompt
                    onSubmit={(v) => {
                      updateConfig(currentStep.id, v);
                      goNext();
                    }}
                    onBack={stepIndex > 0 ? goPrev : undefined}
                  />
                )}
              </box>
            )}

            {completed && (
              <ConfirmStep
                config={config}
                onComplete={handleComplete}
                onBack={() => setCompleted(false)}
              />
            )}

            {!completed &&
              visibleSteps.slice(currentVisibleIndex + 1).map(({ step }) => (
                <box key={step.id} style={{ flexDirection: "row" }}>
                  <text>
                    <span fg={theme.muted}>○ {step.title}</span>
                  </text>
                </box>
              ))}
          </>
        )}

        {/* Creating Phase - Show spinner */}
        {phase === "creating" && (
          <box style={{ flexDirection: "column", marginTop: 2 }}>
            <Spinner text={creationStatus} />
            <box style={{ marginTop: 2 }}>
              <text>
                <span fg={theme.muted}>Creating </span>
                <span fg={theme.primary}>{config.projectName}</span>
                <span fg={theme.muted}>...</span>
              </text>
            </box>
          </box>
        )}

        {/* Done Phase - Show post-installation */}
        {phase === "done" && finalConfig && (
          <box style={{ flexDirection: "column" }}>
            <text>
              <span fg={theme.success}>✓</span>
              <span fg={theme.text}> Project created successfully!</span>
            </text>

            <box style={{ marginTop: 2 }}>
              <text>
                <span fg={theme.text}>Next steps:</span>
              </text>
            </box>

            <box style={{ paddingLeft: 2, marginTop: 1, flexDirection: "column" }}>
              <text>
                <span fg={theme.primary}>1.</span>
                <span fg={theme.text}> cd {finalConfig.relativePath}</span>
              </text>
              {!finalConfig.install && (
                <text>
                  <span fg={theme.primary}>2.</span>
                  <span fg={theme.text}> {finalConfig.packageManager} install</span>
                </text>
              )}
              <text>
                <span fg={theme.primary}>{finalConfig.install ? "2" : "3"}.</span>
                <span fg={theme.text}> {runCmd} dev</span>
              </text>
            </box>

            <box style={{ marginTop: 2 }}>
              <text>
                <span fg={theme.text}>Your project will be available at:</span>
              </text>
            </box>
            <box style={{ paddingLeft: 2, marginTop: 1, flexDirection: "column" }}>
              <text>
                <span fg={theme.primary}>•</span>
                <span fg={theme.text}> Frontend: http://localhost:3001</span>
              </text>
              {finalConfig.backend !== "none" &&
                finalConfig.backend !== "self" &&
                finalConfig.backend !== "convex" && (
                  <text>
                    <span fg={theme.primary}>•</span>
                    <span fg={theme.text}> Backend: http://localhost:3000</span>
                  </text>
                )}
            </box>

            <box style={{ marginTop: 3 }}>
              <text>
                <span fg={theme.success}>★</span>
                <span fg={theme.text}> Like Better-T-Stack? Give us a star on GitHub!</span>
              </text>
            </box>
            <box style={{ paddingLeft: 2 }}>
              <text>
                <span fg={theme.primary}>
                  https://github.com/AmanVarshney01/create-better-t-stack
                </span>
              </text>
            </box>

            <box style={{ marginTop: 3 }}>
              <text>
                <span fg={theme.muted}>Press any key to exit...</span>
              </text>
            </box>
          </box>
        )}
      </box>

      <box
        style={{
          height: 1,
          backgroundColor: theme.surface,
          paddingLeft: 2,
          paddingRight: 2,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <text>
          <span fg={theme.muted}>ctrl+c</span>
          <span fg={theme.subtext}> exit</span>
        </text>
        <text>
          <span fg={theme.primary}>better-t-stack.dev</span>
        </text>
      </box>
    </box>
  );
}

function InputPrompt(props: { onSubmit: (v: string) => void; onBack?: () => void }) {
  useKeyboard((key) => {
    if (key.name === "escape" && props.onBack) props.onBack();
  });
  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      <box
        style={{
          border: true,
          borderColor: theme.border,
          height: 3,
          width: 40,
          backgroundColor: theme.surface,
        }}
      >
        <input
          placeholder="my-app"
          focused
          onSubmit={(v: string) => props.onSubmit(v || "my-app")}
        />
      </box>
      <text>
        <span fg={theme.muted}>↵ confirm{props.onBack ? "  esc back" : ""}</span>
      </text>
    </box>
  );
}

function SelectPrompt(props: {
  options: { name: string; value: string; hint?: string }[];
  onSelect: (v: string) => void;
  onBack?: () => void;
}) {
  const [i, setI] = useState(0);
  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") setI((x: number) => Math.max(0, x - 1));
    else if (key.name === "down" || key.name === "j")
      setI((x: number) => Math.min(props.options.length - 1, x + 1));
    else if (key.name === "return") props.onSelect(props.options[i].value);
    else if (key.name === "escape" && props.onBack) props.onBack();
  });
  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      {props.options.map((o, idx) => (
        <text key={o.value}>
          <span fg={idx === i ? theme.primary : theme.muted}>{idx === i ? "❯ " : "  "}</span>
          <span fg={idx === i ? theme.text : theme.subtext}>{o.name}</span>
          {o.hint && <span fg={theme.muted}> · {o.hint}</span>}
        </text>
      ))}
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>↑↓ navigate ↵ select{props.onBack ? "  esc back" : ""}</span>
        </text>
      </box>
    </box>
  );
}

function MultiSelectPrompt(props: {
  options: { name: string; value: string; hint?: string }[];
  selected: string[];
  onSubmit: (v: string[]) => void;
  onBack?: () => void;
}) {
  const [i, setI] = useState(0);
  const [sel, setSel] = useState<string[]>(props.selected);
  useKeyboard((key) => {
    if (key.name === "up" || key.name === "k") setI((x: number) => Math.max(0, x - 1));
    else if (key.name === "down" || key.name === "j")
      setI((x: number) => Math.min(props.options.length - 1, x + 1));
    else if (key.name === "space") {
      const v = props.options[i].value;
      setSel((s: string[]) => (s.includes(v) ? s.filter((x: string) => x !== v) : [...s, v]));
    } else if (key.name === "return") props.onSubmit(sel);
    else if (key.name === "escape" && props.onBack) props.onBack();
  });
  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      {props.options.map((o, idx) => (
        <text key={o.value}>
          <span fg={idx === i ? theme.primary : theme.muted}>{idx === i ? "❯ " : "  "}</span>
          <span fg={sel.includes(o.value) ? theme.success : theme.muted}>
            {sel.includes(o.value) ? "◉ " : "○ "}
          </span>
          <span fg={idx === i ? theme.text : theme.subtext}>{o.name}</span>
          {o.hint && <span fg={theme.muted}> · {o.hint}</span>}
        </text>
      ))}
      {sel.length > 0 && (
        <text>
          <span fg={theme.success}>Selected: {sel.join(", ")}</span>
        </text>
      )}
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>
            ↑↓ navigate space toggle ↵ confirm{props.onBack ? "  esc back" : ""}
          </span>
        </text>
      </box>
    </box>
  );
}

function ConfirmPrompt(props: { onSubmit: (v: boolean) => void; onBack?: () => void }) {
  const [yes, setYes] = useState(true);
  useKeyboard((key) => {
    if (key.name === "left" || key.name === "right" || key.name === "h" || key.name === "l")
      setYes((v: boolean) => !v);
    else if (key.name === "return") props.onSubmit(yes);
    else if (key.name === "escape" && props.onBack) props.onBack();
  });
  return (
    <box style={{ flexDirection: "column", paddingLeft: 2 }}>
      <box style={{ flexDirection: "row" }}>
        <text>
          <span fg={yes ? theme.success : theme.muted}>{yes ? "● " : "○ "}</span>
          <span fg={yes ? theme.text : theme.subtext}>Yes</span>
        </text>
        <text>
          <span fg={theme.muted}> / </span>
        </text>
        <text>
          <span fg={!yes ? theme.error : theme.muted}>{!yes ? "● " : "○ "}</span>
          <span fg={!yes ? theme.text : theme.subtext}>No</span>
        </text>
      </box>
      <box style={{ marginTop: 1 }}>
        <text>
          <span fg={theme.muted}>←→ toggle ↵ confirm{props.onBack ? "  esc back" : ""}</span>
        </text>
      </box>
    </box>
  );
}

function ConfirmStep(props: { config: any; onComplete: () => void; onBack: () => void }) {
  useKeyboard((key) => {
    if (key.name === "return") props.onComplete();
    else if (key.name === "escape") props.onBack();
  });
  return (
    <box style={{ flexDirection: "column", marginTop: 1 }}>
      <text>
        <span fg={theme.success}>◆</span>
        <span fg={theme.text}> Ready to create {props.config.projectName}</span>
      </text>
      <box style={{ marginTop: 1, paddingLeft: 2 }}>
        <text>
          <span fg={theme.primary}>❯ </span>
          <span fg={theme.text}>Press Enter to create project</span>
        </text>
      </box>
      <box style={{ marginTop: 1, paddingLeft: 2 }}>
        <text>
          <span fg={theme.muted}>↵ create esc back</span>
        </text>
      </box>
    </box>
  );
}
