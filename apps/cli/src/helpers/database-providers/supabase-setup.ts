import path from "node:path";
import { log } from "../../utils/logger";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { PackageManager, ProjectConfig } from "../../types";
import { getPackageExecutionCommand } from "../../utils/package-runner";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

export type SupabaseSetupOptions = {
  mode?: "auto" | "manual";
};

async function writeSupabaseEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  databaseUrl: string,
) {
  try {
    const targetApp = backend === "self" ? "apps/web" : "apps/server";
    const envPath = path.join(projectDir, targetApp, ".env");
    const dbUrlToUse = databaseUrl || "postgresql://postgres:postgres@127.0.0.1:54322/postgres";
    const variables: EnvVariable[] = [
      {
        key: "DATABASE_URL",
        value: dbUrlToUse,
        condition: true,
      },
      {
        key: "DIRECT_URL",
        value: dbUrlToUse,
        condition: true,
      },
    ];
    await addEnvVariablesToFile(envPath, variables);
    return true;
  } catch (error) {
    log.error("Failed to update .env file for Supabase.");
    if (error instanceof Error) {
      log.error(error.message);
    }
    return false;
  }
}

function extractDbUrl(output: string) {
  const dbUrlMatch = output.match(/DB URL:\s*(postgresql:\/\/[^\s]+)/);
  const url = dbUrlMatch?.[1];
  if (url) {
    return url;
  }
  return null;
}

async function initializeSupabase(serverDir: string, packageManager: PackageManager) {
  log.info("Initializing Supabase project...");
  try {
    const supabaseInitCommand = getPackageExecutionCommand(packageManager, "supabase init");
    await $`${{ raw: supabaseInitCommand }}`.cwd(serverDir);
    log.success("Supabase project initialized");
    return true;
  } catch (error) {
    log.error("Failed to initialize Supabase project.");
    if (error instanceof Error) {
      log.error(error.message);
    } else {
      log.error(String(error));
    }
    if (error instanceof Error && error.message.includes("ENOENT")) {
      log.error("Supabase CLI not found. Please install it globally or ensure it's in your PATH.");
      log.info("You can install it using: npm install -g supabase");
    }
    return false;
  }
}

async function startSupabase(serverDir: string, packageManager: PackageManager) {
  log.info("Starting Supabase services (this may take a moment)...");
  const supabaseStartCommand = getPackageExecutionCommand(packageManager, "supabase start");
  try {
    // Run command and capture output while also streaming to terminal
    const result = await $`${{ raw: supabaseStartCommand }}`.cwd(serverDir);
    const stdoutData = result.stdout.toString();

    await new Promise((resolve) => setTimeout(resolve, 100));

    return stdoutData;
  } catch (error) {
    log.error("Failed to start Supabase services.");
    if (error instanceof Error) {
      log.error(`Error details: ${error.message}`);
      if (error.message.includes("Docker is not running")) {
        log.error("Docker is not running. Please start Docker and try again.");
      }
    } else {
      log.error(String(error));
    }
    return null;
  }
}

function displayManualSupabaseInstructions(output?: string | null) {
  log.info(
    `"Manual Supabase Setup Instructions:"
1. Ensure Docker is installed and running.
2. Install the Supabase CLI (e.g., \`npm install -g supabase\`).
3. Run \`supabase init\` in your project's \`packages/db\` directory.
4. Run \`supabase start\` in your project's \`packages/db\` directory.
5. Copy the 'DB URL' from the output.${
      output
        ? `
${pc.bold("Relevant output from `supabase start`:")}
${pc.dim(output)}`
        : ""
    }
6. Add the DB URL to the .env file in \`packages/db/.env\` as \`DATABASE_URL\`:
			${pc.gray('DATABASE_URL="your_supabase_db_url"')}`,
  );
}

export async function setupSupabase(config: ProjectConfig, options: SupabaseSetupOptions = {}) {
  const { projectDir, packageManager, backend } = config;
  const mode = options.mode ?? "auto";

  const serverDir = path.join(projectDir, "packages", "db");

  try {
    await fs.ensureDir(serverDir);

    if (mode === "manual") {
      displayManualSupabaseInstructions();
      await writeSupabaseEnvFile(projectDir, backend, "");
      return;
    }

    const initialized = await initializeSupabase(serverDir, packageManager);
    if (!initialized) {
      displayManualSupabaseInstructions();
      return;
    }

    const supabaseOutput = await startSupabase(serverDir, packageManager);
    if (!supabaseOutput) {
      displayManualSupabaseInstructions();
      return;
    }

    const dbUrl = extractDbUrl(supabaseOutput);

    if (dbUrl) {
      const envUpdated = await writeSupabaseEnvFile(projectDir, backend, dbUrl);

      if (envUpdated) {
        log.success("Supabase local development setup ready!");
      } else {
        log.error("Supabase setup completed, but failed to update .env automatically.");
        displayManualSupabaseInstructions(supabaseOutput);
      }
    } else {
      log.error("Supabase started, but could not extract DB URL automatically.");
      displayManualSupabaseInstructions(supabaseOutput);
    }
  } catch (error) {
    if (error instanceof Error) {
      log.error(`Error during Supabase setup: ${error.message}`);
    } else {
      log.error(`An unknown error occurred during Supabase setup: ${String(error)}`);
    }
    displayManualSupabaseInstructions();
  }
}
