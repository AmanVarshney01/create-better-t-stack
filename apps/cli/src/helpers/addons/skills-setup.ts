import { isCancel, multiselect, select } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { AddonOptions, ProjectConfig } from "../../types";
import { readBtsConfig } from "../../utils/bts-config";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageRunnerPrefix } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

type SkillSource = {
  label: string;
};

type AgentOption = {
  value: SkillAgent;
  label: string;
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
} satisfies Record<string, SkillSource>;

type SourceKey = keyof typeof SKILL_SOURCES;

// All available agents from add-skill CLI
const AVAILABLE_AGENTS: AgentOption[] = [
  { value: "cursor", label: "Cursor" },
  { value: "claude-code", label: "Claude Code" },
  { value: "cline", label: "Cline" },
  { value: "github-copilot", label: "GitHub Copilot" },
  { value: "codex", label: "Codex" },
  { value: "opencode", label: "OpenCode" },
  { value: "windsurf", label: "Windsurf" },
  { value: "goose", label: "Goose" },
  { value: "roo", label: "Roo Code" },
  { value: "kilo", label: "Kilo Code" },
  { value: "gemini-cli", label: "Gemini CLI" },
  { value: "antigravity", label: "Antigravity" },
  { value: "openhands", label: "OpenHands" },
  { value: "trae", label: "Trae" },
  { value: "amp", label: "Amp" },
  { value: "pi", label: "Pi" },
  { value: "qoder", label: "Qoder" },
  { value: "qwen-code", label: "Qwen Code" },
  { value: "kiro-cli", label: "Kiro CLI" },
  { value: "droid", label: "Droid" },
  { value: "command-code", label: "Command Code" },
  { value: "clawdbot", label: "Clawdbot" },
  { value: "zencoder", label: "Zencoder" },
  { value: "neovate", label: "Neovate" },
  { value: "mcpjam", label: "MCPJam" },
];

const DEFAULT_SCOPE: InstallScope = "project";
const DEFAULT_AGENTS: SkillAgent[] = ["cursor", "claude-code", "github-copilot"];

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
  const { frontend, backend, dbSetup, auth, examples, addons, orm } = config;

  if (hasReactBasedFrontend(frontend)) {
    sources.push("vercel-labs/agent-skills");
    sources.push("shadcn/ui");
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

  return sources;
}

const CURATED_SKILLS_BY_SOURCE: Record<SourceKey, (config: ProjectConfig) => string[]> = {
  "vercel-labs/agent-skills": (config) => {
    const skills = [
      "web-design-guidelines",
      "vercel-composition-patterns",
      "vercel-react-best-practices",
    ];
    if (hasNativeFrontend(config.frontend)) {
      skills.push("vercel-react-native-skills");
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
      "upgrading-expo",
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
};

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

  let scope = skillsOptions?.scope;

  if (!scope) {
    if (isSilent()) {
      scope = DEFAULT_SCOPE;
    } else {
      const selectedScope = await select<InstallScope>({
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

      if (isCancel(selectedScope)) {
        return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
      }

      scope = selectedScope;
    }
  }

  // Select all skills by default
  const allSkillValues = skillOptions.map((opt) => opt.value);

  const configuredSelections = skillsOptions?.selections;
  let selectedSkills: string[];

  if (configuredSelections !== undefined) {
    selectedSkills = configuredSelections.flatMap((selection) =>
      selection.skills.map((skill) => `${selection.source}::${skill}`),
    );
  } else if (isSilent()) {
    selectedSkills = allSkillValues;
  } else {
    const promptedSkills = await multiselect({
      message: "Select skills to install",
      options: skillOptions,
      required: false,
      initialValues: allSkillValues,
    });

    if (isCancel(promptedSkills)) {
      return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
    }

    selectedSkills = promptedSkills as string[];
  }

  if (selectedSkills.length === 0) {
    return Result.ok(undefined);
  }

  const configuredAgents = skillsOptions?.agents;
  let selectedAgents: SkillAgent[] = configuredAgents ? [...configuredAgents] : [];

  if (selectedAgents.length === 0 && configuredAgents === undefined) {
    if (isSilent()) {
      selectedAgents = [...DEFAULT_AGENTS];
    } else {
      const promptedAgents = await multiselect({
        message: "Select agents to install skills to",
        options: AVAILABLE_AGENTS,
        required: false,
        initialValues: [...DEFAULT_AGENTS],
      });

      if (isCancel(promptedAgents)) {
        return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
      }

      selectedAgents = [...promptedAgents] as SkillAgent[];
    }
  }

  if (selectedAgents.length === 0) {
    return Result.ok(undefined);
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
          ...selectedAgents,
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
