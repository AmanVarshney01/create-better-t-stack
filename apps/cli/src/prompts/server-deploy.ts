import { isCancel, select } from "@clack/prompts";

import type { Backend, Runtime, ServerDeploy, WebDeploy } from "../types";

import { DEFAULT_CONFIG } from "../constants";
import { exitCancelled } from "../utils/errors";

type DeploymentOption = {
  value: ServerDeploy;
  label: string;
  hint: string;
};

function getDeploymentDisplay(deployment: ServerDeploy): {
  label: string;
  hint: string;
} {
  if (deployment === "cloudflare") {
    return {
      label: "Cloudflare",
      hint: "Deploy to Cloudflare Workers using Alchemy",
    };
  }
  return {
    label: deployment,
    hint: `Add ${deployment} deployment`,
  };
}

export async function getServerDeploymentChoice(
  deployment?: ServerDeploy,
  runtime?: Runtime,
  backend?: Backend,
  _webDeploy?: WebDeploy,
) {
  if (deployment !== undefined) return deployment;

  if (backend === "none" || backend === "convex") {
    return "none";
  }

  if (backend !== "hono") {
    return "none";
  }

  // Auto-select cloudflare for workers runtime since it's the only valid option
  if (runtime === "workers") {
    return "cloudflare";
  }

  return "none";
}

export async function getServerDeploymentToAdd(
  runtime?: Runtime,
  existingDeployment?: ServerDeploy,
  backend?: Backend,
) {
  if (backend !== "hono") {
    return "none";
  }

  const options: DeploymentOption[] = [];

  if (runtime === "workers") {
    if (existingDeployment !== "cloudflare") {
      const { label, hint } = getDeploymentDisplay("cloudflare");
      options.push({
        value: "cloudflare",
        label,
        hint,
      });
    }
  }

  if (existingDeployment && existingDeployment !== "none") {
    return "none";
  }

  if (options.length === 0) {
    return "none";
  }

  const response = await select<ServerDeploy>({
    message: "Select server deployment",
    options,
    initialValue: DEFAULT_CONFIG.serverDeploy,
  });

  if (isCancel(response)) return exitCancelled("Operation cancelled");

  return response;
}
