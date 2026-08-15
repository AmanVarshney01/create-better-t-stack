import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import { navigableMultiselect, navigableSelect } from "../../prompts/navigable";
import { navigableGroup } from "../../prompts/navigable-group";
import type { AddonOptions, ProjectConfig } from "../../types";
import { readBtsConfig } from "../../utils/bts-config";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageRunnerPrefix } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";
import { supportsEvlogLocalLogs } from "./evlog-setup";

type SkillSource = {
  label: string;
};

type AgentOption = {
  value: SkillAgent;
  label: string;
  hint?: string;
};

type SkillsOptions = NonNullable<AddonOptions["skills"]>;
type SkillAgent = NonNullable<SkillsOptions["agents"]>[number];
type InstallScope = NonNullable<SkillsOptions["scope"]>;

// Skill sources - using GitHub shorthand or full URLs
const SKILL_SOURCES = {
  "vercel-labs/agent-skills": {
    label: "Vercel Agent Skills",
  },
  "vercel/ai": {
    label: "Vercel AI SDK",
  },
  "vercel/turborepo": {
    label: "Turborepo",
  },
  "yusukebe/hono-skill": {
    label: "Hono Backend",
  },
  "vercel-labs/next-skills": {
    label: "Next.js Best Practices",
  },
  "nuxt/ui": {
    label: "Nuxt UI",
  },
  "heroui-inc/heroui": {
    label: "HeroUI Native",
  },
  "shadcn/ui": {
    label: "shadcn/ui",
  },
  "better-auth/skills": {
    label: "Better Auth",
  },
  "clerk/skills": {
    label: "Clerk",
  },
  "neondatabase/agent-skills": {
    label: "Neon Database",
  },
  "supabase/agent-skills": {
    label: "Supabase",
  },
  "planetscale/database-skills": {
    label: "PlanetScale",
  },
  "expo/skills": {
    label: "Expo",
  },
  "prisma/skills": {
    label: "Prisma",
  },
  "elysiajs/skills": {
    label: "ElysiaJS",
  },
  "waynesutton/convexskills": {
    label: "Convex",
  },
  "msmps/opentui-skill": {
    label: "OpenTUI Platform",
  },
  "haydenbleasel/ultracite": {
    label: "Ultracite",
  },
  "https://www.evlog.dev": {
    label: "evlog",
  },
} satisfies Record<string, SkillSource>;

type SourceKey = keyof typeof SKILL_SOURCES;

const SKILLS_CLI_AGENT_OPTIONS: AgentOption[] = [
  { value: "adal", label: "AdaL" },
  { value: "aider-desk", label: "AiderDesk" },
  { value: "amp", label: "Amp" },
  { value: "antigravity", label: "Antigravity" },
  { value: "antigravity-cli", label: "Antigravity CLI" },
  { value: "astrbot", label: "AstrBot" },
  { value: "augment", label: "Augment" },
  { value: "autohand-code", label: "Autohand Code CLI" },
  { value: "bob", label: "IBM Bob" },
  { value: "claude-code", label: "Claude Code" },
  { value: "cline", label: "Cline" },
  { value: "codearts-agent", label: "CodeArts Agent" },
  { value: "codebuddy", label: "CodeBuddy" },
  { value: "codemaker", label: "Codemaker" },
  { value: "codestudio", label: "Code Studio" },
  { value: "codex", label: "Codex" },
  { value: "command-code", label: "Command Code" },
  { value: "continue", label: "Continue" },
  { value: "cortex", label: "Cortex Code" },
  { value: "crush", label: "Crush" },
  { value: "cursor", label: "Cursor" },
  { value: "deepagents", label: "Deep Agents" },
  { value: "devin", label: "Devin for Terminal" },
  { value: "dexto", label: "Dexto" },
  { value: "droid", label: "Droid" },
  { value: "eve", label: "Eve" },
  { value: "firebender", label: "Firebender" },
  { value: "forgecode", label: "ForgeCode" },
  { value: "gemini-cli", label: "Gemini CLI" },
  { value: "github-copilot", label: "GitHub Copilot" },
  { value: "goose", label: "Goose" },
  { value: "grok", label: "Grok Build" },
  { value: "hermes-agent", label: "Hermes Agent" },
  { value: "iflow-cli", label: "iFlow CLI" },
  { value: "inference-sh", label: "inference.sh" },
  { value: "jazz", label: "Jazz" },
  { value: "junie", label: "Junie" },
  { value: "kilo", label: "Kilo Code" },
  { value: "kimchi", label: "Kimchi" },
  { value: "kimi-code-cli", label: "Kimi Code CLI" },
  { value: "kiro-cli", label: "Kiro CLI" },
  { value: "kode", label: "Kode" },
  { value: "lingma", label: "Lingma" },
  { value: "loaf", label: "Loaf" },
  { value: "mcpjam", label: "MCPJam" },
  { value: "mistral-vibe", label: "Mistral Vibe" },
  { value: "moxby", label: "Moxby" },
  { value: "mux", label: "Mux" },
  { value: "neovate", label: "Neovate" },
  { value: "ona", label: "Ona" },
  { value: "openclaw", label: "OpenClaw" },
  { value: "opencode", label: "OpenCode" },
  { value: "openhands", label: "OpenHands" },
  { value: "pi", label: "Pi" },
  { value: "pochi", label: "Pochi" },
  { value: "promptscript", label: "PromptScript" },
  { value: "qoder", label: "Qoder" },
  { value: "qoder-cn", label: "Qoder CN" },
  { value: "qwen-code", label: "Qwen Code" },
  { value: "reasonix", label: "Reasonix" },
  { value: "replit", label: "Replit" },
  { value: "roo", label: "Roo Code" },
  { value: "rovodev", label: "Rovo Dev" },
  { value: "tabnine-cli", label: "Tabnine CLI" },
  { value: "terramind", label: "Terramind" },
  { value: "tinycloud", label: "Tinycloud" },
  { value: "trae", label: "Trae" },
  { value: "trae-cn", label: "Trae CN" },
  { value: "universal", label: "Universal" },
  { value: "warp", label: "Warp" },
  { value: "windsurf", label: "Windsurf" },
  { value: "zcode", label: "ZCode" },
  { value: "zed", label: "Zed" },
  { value: "zencoder", label: "Zencoder" },
  { value: "zenflow", label: "Zenflow" },
];

export const UNIVERSAL_SKILLS_AGENTS = [
  "amp",
  "antigravity",
  "antigravity-cli",
  "cline",
  "codex",
  "cursor",
  "deepagents",
  "dexto",
  "firebender",
  "gemini-cli",
  "github-copilot",
  "kimi-code-cli",
  "loaf",
  "opencode",
  "promptscript",
  "warp",
  "zed",
] as const satisfies readonly SkillAgent[];

const PROMPT_HIDDEN_AGENTS = new Set<SkillAgent>([
  ...UNIVERSAL_SKILLS_AGENTS,
  "universal",
  "eve",
  "replit",
]);

export const SKILLS_AGENT_PROMPT_OPTIONS: AgentOption[] = [
  {
    value: "universal",
    label: "Universal (.agents/skills)",
    hint: "17 agents including Amp, Antigravity, Cline, Codex, Cursor, Gemini CLI, Copilot, OpenCode, Warp, and Zed",
  },
  ...SKILLS_CLI_AGENT_OPTIONS.filter(({ value }) => value === "claude-code"),
  ...SKILLS_CLI_AGENT_OPTIONS.filter(
    ({ value }) => value !== "claude-code" && !PROMPT_HIDDEN_AGENTS.has(value),
  ),
];

export function expandSkillsAgentTargets(agents: readonly SkillAgent[]): SkillAgent[] {
  const expanded = agents.flatMap<SkillAgent>((agent) => {
    if (agent === "universal") return [...UNIVERSAL_SKILLS_AGENTS];
    if (agent === "clawdbot") return ["openclaw"];
    return [agent];
  });
  return Array.from(new Set(expanded));
}

const DEFAULT_SCOPE: InstallScope = "project";
const DEFAULT_AGENTS: SkillAgent[] = ["universal", "claude-code"];

function hasReactBasedFrontend(frontend: ProjectConfig["frontend"]): boolean {
  return (
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("tanstack-start") ||
    frontend.includes("next")
  );
}

function hasNativeFrontend(frontend: ProjectConfig["frontend"]): boolean {
  return (
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles")
  );
}

function getRecommendedSourceKeys(config: ProjectConfig): SourceKey[] {
  const sources: SourceKey[] = [];
  const { frontend, backend, dbSetup, auth, examples, addons, orm, webDeploy, serverDeploy } =
    config;

  if (hasReactBasedFrontend(frontend)) {
    sources.push("vercel-labs/agent-skills");
    sources.push("shadcn/ui");
  }

  if (
    (webDeploy === "vercel" || serverDeploy === "vercel") &&
    !sources.includes("vercel-labs/agent-skills")
  ) {
    sources.push("vercel-labs/agent-skills");
  }

  if (frontend.includes("next")) {
    sources.push("vercel-labs/next-skills");
  }

  if (frontend.includes("nuxt")) {
    sources.push("nuxt/ui");
  }

  if (frontend.includes("native-uniwind")) {
    sources.push("heroui-inc/heroui");
  }

  if (hasNativeFrontend(frontend)) {
    sources.push("expo/skills");
  }

  if (auth === "better-auth") {
    sources.push("better-auth/skills");
  }

  if (auth === "clerk") {
    sources.push("clerk/skills");
  }

  if (dbSetup === "neon") {
    sources.push("neondatabase/agent-skills");
  }

  if (dbSetup === "supabase") {
    sources.push("supabase/agent-skills");
  }

  if (dbSetup === "planetscale") {
    sources.push("planetscale/database-skills");
  }

  if (orm === "prisma" || dbSetup === "prisma-postgres") {
    sources.push("prisma/skills");
  }

  if (examples.includes("ai")) {
    sources.push("vercel/ai");
  }

  if (addons.includes("turborepo")) {
    sources.push("vercel/turborepo");
  }

  if (backend === "hono") {
    sources.push("yusukebe/hono-skill");
  }

  if (backend === "elysia") {
    sources.push("elysiajs/skills");
  }

  if (backend === "convex") {
    sources.push("waynesutton/convexskills");
  }

  if (addons.includes("opentui")) {
    sources.push("msmps/opentui-skill");
  }

  if (addons.includes("ultracite")) {
    sources.push("haydenbleasel/ultracite");
  }

  if (addons.includes("evlog")) {
    sources.push("https://www.evlog.dev");
  }

  return sources;
}

const CURATED_SKILLS_BY_SOURCE = {
  "vercel-labs/agent-skills": (config) => {
    const skills: string[] = [];
    if (hasReactBasedFrontend(config.frontend)) {
      skills.push(
        "web-design-guidelines",
        "vercel-composition-patterns",
        "vercel-react-best-practices",
      );
    }
    if (hasNativeFrontend(config.frontend)) {
      skills.push("vercel-react-native-skills");
    }
    if (config.webDeploy === "vercel" || config.serverDeploy === "vercel") {
      skills.push("deploy-to-vercel");
    }
    return skills;
  },
  "vercel/ai": () => ["ai-sdk"],
  "vercel/turborepo": () => ["turborepo"],
  "yusukebe/hono-skill": () => ["hono"],
  "vercel-labs/next-skills": () => ["next-best-practices", "next-cache-components"],
  "nuxt/ui": () => ["nuxt-ui"],
  "heroui-inc/heroui": () => ["heroui-native"],
  "shadcn/ui": () => ["shadcn"],
  "better-auth/skills": () => ["better-auth-best-practices"],
  "clerk/skills": (config) => {
    const skills = [
      "clerk",
      "clerk-setup",
      "clerk-custom-ui",
      "clerk-webhooks",
      "clerk-testing",
      "clerk-orgs",
    ];

    if (config.frontend.includes("next")) {
      skills.push("clerk-nextjs-patterns");
    }

    return skills;
  },
  "neondatabase/agent-skills": () => ["neon-postgres"],
  "supabase/agent-skills": () => ["supabase-postgres-best-practices"],
  "planetscale/database-skills": (config) => {
    if (config.dbSetup !== "planetscale") {
      return [];
    }

    if (config.database === "postgres") {
      return ["postgres", "neki"];
    }

    if (config.database === "mysql") {
      return ["mysql", "vitess"];
    }

    return [];
  },
  "expo/skills": (config) => {
    const skills = [
      "expo-dev-client",
      "building-native-ui",
      "native-data-fetching",
      "expo-deployment",
      "expo-cicd-workflows",
    ];
    if (config.frontend.includes("native-uniwind")) {
      skills.push("expo-tailwind-setup");
    }
    return skills;
  },
  "prisma/skills": (config) => {
    const skills: string[] = [];

    if (config.orm === "prisma") {
      skills.push("prisma-cli", "prisma-client-api", "prisma-database-setup");
    }

    if (config.dbSetup === "prisma-postgres") {
      skills.push("prisma-postgres");
    }

    return skills;
  },
  "elysiajs/skills": () => ["elysiajs"],
  "waynesutton/convexskills": () => [
    "convex-best-practices",
    "convex-functions",
    "convex-schema-validator",
    "convex-realtime",
    "convex-http-actions",
    "convex-cron-jobs",
    "convex-file-storage",
    "convex-migrations",
    "convex-security-check",
  ],
  "msmps/opentui-skill": () => ["opentui"],
  "haydenbleasel/ultracite": () => ["ultracite"],
  "https://www.evlog.dev": (config) => [
    "review-logging-patterns",
    "build-audit-logs",
    ...(supportsEvlogLocalLogs(config) ? ["analyze-logs"] : []),
  ],
} satisfies Record<SourceKey, (config: ProjectConfig) => string[]>;

function getCuratedSkillNamesForSourceKey(sourceKey: SourceKey, config: ProjectConfig): string[] {
  return CURATED_SKILLS_BY_SOURCE[sourceKey](config);
}

function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

export async function setupSkills(
  config: ProjectConfig,
): Promise<Result<void, AddonSetupError | UserCancelledError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;

  // Load full config from bts.jsonc to get all addons (existing + new)
  const btsConfig = await readBtsConfig(projectDir);
  const fullConfig: ProjectConfig = btsConfig
    ? {
        ...config,
        addons: btsConfig.addons ?? config.addons,
        addonOptions: btsConfig.addonOptions ?? config.addonOptions,
      }
    : config;

  const recommendedSourceKeys = getRecommendedSourceKeys(fullConfig);
  const skillsOptions = fullConfig.addonOptions?.skills;
  const configuredSourceKeys = uniqueValues(
    (skillsOptions?.selections ?? []).map((selection) => selection.source),
  );
  const sourceKeys = uniqueValues([...recommendedSourceKeys, ...configuredSourceKeys]);

  if (sourceKeys.length === 0) {
    return Result.ok(undefined);
  }

  const skillOptions = sourceKeys.flatMap((sourceKey) => {
    const source = SKILL_SOURCES[sourceKey];
    const skillNames = getCuratedSkillNamesForSourceKey(sourceKey, fullConfig);
    return skillNames.map((skillName) => ({
      value: `${sourceKey}::${skillName}`,
      label: skillName,
      hint: source.label,
    }));
  });

  if (skillOptions.length === 0) {
    return Result.ok(undefined);
  }

  const configuredScope = skillsOptions?.scope;
  const configuredSelections = skillsOptions?.selections;
  const configuredAgents = skillsOptions?.agents;
  const allSkillValues = skillOptions.map((opt) => opt.value);

  let scope: InstallScope;
  let selectedSkills: string[];
  let selectedAgents: SkillAgent[];

  if (isSilent()) {
    scope = configuredScope ?? DEFAULT_SCOPE;
    selectedSkills =
      configuredSelections !== undefined
        ? configuredSelections.flatMap((selection) =>
            selection.skills.map((skill) => `${selection.source}::${skill}`),
          )
        : allSkillValues;
    if (selectedSkills.length === 0) return Result.ok(undefined);
    selectedAgents = configuredAgents ? [...configuredAgents] : [...DEFAULT_AGENTS];
    if (selectedAgents.length === 0) return Result.ok(undefined);
  } else {
    const results = await navigableGroup<{
      scope: InstallScope;
      skills: string[];
      agents: SkillAgent[];
    }>({
      scope: async () => {
        if (configuredScope !== undefined) return configuredScope;
        return navigableSelect<InstallScope>({
          message: "Where should skills be installed?",
          options: [
            {
              value: "project",
              label: "Project",
              hint: "Writes to project config files (recommended for teams)",
            },
            {
              value: "global",
              label: "Global",
              hint: "Writes to user-level config files (personal machine)",
            },
          ],
          initialValue: DEFAULT_SCOPE,
        });
      },
      skills: async () => {
        if (configuredSelections !== undefined) {
          return configuredSelections.flatMap((selection) =>
            selection.skills.map((skill) => `${selection.source}::${skill}`),
          );
        }
        return navigableMultiselect<string>({
          message: "Select skills to install",
          options: skillOptions,
          required: false,
          initialValues: allSkillValues,
        });
      },
      agents: async ({ results: r }) => {
        const pickedSkills = r.skills as string[] | undefined;
        if (pickedSkills !== undefined && pickedSkills.length === 0) return [];
        if (configuredAgents !== undefined) return [...configuredAgents];
        return navigableMultiselect<SkillAgent>({
          message: "Select agents to install skills to",
          options: SKILLS_AGENT_PROMPT_OPTIONS,
          required: false,
          initialValues: [...DEFAULT_AGENTS],
          maxItems: 10,
        });
      },
    });

    if (
      results.scope === undefined ||
      results.skills === undefined ||
      results.agents === undefined
    ) {
      return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
    }

    scope = results.scope;
    selectedSkills = results.skills as string[];
    selectedAgents = results.agents as SkillAgent[];

    if (selectedSkills.length === 0 || selectedAgents.length === 0) {
      return Result.ok(undefined);
    }
  }

  // Group skills by source
  const skillsBySource: Record<string, string[]> = {};
  for (const skillKey of selectedSkills) {
    const [source, skillName] = skillKey.split("::");
    if (!skillsBySource[source]) {
      skillsBySource[source] = [];
    }
    skillsBySource[source].push(skillName);
  }

  const installSpinner = createSpinner();
  installSpinner.start("Installing skills...");

  const runner = getPackageRunnerPrefix(packageManager);
  const globalFlags = scope === "global" ? ["-g"] : [];
  const agentTargets = expandSkillsAgentTargets(selectedAgents);

  // Install skills grouped by source (project scope, no -g flag)
  for (const [source, skills] of Object.entries(skillsBySource)) {
    const installResult = await Result.tryPromise({
      try: async () => {
        const args = [
          ...runner,
          "skills@latest",
          "add",
          source,
          ...globalFlags,
          "--skill",
          ...skills,
          "--agent",
          ...agentTargets,
          "-y",
        ];
        await $({ cwd: projectDir, env: { CI: "true" } })`${args}`;
      },
      catch: (e) =>
        new AddonSetupError({
          addon: "skills",
          message: `Failed to install skills from ${source}: ${e instanceof Error ? e.message : String(e)}`,
          cause: e,
        }),
    });

    if (installResult.isErr()) {
      cliLog.warn(pc.yellow(`Warning: Could not install skills from ${source}`));
    }
  }

  installSpinner.stop("Skills installed");

  return Result.ok(undefined);
}
