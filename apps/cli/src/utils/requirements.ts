import os from "node:os";

import { Result } from "better-result";
import { execa } from "execa";
import { clean, coerce, satisfies } from "semver";

import type { PackageManager, ProjectConfig } from "../types";
import { CLIError } from "./errors";
import { shouldSkipExternalCommands } from "./external-commands";

type RequirementConfig = Pick<
  ProjectConfig,
  | "addonOptions"
  | "addons"
  | "backend"
  | "examples"
  | "frontend"
  | "orm"
  | "packageManager"
  | "runtime"
  | "serverDeploy"
  | "webDeploy"
>;

type Tool = "node" | PackageManager;

type VersionRequirement = {
  tool: Tool;
  range: string;
  reason: string;
};

export type LocalToolVersions = Partial<Record<Tool, string>>;

export type LocalRequirements = {
  packageManagerVersion: string;
  warnings: string[];
};

export const PACKAGE_MANAGER_VERSION_RANGES = {
  bun: ">=1.2.14",
  npm: ">=11.16.0",
  pnpm: ">=10.26.0",
} as const satisfies Record<PackageManager, string>;

export const RECOMMENDED_BUN_VERSION_RANGE = ">=1.4.0";

const PACKAGE_MANAGER_REASONS = {
  bun: "generated Bun workspaces use dependency catalogs",
  npm: "generated npm workspaces use the allowScripts install-script policy",
  pnpm: "generated pnpm workspaces use catalogs and the allowBuilds policy",
} as const satisfies Record<PackageManager, string>;

const PACKAGE_MANAGER_UPGRADE_INSTRUCTIONS = {
  bun: "Run `bun upgrade`.",
  npm: "After updating Node.js, run `npm install --global npm@latest`.",
  pnpm: "Run `pnpm self-update`, or install the latest pnpm globally.",
} as const satisfies Record<PackageManager, string>;

const NODE_UPGRADE_INSTRUCTION =
  "Install the latest Node.js 24 LTS release from https://nodejs.org, then rerun the command.";

function normalizeVersion(value: string): string | null {
  const trimmed = value.trim();
  return clean(trimmed) ?? coerce(trimmed)?.version ?? null;
}

function addNodeRequirement(
  requirements: VersionRequirement[],
  range: string,
  reason: string,
): void {
  requirements.push({ tool: "node", range, reason });
}

function getNodeToolingRequirements(config: RequirementConfig): VersionRequirement[] {
  const requirements: VersionRequirement[] = [];

  for (const frontend of config.frontend) {
    switch (frontend) {
      case "astro":
        addNodeRequirement(requirements, ">=22.12.0", "Astro 7");
        break;
      case "nuxt":
        addNodeRequirement(requirements, "^22.19.0 || ^24.11.0 || >=26.0.0", "Nuxt 4");
        break;
      case "solid":
        addNodeRequirement(requirements, ">=24.0.0", "Solid");
        break;
      case "react-router":
        addNodeRequirement(requirements, ">=22.22.0", "React Router 8");
        break;
      case "svelte":
      case "tanstack-router":
      case "tanstack-start":
        addNodeRequirement(requirements, "^20.19.0 || >=22.12.0", "Vite 8");
        break;
      case "next":
        addNodeRequirement(requirements, ">=20.9.0", "Next.js 16");
        break;
      case "native-bare":
      case "native-uniwind":
      case "native-unistyles":
        addNodeRequirement(requirements, "^22.13.0 || ^24.3.0 || >=26.0.0", "React Native 0.86");
        break;
    }
  }

  if (!["none", "self", "convex"].includes(config.backend)) {
    addNodeRequirement(
      requirements,
      "^22.18.0 || >=24.11.0",
      "the generated server build (tsdown)",
    );
  }

  if (config.orm === "prisma") {
    addNodeRequirement(requirements, "^20.19.0 || ^22.12.0 || >=24.0.0", "Prisma 7");
  }

  if (config.orm === "mongoose") {
    addNodeRequirement(requirements, ">=20.19.0", "Mongoose 9 and MongoDB 7");
  }

  if (config.examples.includes("ai")) {
    addNodeRequirement(requirements, ">=22.0.0", "AI SDK 7");
  }

  if (
    config.addons.includes("oxlint") ||
    (config.addons.includes("ultracite") && config.addonOptions?.ultracite?.linter === "oxlint")
  ) {
    addNodeRequirement(requirements, "^20.19.0 || >=22.12.0", "Oxlint and Oxfmt");
  }

  if (config.addons.includes("husky")) {
    addNodeRequirement(requirements, ">=22.22.1", "lint-staged 17");
  }

  if (config.addons.includes("vite-plus")) {
    addNodeRequirement(requirements, "^20.19.0 || ^22.18.0 || >=24.11.0", "Vite+");
  }

  if (config.addons.includes("starlight")) {
    addNodeRequirement(requirements, ">=22.12.0", "Starlight's Astro toolchain");
  }

  if (config.addons.includes("wxt")) {
    addNodeRequirement(requirements, ">=22.0.0", "WXT");
  }

  if (config.webDeploy === "cloudflare" || config.serverDeploy === "cloudflare") {
    addNodeRequirement(requirements, ">=22.0.0", "Wrangler 4");
  }

  return requirements;
}

type HostRuntime = "bun" | "node";

function getHostRuntime(): HostRuntime {
  return process.versions.bun ? "bun" : "node";
}

/** Requirements that do not depend on the chosen stack, so they can run before any prompt. */
export function getBaselineRequirements(
  packageManager: PackageManager | undefined,
  hostRuntime: HostRuntime,
): VersionRequirement[] {
  const requirements: VersionRequirement[] = [];
  if (packageManager) {
    requirements.push({
      tool: packageManager,
      range: PACKAGE_MANAGER_VERSION_RANGES[packageManager],
      reason: PACKAGE_MANAGER_REASONS[packageManager],
    });
  }
  if (hostRuntime === "node") {
    addNodeRequirement(requirements, ">=22.0.0", "create-better-t-stack");
  }
  return requirements;
}

export function getLocalVersionRequirements(
  config: RequirementConfig,
  hostRuntime: HostRuntime,
): VersionRequirement[] {
  const requirements = getBaselineRequirements(config.packageManager, hostRuntime);

  if (config.packageManager !== "bun") {
    requirements.push(...getNodeToolingRequirements(config));
  } else if (config.runtime === "node") {
    addNodeRequirement(requirements, ">=22.0.0", "the selected Node.js server runtime");
  }

  return requirements;
}

function formatRequirementError(
  requirement: VersionRequirement,
  rawVersion: string | undefined,
): string | null {
  const label = requirement.tool === "node" ? "Node.js" : requirement.tool;
  if (!rawVersion) {
    return `${label} is not available (required ${requirement.range} for ${requirement.reason}).`;
  }

  const version = normalizeVersion(rawVersion);
  if (!version) {
    return `Could not read the ${label} version from "${rawVersion}".`;
  }

  if (!satisfies(version, requirement.range, { includePrerelease: true })) {
    return `${label} ${version} does not satisfy ${requirement.range} required by ${requirement.reason}.`;
  }

  return null;
}

export function validateLocalToolVersions(
  config: RequirementConfig,
  versions: LocalToolVersions,
  hostRuntime: HostRuntime,
): Result<void, CLIError> {
  return validateRequirements(getLocalVersionRequirements(config, hostRuntime), versions);
}

const STACK_REQUIREMENTS_HEADLINE = "Your local toolchain does not meet this stack's requirements:";
const BASELINE_REQUIREMENTS_HEADLINE =
  "Your local toolchain does not meet create-better-t-stack's requirements:";

export function validateRequirements(
  requirements: VersionRequirement[],
  versions: LocalToolVersions,
  headline = STACK_REQUIREMENTS_HEADLINE,
): Result<void, CLIError> {
  const failures = requirements
    .map((requirement) => formatRequirementError(requirement, versions[requirement.tool]))
    .filter((failure): failure is string => failure !== null);

  if (failures.length === 0) {
    return Result.ok(undefined);
  }

  const upgradeInstructions = new Set<string>();
  for (const requirement of requirements) {
    if (!formatRequirementError(requirement, versions[requirement.tool])) continue;
    if (requirement.tool === "node") {
      upgradeInstructions.add(NODE_UPGRADE_INSTRUCTION);
    } else {
      upgradeInstructions.add(PACKAGE_MANAGER_UPGRADE_INSTRUCTIONS[requirement.tool]);
    }
  }

  return Result.err(
    new CLIError({
      message: [
        headline,
        ...failures.map((failure) => `- ${failure}`),
        "",
        ...upgradeInstructions,
      ].join("\n"),
    }),
  );
}

export function getLocalToolRecommendations(
  config: RequirementConfig,
  versions: LocalToolVersions,
): string[] {
  if (config.packageManager !== "bun") return [];

  const rawVersion = versions.bun;
  if (!rawVersion) return [];

  const version = normalizeVersion(rawVersion);
  if (
    !version ||
    !satisfies(version, PACKAGE_MANAGER_VERSION_RANGES.bun, { includePrerelease: true }) ||
    satisfies(version, RECOMMENDED_BUN_VERSION_RANGE, { includePrerelease: true })
  ) {
    return [];
  }

  return [
    `Bun ${version} meets the minimum requirement, but Bun 1.4 or newer is recommended. Run \`bun upgrade\`.`,
  ];
}

async function readToolVersion(tool: Tool): Promise<string | null> {
  const result = await Result.tryPromise({
    try: async () => {
      const { stdout } = await execa(tool, ["--version"], {
        cwd: os.tmpdir(),
        stderr: "pipe",
      });
      return normalizeVersion(stdout);
    },
    catch: () => null,
  });

  return result.isOk() ? result.value : null;
}

async function readLocalToolVersions(
  packageManager: PackageManager | undefined,
  hostRuntime: HostRuntime,
  needsNode: boolean,
): Promise<LocalToolVersions> {
  const versions: LocalToolVersions = {};
  if (packageManager) {
    const packageManagerVersion = await readToolVersion(packageManager);
    if (packageManagerVersion) versions[packageManager] = packageManagerVersion;
  }
  if (needsNode) {
    versions.node =
      hostRuntime === "node"
        ? process.versions.node
        : ((await readToolVersion("node")) ?? undefined);
  }
  return versions;
}

export type BaselineCheck = {
  warnings: string[];
};

/**
 * Pre-prompt check. An inferred package manager can still be changed at its prompt, so it only
 * warns; an explicit one and the host Node.js version are fatal.
 */
export async function checkBaselineRequirements(
  packageManager: PackageManager | undefined,
  packageManagerIsExplicit: boolean,
): Promise<Result<BaselineCheck, CLIError>> {
  if (shouldSkipExternalCommands()) return Result.ok({ warnings: [] });

  const hostRuntime = getHostRuntime();
  const requirements = getBaselineRequirements(packageManager, hostRuntime);
  const versions = await readLocalToolVersions(
    packageManager,
    hostRuntime,
    requirements.some((requirement) => requirement.tool === "node"),
  );
  const fatal = requirements.filter(
    (requirement) => requirement.tool === "node" || packageManagerIsExplicit,
  );
  const fatalResult = validateRequirements(fatal, versions, BASELINE_REQUIREMENTS_HEADLINE);
  if (fatalResult.isErr()) return Result.err(fatalResult.error);

  const advisory = requirements.filter((requirement) => !fatal.includes(requirement));
  const advisoryResult = validateRequirements(advisory, versions, BASELINE_REQUIREMENTS_HEADLINE);
  if (advisoryResult.isErr()) {
    return Result.ok({
      warnings: [
        `${advisoryResult.error.message}\nYou can also choose a different package manager at the package manager step.`,
      ],
    });
  }

  return Result.ok({ warnings: [] });
}

export async function checkLocalRequirements(
  config: RequirementConfig,
): Promise<Result<LocalRequirements, CLIError>> {
  const hostRuntime = getHostRuntime();
  const versions = await readLocalToolVersions(
    config.packageManager,
    hostRuntime,
    !shouldSkipExternalCommands() &&
      getLocalVersionRequirements(config, hostRuntime).some(
        (requirement) => requirement.tool === "node",
      ),
  );
  const packageManagerVersion = versions[config.packageManager];

  if (!shouldSkipExternalCommands()) {
    const validationResult = validateLocalToolVersions(config, versions, hostRuntime);
    if (validationResult.isErr()) return Result.err(validationResult.error);
  }

  return Result.ok({
    packageManagerVersion: packageManagerVersion ?? "latest",
    warnings: getLocalToolRecommendations(config, versions),
  });
}
