import { isCancel, log, select, text } from "@clack/prompts";
import consola from "consola";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { exitCancelled } from "../../utils/errors";

type UpstashConfig = {
  redisUrl: string;
  redisToken: string;
};

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: UpstashConfig,
) {
  try {
    const targetApp = backend === "self" ? "apps/web" : "apps/server";
    const envPath = path.join(projectDir, targetApp, ".env");
    const variables: EnvVariable[] = [
      {
        key: "UPSTASH_REDIS_REST_URL",
        value: config?.redisUrl ?? "",
        condition: true,
      },
      {
        key: "UPSTASH_REDIS_REST_TOKEN",
        value: config?.redisToken ?? "",
        condition: true,
      },
    ];
    await addEnvVariablesToFile(envPath, variables);
  } catch {
    consola.error("Failed to update environment configuration");
  }
}

function displayManualSetupInstructions() {
  log.info(`
${pc.green("Upstash Redis Manual Setup Instructions:")}

1. Visit ${pc.blue("https://console.upstash.com")} and create an account

2. Create a new Redis database from the dashboard

3. Copy your REST URL and REST Token from the database details page

4. Add them to the .env file in apps/server/.env:
   ${pc.dim('UPSTASH_REDIS_REST_URL="your_rest_url"')}
   ${pc.dim('UPSTASH_REDIS_REST_TOKEN="your_rest_token"')}
`);
}

export async function setupUpstash(config: ProjectConfig, cliInput?: { manualDb?: boolean }) {
  const { projectDir, backend } = config;
  const manualDb = cliInput?.manualDb ?? false;

  const serverDir = path.join(projectDir, "packages/db");
  try {
    await fs.ensureDir(serverDir);

    if (manualDb) {
      log.info("Upstash Redis manual setup selected");
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
      return;
    }

    const mode = await select({
      message: "Upstash Redis setup: choose mode",
      options: [
        {
          label: "Enter credentials",
          value: "credentials",
          hint: "Enter your Upstash REST URL and token",
        },
        {
          label: "Manual",
          value: "manual",
          hint: "Manual setup, add env vars yourself",
        },
      ],
      initialValue: "credentials",
    });

    if (isCancel(mode)) return exitCancelled("Operation cancelled");

    if (mode === "manual") {
      log.info("Upstash Redis manual setup selected");
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
      return;
    }

    const redisUrl = await text({
      message: "Enter your Upstash Redis REST URL:",
      placeholder: "https://xxx.upstash.io",
      validate(value) {
        if (!value) return "Please enter a REST URL";
        if (!value.startsWith("https://") || !value.includes("upstash.io")) {
          return "URL should be a valid Upstash REST URL (https://xxx.upstash.io)";
        }
      },
    });

    if (isCancel(redisUrl)) return exitCancelled("Operation cancelled");

    const redisToken = await text({
      message: "Enter your Upstash Redis REST Token:",
      placeholder: "AXxxxxxxxxxxxxxxxxxxxx",
      validate(value) {
        if (!value) return "Please enter a REST token";
        if (value.length < 20) {
          return "Token appears to be too short";
        }
      },
    });

    if (isCancel(redisToken)) return exitCancelled("Operation cancelled");

    await writeEnvFile(projectDir, backend, {
      redisUrl: redisUrl as string,
      redisToken: redisToken as string,
    });

    log.success(pc.green("Upstash Redis setup complete! Credentials saved to .env file."));
  } catch (error) {
    consola.error(
      pc.red(
        `Error during Upstash setup: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );

    try {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
    } catch {}
  }
}
