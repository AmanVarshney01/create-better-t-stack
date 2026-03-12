import {
  AI_DOCS_VALUES,
  AI_VALUES,
  ANALYTICS_VALUES,
  ANIMATION_VALUES,
  API_VALUES,
  ASTRO_INTEGRATION_VALUES,
  AUTH_VALUES,
  CACHING_VALUES,
  CMS_VALUES,
  CSS_FRAMEWORK_VALUES,
  DATABASE_SETUP_VALUES,
  DATABASE_VALUES,
  EFFECT_VALUES,
  EMAIL_VALUES,
  FEATURE_FLAGS_VALUES,
  FILE_STORAGE_VALUES,
  FILE_UPLOAD_VALUES,
  FORMS_VALUES,
  GO_API_VALUES,
  GO_CLI_VALUES,
  GO_LOGGING_VALUES,
  GO_ORM_VALUES,
  GO_WEB_FRAMEWORK_VALUES,
  JOB_QUEUE_VALUES,
  LOGGING_VALUES,
  OBSERVABILITY_VALUES,
  ORM_VALUES,
  PACKAGE_MANAGER_VALUES,
  PAYMENTS_VALUES,
  PYTHON_AI_VALUES,
  PYTHON_ORM_VALUES,
  PYTHON_QUALITY_VALUES,
  PYTHON_TASK_QUEUE_VALUES,
  PYTHON_VALIDATION_VALUES,
  PYTHON_WEB_FRAMEWORK_VALUES,
  REALTIME_VALUES,
  RUNTIME_VALUES,
  RUST_API_VALUES,
  RUST_CLI_VALUES,
  RUST_FRONTEND_VALUES,
  RUST_LIBRARIES_VALUES,
  RUST_ORM_VALUES,
  RUST_WEB_FRAMEWORK_VALUES,
  SEARCH_VALUES,
  SHADCN_BASE_COLOR_VALUES,
  SHADCN_BASE_VALUES,
  SHADCN_COLOR_THEME_VALUES,
  SHADCN_FONT_VALUES,
  SHADCN_ICON_LIBRARY_VALUES,
  SHADCN_RADIUS_VALUES,
  SHADCN_STYLE_VALUES,
  SERVER_DEPLOY_VALUES,
  STATE_MANAGEMENT_VALUES,
  TESTING_VALUES,
  UI_LIBRARY_VALUES,
  VALIDATION_VALUES,
  WEB_DEPLOY_VALUES,
} from "./schemas";
import { getCapabilityDefinitions } from "./capabilities";

export type OptionCategory =
  | "api"
  | "webFrontend"
  | "nativeFrontend"
  | "astroIntegration"
  | "runtime"
  | "backend"
  | "database"
  | "orm"
  | "dbSetup"
  | "webDeploy"
  | "serverDeploy"
  | "auth"
  | "payments"
  | "email"
  | "fileUpload"
  | "logging"
  | "observability"
  | "backendLibraries"
  | "stateManagement"
  | "forms"
  | "validation"
  | "testing"
  | "realtime"
  | "jobQueue"
  | "caching"
  | "search"
  | "fileStorage"
  | "animation"
  | "cssFramework"
  | "uiLibrary"
  | "cms"
  | "featureFlags"
  | "analytics"
  | "codeQuality"
  | "documentation"
  | "appPlatforms"
  | "packageManager"
  | "examples"
  | "ai"
  | "aiDocs"
  | "git"
  | "install"
  | "effect"
  | "shadcnBase"
  | "shadcnStyle"
  | "shadcnIconLibrary"
  | "shadcnColorTheme"
  | "shadcnBaseColor"
  | "shadcnFont"
  | "shadcnRadius"
  | "rustWebFramework"
  | "rustFrontend"
  | "rustOrm"
  | "rustApi"
  | "rustCli"
  | "rustLibraries"
  | "pythonWebFramework"
  | "pythonOrm"
  | "pythonValidation"
  | "pythonAi"
  | "pythonTaskQueue"
  | "pythonQuality"
  | "goWebFramework"
  | "goOrm"
  | "goApi"
  | "goCli"
  | "goLogging";

export type OptionSelectionMode = "single" | "multiple";

export type OptionMetadata = {
  id: string;
  label: string;
  aliases: readonly string[];
  cliValue: string;
};

export type OptionCategoryMetadata = {
  selectionMode: OptionSelectionMode;
  options: readonly OptionMetadata[];
};

const WEB_FRONTEND_VALUES = [
  "tanstack-router",
  "react-router",
  "react-vite",
  "tanstack-start",
  "next",
  "nuxt",
  "svelte",
  "solid",
  "solid-start",
  "astro",
  "qwik",
  "angular",
  "redwood",
  "fresh",
  "none",
] as const satisfies readonly string[];

const NATIVE_FRONTEND_VALUES = [
  "native-bare",
  "native-uniwind",
  "native-unistyles",
  "none",
] as const satisfies readonly string[];

const BACKEND_BUILDER_VALUES = [
  "hono",
  "express",
  "fastify",
  "elysia",
  "fets",
  "nestjs",
  "adonisjs",
  "nitro",
  "encore",
  "convex",
  "self-next",
  "self-tanstack-start",
  "self-astro",
  "self-nuxt",
  "self-svelte",
  "self-solid-start",
  "none",
] as const satisfies readonly string[];

const CODE_QUALITY_VALUES = [
  "biome",
  "oxlint",
  "ultracite",
  "lefthook",
  "husky",
  "ruler",
] as const satisfies readonly string[];

const DOCUMENTATION_VALUES = ["starlight", "fumadocs"] as const satisfies readonly string[];

const APP_PLATFORM_VALUES = [
  "turborepo",
  "pwa",
  "tauri",
  "wxt",
  "opentui",
  "mcp",
  "skills",
  "msw",
  "storybook",
] as const satisfies readonly string[];

const EXAMPLE_VALUES = ["ai", "chat-sdk"] as const satisfies readonly string[];
const BOOLEAN_OPTION_VALUES = ["true", "false"] as const satisfies readonly string[];

const MULTI_SELECT_CATEGORIES = new Set<OptionCategory>([
  "webFrontend",
  "nativeFrontend",
  "codeQuality",
  "documentation",
  "appPlatforms",
  "examples",
  "aiDocs",
]);

const CATEGORY_VALUE_IDS: Record<OptionCategory, readonly string[]> = {
  api: API_VALUES,
  webFrontend: WEB_FRONTEND_VALUES,
  nativeFrontend: NATIVE_FRONTEND_VALUES,
  astroIntegration: ASTRO_INTEGRATION_VALUES,
  runtime: RUNTIME_VALUES,
  backend: BACKEND_BUILDER_VALUES,
  database: DATABASE_VALUES,
  orm: ORM_VALUES,
  dbSetup: DATABASE_SETUP_VALUES,
  webDeploy: WEB_DEPLOY_VALUES,
  serverDeploy: SERVER_DEPLOY_VALUES,
  auth: AUTH_VALUES,
  payments: PAYMENTS_VALUES,
  email: EMAIL_VALUES,
  fileUpload: FILE_UPLOAD_VALUES,
  logging: LOGGING_VALUES,
  observability: OBSERVABILITY_VALUES,
  backendLibraries: EFFECT_VALUES,
  stateManagement: STATE_MANAGEMENT_VALUES,
  forms: FORMS_VALUES,
  validation: VALIDATION_VALUES,
  testing: TESTING_VALUES,
  realtime: REALTIME_VALUES,
  jobQueue: JOB_QUEUE_VALUES,
  caching: CACHING_VALUES,
  search: SEARCH_VALUES,
  fileStorage: FILE_STORAGE_VALUES,
  animation: ANIMATION_VALUES,
  cssFramework: CSS_FRAMEWORK_VALUES,
  uiLibrary: UI_LIBRARY_VALUES,
  cms: CMS_VALUES,
  featureFlags: FEATURE_FLAGS_VALUES,
  analytics: ANALYTICS_VALUES,
  codeQuality: CODE_QUALITY_VALUES,
  documentation: DOCUMENTATION_VALUES,
  appPlatforms: APP_PLATFORM_VALUES,
  packageManager: PACKAGE_MANAGER_VALUES,
  examples: EXAMPLE_VALUES,
  ai: AI_VALUES,
  aiDocs: AI_DOCS_VALUES,
  git: BOOLEAN_OPTION_VALUES,
  install: BOOLEAN_OPTION_VALUES,
  effect: EFFECT_VALUES,
  shadcnBase: SHADCN_BASE_VALUES,
  shadcnStyle: SHADCN_STYLE_VALUES,
  shadcnIconLibrary: SHADCN_ICON_LIBRARY_VALUES,
  shadcnColorTheme: SHADCN_COLOR_THEME_VALUES,
  shadcnBaseColor: SHADCN_BASE_COLOR_VALUES,
  shadcnFont: SHADCN_FONT_VALUES,
  shadcnRadius: SHADCN_RADIUS_VALUES,
  rustWebFramework: RUST_WEB_FRAMEWORK_VALUES,
  rustFrontend: RUST_FRONTEND_VALUES,
  rustOrm: RUST_ORM_VALUES,
  rustApi: RUST_API_VALUES,
  rustCli: RUST_CLI_VALUES,
  rustLibraries: RUST_LIBRARIES_VALUES,
  pythonWebFramework: PYTHON_WEB_FRAMEWORK_VALUES,
  pythonOrm: PYTHON_ORM_VALUES,
  pythonValidation: PYTHON_VALIDATION_VALUES,
  pythonAi: PYTHON_AI_VALUES,
  pythonTaskQueue: PYTHON_TASK_QUEUE_VALUES,
  pythonQuality: PYTHON_QUALITY_VALUES,
  goWebFramework: GO_WEB_FRAMEWORK_VALUES,
  goOrm: GO_ORM_VALUES,
  goApi: GO_API_VALUES,
  goCli: GO_CLI_VALUES,
  goLogging: GO_LOGGING_VALUES,
};

const EXACT_LABEL_OVERRIDES: Partial<Record<OptionCategory, Partial<Record<string, string>>>> = {
  api: { trpc: "tRPC", orpc: "oRPC" },
  webFrontend: {
    next: "Next.js",
    "react-vite": "React + Vite",
    svelte: "SvelteKit",
    redwood: "RedwoodJS",
  },
  nativeFrontend: {
    "native-bare": "Expo + Bare",
    "native-uniwind": "Expo + Uniwind",
    "native-unistyles": "Expo + Unistyles",
  },
  runtime: { node: "Node.js", workers: "Cloudflare Workers" },
  backend: {
    fets: "feTS",
    nestjs: "NestJS",
    encore: "Encore.ts",
    "self-next": "Fullstack Next.js",
    "self-tanstack-start": "Fullstack TanStack Start",
    "self-astro": "Fullstack Astro",
    "self-nuxt": "Fullstack Nuxt",
    "self-svelte": "Fullstack SvelteKit",
    "self-solid-start": "Fullstack SolidStart",
  },
  database: { sqlite: "SQLite", postgres: "PostgreSQL", mongodb: "MongoDB", edgedb: "EdgeDB" },
  orm: {
    typeorm: "TypeORM",
    mikroorm: "MikroORM",
  },
  dbSetup: {
    d1: "Cloudflare D1",
    neon: "Neon Postgres",
    "prisma-postgres": "Prisma PostgreSQL",
    "mongodb-atlas": "MongoDB Atlas",
    planetscale: "PlanetScale",
  },
  webDeploy: { cloudflare: "Cloudflare", fly: "Fly.io", sst: "SST" },
  serverDeploy: { cloudflare: "Cloudflare", fly: "Fly.io", sst: "SST" },
  auth: {},
  payments: {
    "lemon-squeezy": "Lemon Squeezy",
    dodo: "Dodo Payments",
  },
  email: {
    "react-email": "React Email",
    sendgrid: "SendGrid",
    "aws-ses": "AWS SES",
  },
  fileUpload: {
    uploadthing: "UploadThing",
    filepond: "FilePond",
    uppy: "Uppy",
  },
  observability: {
    opentelemetry: "OpenTelemetry",
  },
  backendLibraries: {
    effect: "Effect (Core)",
    "effect-full": "Effect Full",
  },
  stateManagement: {
    "redux-toolkit": "Redux Toolkit",
    xstate: "XState",
  },
  forms: {
    "react-hook-form": "React Hook Form",
    "tanstack-form": "TanStack Form",
    "final-form": "Final Form",
    "modular-forms": "Modular Forms",
  },
  validation: {
    zod: "Zod",
    arktype: "ArkType",
    typebox: "TypeBox",
    "effect-schema": "@effect/schema",
  },
  testing: {
    "vitest-playwright": "Vitest + Playwright",
  },
  realtime: {
    "socket-io": "Socket.IO",
    yjs: "Y.js",
  },
  jobQueue: {
    bullmq: "BullMQ",
    "trigger-dev": "Trigger.dev",
  },
  cssFramework: { tailwind: "Tailwind CSS", scss: "SCSS", "postcss-only": "PostCSS Only" },
  uiLibrary: {
    "shadcn-ui": "shadcn/ui",
    daisyui: "daisyUI",
    "radix-ui": "Radix UI",
    "headless-ui": "Headless UI",
    "park-ui": "Park UI",
    "chakra-ui": "Chakra UI",
    nextui: "NextUI",
    "base-ui": "Base UI",
    "ark-ui": "Ark UI",
    "react-aria": "React Aria",
  },
  featureFlags: {
    growthbook: "GrowthBook",
    posthog: "PostHog",
  },
  analytics: {
    plausible: "Plausible",
    umami: "Umami",
  },
  codeQuality: {
    biome: "Biome",
    oxlint: "Oxlint",
    ultracite: "Ultracite",
    lefthook: "Lefthook",
    husky: "Husky",
    ruler: "Ruler",
  },
  documentation: {
    starlight: "Starlight",
    fumadocs: "Fumadocs",
  },
  appPlatforms: {
    pwa: "PWA",
    wxt: "WXT",
    opentui: "OpenTUI",
    mcp: "MCP",
    msw: "MSW",
  },
  examples: {
    ai: "AI Example",
    "chat-sdk": "Chat SDK Bots",
  },
  ai: {
    "vercel-ai": "Vercel AI SDK",
    voltagent: "VoltAgent",
    langgraph: "LangGraph.js",
    "openai-agents": "OpenAI Agents SDK",
    "google-adk": "Google ADK",
    modelfusion: "ModelFusion",
    langchain: "LangChain",
    llamaindex: "LlamaIndex",
  },
  aiDocs: {
    "claude-md": "CLAUDE.md",
    "agents-md": "Agents.md",
    cursorrules: ".cursorrules",
  },
  git: { true: "Git", false: "No Git" },
  install: { true: "Install Dependencies", false: "Skip Install" },
  effect: {
    effect: "Effect (Core)",
    "effect-full": "Effect Full",
  },
  shadcnBase: {
    radix: "Radix UI",
    base: "Base UI",
  },
  shadcnStyle: {
    vega: "Vega",
    nova: "Nova",
    maia: "Maia",
    lyra: "Lyra",
    mira: "Mira",
  },
  shadcnIconLibrary: {
    lucide: "Lucide",
    tabler: "Tabler Icons",
    hugeicons: "HugeIcons",
    phosphor: "Phosphor Icons",
    remixicon: "Remix Icon",
  },
  shadcnColorTheme: {
    neutral: "Neutral",
  },
  shadcnBaseColor: {
    neutral: "Neutral",
  },
  shadcnFont: {
    inter: "Inter",
    geist: "Geist",
    figtree: "Figtree",
    "noto-sans": "Noto Sans",
    "nunito-sans": "Nunito Sans",
    roboto: "Roboto",
    raleway: "Raleway",
    "dm-sans": "DM Sans",
    "public-sans": "Public Sans",
    outfit: "Outfit",
    "jetbrains-mono": "JetBrains Mono",
    "geist-mono": "Geist Mono",
  },
  shadcnRadius: {
    default: "Default",
  },
  rustWebFramework: {
    axum: "Axum",
    "actix-web": "Actix-web",
  },
  rustFrontend: {
    leptos: "Leptos",
    dioxus: "Dioxus",
  },
  rustOrm: {
    "sea-orm": "SeaORM",
    sqlx: "SQLx",
  },
  rustApi: {
    "async-graphql": "async-graphql",
    tonic: "Tonic",
  },
  rustCli: {
    clap: "Clap",
    ratatui: "Ratatui",
  },
  rustLibraries: {
    serde: "Serde",
    validator: "Validator",
    jsonwebtoken: "jsonwebtoken",
    argon2: "Argon2",
    "tokio-test": "Tokio Test",
    mockall: "Mockall",
  },
  pythonWebFramework: {
    fastapi: "FastAPI",
    django: "Django",
  },
  pythonOrm: {
    sqlalchemy: "SQLAlchemy",
    sqlmodel: "SQLModel",
  },
  pythonValidation: {
    pydantic: "Pydantic",
  },
  pythonAi: {
    langchain: "LangChain",
    llamaindex: "LlamaIndex",
    "openai-sdk": "OpenAI SDK",
    "anthropic-sdk": "Anthropic SDK",
    langgraph: "LangGraph",
    crewai: "CrewAI",
  },
  pythonTaskQueue: {
    celery: "Celery",
  },
  pythonQuality: {
    ruff: "Ruff",
  },
  goWebFramework: {
    gin: "Gin",
    echo: "Echo",
  },
  goOrm: {
    gorm: "GORM",
    sqlc: "sqlc",
  },
  goApi: {
    "grpc-go": "gRPC-Go",
  },
  goCli: {
    cobra: "Cobra",
    bubbletea: "Bubble Tea",
  },
  goLogging: {
    zap: "Zap",
  },
};

const OPTION_ALIASES: Partial<Record<OptionCategory, Partial<Record<string, readonly string[]>>>> = {
  webFrontend: {
    svelte: ["sveltekit"],
  },
  backend: {
    "self-svelte": ["self-sveltekit"],
  },
};

const CLI_VALUE_OVERRIDES: Partial<Record<OptionCategory, Partial<Record<string, string>>>> = {
  backend: {
    "self-next": "self",
    "self-tanstack-start": "self",
    "self-astro": "self",
    "self-nuxt": "self",
    "self-svelte": "self",
    "self-solid-start": "self",
  },
};

const TOKEN_LABELS: Record<string, string> = {
  ai: "AI",
  api: "API",
  auth: "Auth",
  css: "CSS",
  db: "DB",
  graphql: "GraphQL",
  grpc: "gRPC",
  js: "JS",
  md: "MD",
  orm: "ORM",
  sdk: "SDK",
  ses: "SES",
  sql: "SQL",
  ui: "UI",
};

function toStartCaseToken(token: string): string {
  const lower = token.toLowerCase();
  if (TOKEN_LABELS[lower]) return TOKEN_LABELS[lower];
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function humanizeOptionId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map(toStartCaseToken)
    .join(" ");
}

function getOptionLabel(category: OptionCategory, id: string): string {
  if (category === "auth") {
    return getCapabilityDefinitions("auth").find((option) => option.id === id)?.label ?? humanizeOptionId(id);
  }
  return EXACT_LABEL_OVERRIDES[category]?.[id] ?? humanizeOptionId(id);
}

function getOptionAliases(category: OptionCategory, id: string): readonly string[] {
  return OPTION_ALIASES[category]?.[id] ?? [];
}

function getCliValue(category: OptionCategory, id: string): string {
  return CLI_VALUE_OVERRIDES[category]?.[id] ?? id;
}

function buildCategoryMetadata(category: OptionCategory): OptionCategoryMetadata {
  return {
    selectionMode: MULTI_SELECT_CATEGORIES.has(category) ? "multiple" : "single",
    options: CATEGORY_VALUE_IDS[category].map((id) => ({
      id,
      label: getOptionLabel(category, id),
      aliases: getOptionAliases(category, id),
      cliValue: getCliValue(category, id),
    })),
  };
}

export const OPTION_CATEGORY_METADATA: Record<OptionCategory, OptionCategoryMetadata> = {
  api: buildCategoryMetadata("api"),
  webFrontend: buildCategoryMetadata("webFrontend"),
  nativeFrontend: buildCategoryMetadata("nativeFrontend"),
  astroIntegration: buildCategoryMetadata("astroIntegration"),
  runtime: buildCategoryMetadata("runtime"),
  backend: buildCategoryMetadata("backend"),
  database: buildCategoryMetadata("database"),
  orm: buildCategoryMetadata("orm"),
  dbSetup: buildCategoryMetadata("dbSetup"),
  webDeploy: buildCategoryMetadata("webDeploy"),
  serverDeploy: buildCategoryMetadata("serverDeploy"),
  auth: buildCategoryMetadata("auth"),
  payments: buildCategoryMetadata("payments"),
  email: buildCategoryMetadata("email"),
  fileUpload: buildCategoryMetadata("fileUpload"),
  logging: buildCategoryMetadata("logging"),
  observability: buildCategoryMetadata("observability"),
  backendLibraries: buildCategoryMetadata("backendLibraries"),
  stateManagement: buildCategoryMetadata("stateManagement"),
  forms: buildCategoryMetadata("forms"),
  validation: buildCategoryMetadata("validation"),
  testing: buildCategoryMetadata("testing"),
  realtime: buildCategoryMetadata("realtime"),
  jobQueue: buildCategoryMetadata("jobQueue"),
  caching: buildCategoryMetadata("caching"),
  search: buildCategoryMetadata("search"),
  fileStorage: buildCategoryMetadata("fileStorage"),
  animation: buildCategoryMetadata("animation"),
  cssFramework: buildCategoryMetadata("cssFramework"),
  uiLibrary: buildCategoryMetadata("uiLibrary"),
  cms: buildCategoryMetadata("cms"),
  featureFlags: buildCategoryMetadata("featureFlags"),
  analytics: buildCategoryMetadata("analytics"),
  codeQuality: buildCategoryMetadata("codeQuality"),
  documentation: buildCategoryMetadata("documentation"),
  appPlatforms: buildCategoryMetadata("appPlatforms"),
  packageManager: buildCategoryMetadata("packageManager"),
  examples: buildCategoryMetadata("examples"),
  ai: buildCategoryMetadata("ai"),
  aiDocs: buildCategoryMetadata("aiDocs"),
  git: buildCategoryMetadata("git"),
  install: buildCategoryMetadata("install"),
  effect: buildCategoryMetadata("effect"),
  shadcnBase: buildCategoryMetadata("shadcnBase"),
  shadcnStyle: buildCategoryMetadata("shadcnStyle"),
  shadcnIconLibrary: buildCategoryMetadata("shadcnIconLibrary"),
  shadcnColorTheme: buildCategoryMetadata("shadcnColorTheme"),
  shadcnBaseColor: buildCategoryMetadata("shadcnBaseColor"),
  shadcnFont: buildCategoryMetadata("shadcnFont"),
  shadcnRadius: buildCategoryMetadata("shadcnRadius"),
  rustWebFramework: buildCategoryMetadata("rustWebFramework"),
  rustFrontend: buildCategoryMetadata("rustFrontend"),
  rustOrm: buildCategoryMetadata("rustOrm"),
  rustApi: buildCategoryMetadata("rustApi"),
  rustCli: buildCategoryMetadata("rustCli"),
  rustLibraries: buildCategoryMetadata("rustLibraries"),
  pythonWebFramework: buildCategoryMetadata("pythonWebFramework"),
  pythonOrm: buildCategoryMetadata("pythonOrm"),
  pythonValidation: buildCategoryMetadata("pythonValidation"),
  pythonAi: buildCategoryMetadata("pythonAi"),
  pythonTaskQueue: buildCategoryMetadata("pythonTaskQueue"),
  pythonQuality: buildCategoryMetadata("pythonQuality"),
  goWebFramework: buildCategoryMetadata("goWebFramework"),
  goOrm: buildCategoryMetadata("goOrm"),
  goApi: buildCategoryMetadata("goApi"),
  goCli: buildCategoryMetadata("goCli"),
  goLogging: buildCategoryMetadata("goLogging"),
};

const OPTION_LOOKUP = Object.fromEntries(
  (Object.entries(OPTION_CATEGORY_METADATA) as Array<[OptionCategory, OptionCategoryMetadata]>).map(
    ([category, metadata]) => [
      category,
      new Map(
        metadata.options.flatMap((option) => [
          [option.id.toLowerCase(), option.id],
          ...option.aliases.map((alias) => [alias.toLowerCase(), option.id] as const),
        ]),
      ),
    ],
  ),
) as Record<OptionCategory, Map<string, string>>;

export function isMultiSelectCategory(category: OptionCategory): boolean {
  return OPTION_CATEGORY_METADATA[category].selectionMode === "multiple";
}

export function getOptionMetadata(category: OptionCategory, optionId: string): OptionMetadata | undefined {
  return OPTION_CATEGORY_METADATA[category].options.find((option) => option.id === optionId);
}

export function getCategoryOptionIds(category: OptionCategory): string[] {
  return OPTION_CATEGORY_METADATA[category].options.map((option) => option.id);
}

export function getCategoryCliValues(category: OptionCategory): string[] {
  return [...new Set(OPTION_CATEGORY_METADATA[category].options.map((option) => option.cliValue))];
}

export function normalizeOptionId(category: OptionCategory, value: string): string {
  const normalized = OPTION_LOOKUP[category].get(value.toLowerCase());
  return normalized ?? value;
}
