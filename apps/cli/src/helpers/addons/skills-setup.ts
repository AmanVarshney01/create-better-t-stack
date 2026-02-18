import { isCancel, log, multiselect, select, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { readBtsConfig } from "../../utils/bts-config";
import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type SkillSource = {
  label: string;
};

type AgentOption = {
  value: string;
  label: string;
};

type InstallScope = "project" | "global";

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
  "better-auth/skills": {
    label: "Better Auth",
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
  "better-auth/skills": () => ["better-auth-best-practices"],
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
    ? { ...config, addons: btsConfig.addons ?? config.addons }
    : config;

  const recommendedSourceKeys = getRecommendedSourceKeys(fullConfig);

  if (recommendedSourceKeys.length === 0) {
    return Result.ok(undefined);
  }

  const sourceKeys = uniqueValues(recommendedSourceKeys);
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

  const scope = await select<InstallScope>({
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
    initialValue: "project",
  });

  if (isCancel(scope)) {
    return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
  }

  // Select all skills by default
  const allSkillValues = skillOptions.map((opt) => opt.value);

  // Prompt user to select skills
  const selectedSkills = await multiselect({
    message: "Select skills to install",
    options: skillOptions,
    required: false,
    initialValues: allSkillValues,
  });

  if (isCancel(selectedSkills)) {
    return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
  }

  if (selectedSkills.length === 0) {
    return Result.ok(undefined);
  }

  // Prompt user to select agents
  const selectedAgents = await multiselect({
    message: "Select agents to install skills to",
    options: AVAILABLE_AGENTS,
    required: false,
    initialValues: ["cursor", "claude-code", "github-copilot"],
  });

  if (isCancel(selectedAgents)) {
    return Result.err(new UserCancelledError({ message: "Operation cancelled" }));
  }

  if (selectedAgents.length === 0) {
    return Result.ok(undefined);
  }

  // Group skills by source
  const skillsBySource: Record<string, string[]> = {};
  for (const skillKey of selectedSkills) {
    const [source, skillName] = (skillKey as string).split("::");
    if (!skillsBySource[source]) {
      skillsBySource[source] = [];
    }
    skillsBySource[source].push(skillName);
  }

  const installSpinner = spinner();
  installSpinner.start("Installing skills...");

  // Build repeated -a flags for agents (e.g., -a cursor -a claude-code)
  const agentFlags = (selectedAgents as string[]).map((a) => `-a ${a}`).join(" ");
  const globalFlag = scope === "global" ? "-g" : "";

  // Install skills grouped by source (project scope, no -g flag)
  for (const [source, skills] of Object.entries(skillsBySource)) {
    // Build repeated -s flags for skills (e.g., -s skill1 -s skill2)
    const skillFlags = skills.map((s) => `-s ${s}`).join(" ");

    const installResult = await Result.tryPromise({
      try: async () => {
        // Format:
        // skills@latest add <source> [-g] -s skill1 -s skill2 -a agent1 -a agent2 -y
        const args = getPackageExecutionArgs(
          packageManager,
          `skills@latest add ${source} ${globalFlag} ${skillFlags} ${agentFlags} -y`,
        );
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
      log.warn(pc.yellow(`Warning: Could not install skills from ${source}`));
    }
  }

  installSpinner.stop("Skills installed");

  return Result.ok(undefined);
}
