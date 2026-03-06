import type { ProjectConfig } from "@better-t-stack/types";

function normalizeMultiValues(values: string[] | undefined): string[] {
  if (!values || values.length === 0) return [];
  const filtered = values.filter((value) => value !== "none");
  return Array.from(new Set(filtered));
}

function formatMultiFlag(flag: string, values: string[]): string {
  if (values.length === 0) {
    return `${flag} none`;
  }
  return `${flag} ${values.join(" ")}`;
}

function hasStructuredOptions(config: ProjectConfig): boolean {
  return Boolean(
    (config.addonOptions && Object.keys(config.addonOptions).length > 0) ||
    (config.dbSetupOptions && Object.keys(config.dbSetupOptions).length > 0),
  );
}

function getBaseCommand(packageManager: ProjectConfig["packageManager"]): string {
  if (packageManager === "bun") {
    return "bun create better-t-stack@latest";
  }

  if (packageManager === "pnpm") {
    return "pnpm create better-t-stack@latest";
  }

  return "npx create-better-t-stack@latest";
}

function escapeSingleQuotes(value: string): string {
  return value.replaceAll("'", "'\"'\"'");
}

export function generateReproducibleCommand(config: ProjectConfig): string {
  const baseCommand = getBaseCommand(config.packageManager);

  if (hasStructuredOptions(config)) {
    const input = {
      projectName: config.relativePath || config.projectName,
      frontend: normalizeMultiValues(config.frontend),
      backend: config.backend,
      runtime: config.runtime,
      database: config.database,
      orm: config.orm,
      api: config.api,
      auth: config.auth,
      payments: config.payments,
      addons: normalizeMultiValues(config.addons),
      examples: normalizeMultiValues(config.examples),
      dbSetup: config.dbSetup,
      webDeploy: config.webDeploy,
      serverDeploy: config.serverDeploy,
      git: config.git,
      packageManager: config.packageManager,
      install: config.install,
      addonOptions: config.addonOptions,
      dbSetupOptions: config.dbSetupOptions,
    };
    const escapedInput = escapeSingleQuotes(JSON.stringify(input));
    return `${baseCommand} create-json --input '${escapedInput}'`;
  }

  const flags: string[] = [];
  const frontend = normalizeMultiValues(config.frontend);
  const addons = normalizeMultiValues(config.addons);
  const examples = normalizeMultiValues(config.examples);

  flags.push(formatMultiFlag("--frontend", frontend));

  flags.push(`--backend ${config.backend}`);
  flags.push(`--runtime ${config.runtime}`);
  flags.push(`--database ${config.database}`);
  flags.push(`--orm ${config.orm}`);
  flags.push(`--api ${config.api}`);
  flags.push(`--auth ${config.auth}`);
  flags.push(`--payments ${config.payments}`);

  flags.push(formatMultiFlag("--addons", addons));
  flags.push(formatMultiFlag("--examples", examples));

  flags.push(`--db-setup ${config.dbSetup}`);
  flags.push(`--web-deploy ${config.webDeploy}`);
  flags.push(`--server-deploy ${config.serverDeploy}`);
  flags.push(config.git ? "--git" : "--no-git");
  flags.push(`--package-manager ${config.packageManager}`);
  flags.push(config.install ? "--install" : "--no-install");

  const projectPathArg = config.relativePath ? ` ${config.relativePath}` : "";

  return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}
