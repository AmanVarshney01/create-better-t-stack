import type { ProjectConfig } from "@better-t-stack/types";

export function isDatabaseConsumedByDocker(
  config: Pick<ProjectConfig, "backend" | "serverDeploy" | "webDeploy">,
): boolean {
  return config.backend === "self"
    ? config.webDeploy === "docker"
    : config.serverDeploy === "docker";
}
