import path from "node:path";

import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";

import { navigableSelect } from "../../prompts/navigable";
import { navigableGroup } from "../../prompts/navigable-group";
import type { ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { AddonSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { shouldSkipExternalCommands } from "../../utils/external-commands";
import { getPackageExecutionArgs } from "../../utils/package-runner";
import { cliLog, createSpinner } from "../../utils/terminal-output";

type FumadocsTemplate =
  | "next-mdx"
  | "next-mdx-static"
  | "waku"
  | "react-router"
  | "react-router-spa"
  | "tanstack-start"
  | "tanstack-start-spa";

type FumadocsSearch = "orama" | "orama-cloud";
type FumadocsOgImage = "next-og" | "takumi";
type FumadocsAiChat = "openrouter" | "inkeep";

const TEMPLATES = {
  "next-mdx": {
    label: "Next.js: Fumadocs MDX",
    hint: "Recommended template with MDX support",
    value: "+next+fuma-docs-mdx",
  },
  "next-mdx-static": {
    label: "Next.js: Fumadocs MDX (Static)",
    hint: "Static export template with MDX support",
    value: "+next+fuma-docs-mdx+static",
  },
  waku: {
    label: "Waku: Content Collections",
    hint: "Template using Waku with content collections",
    value: "waku",
  },
  "react-router": {
    label: "React Router: MDX Remote",
    hint: "Template for React Router with MDX remote",
    value: "react-router",
  },
  "react-router-spa": {
    label: "React Router: SPA",
    hint: "Template for React Router SPA",
    value: "react-router-spa",
  },
  "tanstack-start": {
    label: "Tanstack Start: MDX Remote",
    hint: "Template for Tanstack Start with MDX remote",
    value: "tanstack-start",
  },
  "tanstack-start-spa": {
    label: "Tanstack Start: SPA",
    hint: "Template for Tanstack Start SPA",
    value: "tanstack-start-spa",
  },
} as const;

const DEFAULT_TEMPLATE: FumadocsTemplate = "next-mdx";
const DEFAULT_DEV_PORT = 4000;

// Upstream auto-forces aiChat=false for these templates (no prompt, no plugin).
function aiChatDisabledForTemplate(template: FumadocsTemplate): boolean {
  return template === "next-mdx-static" || template.endsWith("-spa");
}

export async function setupFumadocs(
  config: ProjectConfig,
): Promise<Result<void, AddonSetupError | UserCancelledError>> {
  if (shouldSkipExternalCommands()) {
    return Result.ok(undefined);
  }

  const { packageManager, projectDir } = config;

  cliLog.info("Setting up Fumadocs...");

  const configuredOptions = config.addonOptions?.fumadocs;

  let template = configuredOptions?.template;
  let search: FumadocsSearch | undefined = configuredOptions?.search;
  let ogImage: FumadocsOgImage | undefined = configuredOptions?.ogImage;
  let aiChat: FumadocsAiChat | undefined = configuredOptions?.aiChat;

  if (isSilent()) {
    template = template ?? DEFAULT_TEMPLATE;
  } else {
    const results = await navigableGroup<{
      template: FumadocsTemplate;
      search: FumadocsSearch;
      ogImage: FumadocsOgImage | "skip";
      aiChat: FumadocsAiChat | "none";
    }>({
      template: async () => {
        if (template !== undefined) return template;
        return navigableSelect<FumadocsTemplate>({
          message: "Choose a template",
          options: Object.entries(TEMPLATES).map(([key, t]) => ({
            value: key as FumadocsTemplate,
            label: t.label,
            hint: t.hint,
          })),
          initialValue: DEFAULT_TEMPLATE,
        });
      },
      search: async () => {
        if (search !== undefined) return search;
        return navigableSelect<FumadocsSearch>({
          message: "Choose a search solution?",
          options: [
            {
              value: "orama",
              label: "Default",
              hint: "local search powered by Orama, recommended",
            },
            {
              value: "orama-cloud",
              label: "Orama Cloud",
              hint: "3rd party search solution, signup needed",
            },
          ],
          initialValue: "orama",
        });
      },
      ogImage: async ({ results }) => {
        if (ogImage !== undefined) return ogImage;
        const picked = results.template ?? template ?? DEFAULT_TEMPLATE;
        // Non-Next templates auto-default to takumi upstream — skip prompt.
        if (!picked.startsWith("next-")) return "skip";
        return navigableSelect<FumadocsOgImage>({
          message: "Configure Open Graph Image generation?",
          options: [
            { value: "next-og", label: "next/og", hint: "Next.js built-in solution" },
            { value: "takumi", label: "Takumi", hint: "Output WebP format, framework-agnostic" },
          ],
          initialValue: "next-og",
        });
      },
      aiChat: async ({ results }) => {
        if (aiChat !== undefined) return aiChat;
        const picked = results.template ?? template ?? DEFAULT_TEMPLATE;
        if (aiChatDisabledForTemplate(picked)) return "none";
        return navigableSelect<FumadocsAiChat | "none">({
          message: "Configure AI Chat?",
          options: [
            { value: "none", label: "No" },
            { value: "openrouter", label: "AI SDK", hint: "default to OpenRouter" },
            { value: "inkeep", label: "Inkeep AI", hint: "API key required" },
          ],
          initialValue: "none",
        });
      },
    });

    // navigableGroup bails early on cancel without marking later prompts, so
    // undefined in any slot (skip/none sentinels are defined) means the user
    // cancelled mid-flow. Treat that as UserCancelledError, not partial success.
    if (
      results.template === undefined ||
      results.search === undefined ||
      results.ogImage === undefined ||
      results.aiChat === undefined
    ) {
      return userCancelled("Operation cancelled");
    }

    template = results.template;
    search = results.search;
    ogImage = results.ogImage === "skip" ? undefined : results.ogImage;
    aiChat = results.aiChat === "none" ? undefined : results.aiChat;
  }

  if (!template) {
    return userCancelled("Operation cancelled");
  }

  const isNextTemplate = template.startsWith("next-");

  // Pre-configured options may be invalid for the chosen template.
  // Mirror upstream's template-scoped guards so we don't emit flags that
  // would either be rejected or apply a broken plugin (e.g. AI chat on
  // a static export).
  if (!isNextTemplate) {
    ogImage = undefined;
  }
  if (aiChatDisabledForTemplate(template)) {
    aiChat = undefined;
  }

  const templateArg = TEMPLATES[template].value;
  const devPort = configuredOptions?.devPort ?? DEFAULT_DEV_PORT;

  const options: string[] = [`--template ${templateArg}`, `--pm ${packageManager}`, "--no-git"];

  if (isNextTemplate) {
    options.push("--src");
  }

  if (config.addons.includes("biome")) {
    options.push("--linter biome");
  }

  if (search) options.push(`--search ${search}`);
  if (ogImage) options.push(`--og-image ${ogImage}`);
  if (aiChat) options.push(`--ai-chat ${aiChat}`);

  const commandWithArgs = `create-fumadocs-app@latest fumadocs ${options.join(" ")}`;
  const args = getPackageExecutionArgs(packageManager, commandWithArgs);

  const appsDir = path.join(projectDir, "apps");
  await fs.ensureDir(appsDir);

  const s = createSpinner();
  s.start("Running Fumadocs create command...");

  const result = await Result.tryPromise({
    try: async () => {
      await $({ cwd: appsDir, env: { CI: "true" } })`${args}`;

      const fumadocsDir = path.join(projectDir, "apps", "fumadocs");
      const packageJsonPath = path.join(fumadocsDir, "package.json");

      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.name = "fumadocs";

        if (packageJson.scripts?.dev) {
          packageJson.scripts.dev = `${packageJson.scripts.dev} --port=${devPort}`;
        }

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
    },
    catch: (e) =>
      new AddonSetupError({
        addon: "fumadocs",
        message: `Failed to set up Fumadocs: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (result.isErr()) {
    s.stop("Failed to set up Fumadocs");
    return result;
  }

  s.stop("Fumadocs setup complete!");
  return Result.ok(undefined);
}
