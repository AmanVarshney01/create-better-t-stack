import { DEFAULT_CONFIG } from "../constants";
import type { Backend, Runtime, ServerDeploy, WebDeploy } from "../types";
import { UserCancelledError } from "../utils/errors";
import { isCancel, navigableSelect, preferValidInitial } from "./navigable";

const SERVER_APP_BACKENDS: Backend[] = ["hono", "express", "fastify", "elysia"];

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
  if (deployment === "docker") {
    return {
      label: "Docker",
      hint: "Self-host with a Dockerfile and docker-compose.yml",
    };
  }
  if (deployment === "vercel") {
    return {
      label: "Vercel",
      hint: "Deploy to Vercel with Services",
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
  previousValue?: ServerDeploy,
) {
  if (deployment !== undefined) return deployment;

  if (!backend || !SERVER_APP_BACKENDS.includes(backend)) {
    return "none";
  }

  // Auto-select cloudflare for workers runtime since it's the only valid option
  if (runtime === "workers") {
    return "cloudflare";
  }

  if (runtime !== "bun" && runtime !== "node") {
    return "none";
  }

  const options: DeploymentOption[] = (["docker", "vercel", "none"] as const).map((deploy) => {
    const { label, hint } =
      deploy === "none"
        ? { label: "None", hint: "Skip deployment setup" }
        : getDeploymentDisplay(deploy);
    return { value: deploy, label, hint };
  });

  const response = await navigableSelect<ServerDeploy>({
    message: "Choose server deployment",
    options,
    initialValue: preferValidInitial(options, previousValue, DEFAULT_CONFIG.serverDeploy),
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}

export async function getServerDeploymentToAdd(
  runtime?: Runtime,
  existingDeployment?: ServerDeploy,
  backend?: Backend,
) {
  if (!backend || !SERVER_APP_BACKENDS.includes(backend)) {
    return "none";
  }

  // A project can only have one server deployment target; nothing to add.
  if (existingDeployment && existingDeployment !== "none") {
    return "none";
  }

  const options: DeploymentOption[] = [];

  if (runtime === "workers") {
    const { label, hint } = getDeploymentDisplay("cloudflare");
    options.push({
      value: "cloudflare",
      label,
      hint,
    });
  }

  if (runtime === "bun" || runtime === "node") {
    for (const deploy of ["docker", "vercel"] as const) {
      const { label, hint } = getDeploymentDisplay(deploy);
      options.push({
        value: deploy,
        label,
        hint,
      });
    }
  }

  if (options.length === 0) {
    return "none";
  }

  const response = await navigableSelect<ServerDeploy>({
    message: "Select server deployment",
    options,
    initialValue: DEFAULT_CONFIG.serverDeploy,
  });

  if (isCancel(response)) throw new UserCancelledError({ message: "Operation cancelled" });

  return response;
}
