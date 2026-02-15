import type { ProjectConfig } from "../types";

export function generateReproducibleCommand(config: ProjectConfig) {
  const flags: string[] = [];

  if (config.frontend && config.frontend.length > 0) {
    flags.push(`--frontend ${config.frontend.join(" ")}`);
  } else {
    flags.push("--frontend none");
  }

  flags.push(`--backend ${config.backend}`);
  flags.push(`--runtime ${config.runtime}`);
  flags.push(`--database ${config.database}`);
  flags.push(`--orm ${config.orm}`);
  flags.push(`--api ${config.api}`);
  flags.push(`--auth ${config.auth}`);
  flags.push(`--payments ${config.payments}`);
  flags.push(`--email ${config.email}`);
  flags.push(`--file-upload ${config.fileUpload}`);
  flags.push(`--effect ${config.effect}`);
  flags.push(`--css-framework ${config.cssFramework}`);
  flags.push(`--ui-library ${config.uiLibrary}`);
  flags.push(`--ai ${config.ai}`);
  flags.push(`--state-management ${config.stateManagement}`);
  flags.push(`--forms ${config.forms}`);
  flags.push(`--validation ${config.validation}`);
  flags.push(`--testing ${config.testing}`);
  flags.push(`--animation ${config.animation}`);
  flags.push(`--realtime ${config.realtime}`);
  flags.push(`--job-queue ${config.jobQueue}`);
  flags.push(`--logging ${config.logging}`);
  flags.push(`--observability ${config.observability}`);
  flags.push(`--caching ${config.caching}`);
  flags.push(`--cms ${config.cms}`);
  flags.push(`--search ${config.search}`);
  flags.push(`--file-storage ${config.fileStorage}`);

  if (config.addons && config.addons.length > 0) {
    flags.push(`--addons ${config.addons.join(" ")}`);
  } else {
    flags.push("--addons none");
  }

  if (config.examples && config.examples.length > 0) {
    flags.push(`--examples ${config.examples.join(" ")}`);
  } else {
    flags.push("--examples none");
  }

  flags.push(`--db-setup ${config.dbSetup}`);
  flags.push(`--web-deploy ${config.webDeploy}`);
  flags.push(`--server-deploy ${config.serverDeploy}`);

  if (config.aiDocs && config.aiDocs.length > 0) {
    const validDocs = config.aiDocs.filter((d) => d !== "none");
    if (validDocs.length > 0) {
      flags.push(`--ai-docs ${validDocs.join(" ")}`);
    } else {
      flags.push("--ai-docs none");
    }
  } else {
    flags.push("--ai-docs none");
  }

  flags.push(config.git ? "--git" : "--no-git");
  flags.push(`--package-manager ${config.packageManager}`);
  flags.push(config.install ? "--install" : "--no-install");

  let baseCommand = "npx create-better-fullstack@latest";
  const pkgManager = config.packageManager;

  if (pkgManager === "bun") {
    baseCommand = "bun create better-fullstack@latest";
  } else if (pkgManager === "pnpm") {
    baseCommand = "pnpm create better-fullstack@latest";
  } else if (pkgManager === "npm") {
    baseCommand = "npx create-better-fullstack@latest";
  }

  const projectPathArg = config.relativePath ? ` ${config.relativePath}` : "";

  return `${baseCommand}${projectPathArg} ${flags.join(" ")}`;
}
