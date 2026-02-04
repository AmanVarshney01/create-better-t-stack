import { isCancel, log, multiselect, spinner } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { readBtsConfig } from "../../utils/bts-config";
import { AddonSetupError, UserCancelledError } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type SkillSource = {
  source: string;
  label: string;
};

type FetchedSkill = {
  name: string;
  source: string;
  sourceLabel: string;
};

type AgentOption = {
  value: string;
  label: string;
};

// Skill sources - using GitHub shorthand or full URLs
const SKILL_SOURCES: Record<string, SkillSource> = {
  "vercel-labs/agent-skills": {
    source: "vercel-labs/agent-skills",
    label: "Vercel Agent Skills",
  },
  "anthropics/skills": {
    source: "https://github.com/anthropics/skills",
    label: "Anthropic Skills",
  },
  "vercel/ai": {
    source: "vercel/ai",
    label: "Vercel AI SDK",
  },
  "vercel/turborepo": {
    source: "vercel/turborepo",
    label: "Turborepo",
  },
  "yusukebe/hono-skill": {
    source: "yusukebe/hono-skill",
    label: "Hono Backend",
  },
  "vercel-labs/next-skills": {
    source: "vercel-labs/next-skills",
    label: "Next.js Best Practices",
  },
  "heroui-inc/heroui": {
    source: "heroui-inc/heroui",
    label: "HeroUI Native",
  },
  "better-auth/skills": {
    source: "better-auth/skills",
    label: "Better Auth",
  },
  "neondatabase/agent-skills": {
    source: "neondatabase/agent-skills",
    label: "Neon Database",
  },
  "supabase/agent-skills": {
    source: "supabase/agent-skills",
    label: "Supabase",
  },
  "elysiajs/skills": {
    source: "elysiajs/skills",
    label: "ElysiaJS",
  },
  "waynesutton/convexskills": {
    source: "waynesutton/convexskills",
    label: "Convex",
  },
};

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

function getRecommendedSourceKeys(config: ProjectConfig): string[] {
  const sources: string[] = [];
  const { frontend, backend, dbSetup, auth, examples, addons } = config;

  const hasReactBasedFrontend =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("tanstack-start") ||
    frontend.includes("next");

  if (hasReactBasedFrontend) {
    sources.push("vercel-labs/agent-skills");
  }

  // Next.js best practices
  if (frontend.includes("next")) {
    sources.push("vercel-labs/next-skills");
  }

  // HeroUI Native skill for Uniwind projects
  if (frontend.includes("native-uniwind")) {
    sources.push("heroui-inc/heroui");
  }

  // Better Auth skills
  if (auth === "better-auth") {
    sources.push("better-auth/skills");
  }

  // Database setup specific skills
  if (dbSetup === "neon") {
    sources.push("neondatabase/agent-skills");
  }

  if (dbSetup === "supabase") {
    sources.push("supabase/agent-skills");
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

  return sources;
}

function parseSkillsFromOutput(output: string): string[] {
  const skills: string[] = [];
  const lines = output.split("\n");
  const ansiRegex = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");

  for (const line of lines) {
    // Strip ANSI codes first
    const cleanLine = line.replace(ansiRegex, "");

    // Match lines that start with │ followed by exactly 4 spaces and then a skill name
    const match = cleanLine.match(/^│\s{4}([a-z][a-z0-9-]*)$/);
    if (match) {
      skills.push(match[1]);
    }
  }

  return skills;
}

function uniqueValues<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

async function fetchSkillsFromSource(
  source: SkillSource,
  packageManager: ProjectConfig["packageManager"],
  projectDir: string,
): Promise<string[]> {
  try {
    const args = getPackageExecutionArgs(
      packageManager,
      `skills@latest add ${source.source} --list`,
    );
    const result = await $({ cwd: projectDir, env: { CI: "true" } })`${args}`;
    return parseSkillsFromOutput(result.stdout);
  } catch {
    return [];
  }
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
  const s = spinner();
  s.start("Fetching available skills...");

  // Fetch skills from all recommended sources
  const allSkills: FetchedSkill[] = [];
  const sources = sourceKeys
    .map((sourceKey) => SKILL_SOURCES[sourceKey])
    .filter((source): source is SkillSource => Boolean(source));

  const fetchedSkills = await Promise.all(
    sources.map(async (source) => ({
      source,
      skills: await fetchSkillsFromSource(source, packageManager, projectDir),
    })),
  );

  for (const { source, skills } of fetchedSkills) {
    for (const skillName of skills) {
      allSkills.push({
        name: skillName,
        source: source.source,
        sourceLabel: source.label,
      });
    }
  }

  s.stop("Fetched available skills");

  if (allSkills.length === 0) {
    return Result.ok(undefined);
  }

  // Build skill options for multiselect
  const skillOptions = allSkills.map((skill) => ({
    value: `${skill.source}::${skill.name}`,
    label: skill.name,
    hint: skill.sourceLabel,
  }));

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

  // Install skills grouped by source (project scope, no -g flag)
  for (const [source, skills] of Object.entries(skillsBySource)) {
    // Build repeated -s flags for skills (e.g., -s skill1 -s skill2)
    const skillFlags = skills.map((s) => `-s ${s}`).join(" ");

    const installResult = await Result.tryPromise({
      try: async () => {
        // Install in project scope (no -g flag)
        // Format: skills@latest add <source> -s skill1 -s skill2 -a agent1 -a agent2 -y
        const args = getPackageExecutionArgs(
          packageManager,
          `skills@latest add ${source} ${skillFlags} ${agentFlags} -y`,
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
