import { isCancel, log, select } from "@clack/prompts";
import { Result } from "better-result";
import { type ExecaError, execa } from "execa";
import fs from "fs-extra";
import path from "node:path";
import pc from "picocolors";

import type { PackageManager, ProjectConfig } from "../../types";

import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import {
  DatabaseSetupError,
  databaseSetupError,
  UserCancelledError,
  userCancelled,
} from "../../utils/errors";
import { getPackageExecutionArgs } from "../../utils/package-runner";

type SupabaseSetupResult = Result<void, DatabaseSetupError | UserCancelledError>;

async function writeSupabaseEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  databaseUrl: string,
): Promise<Result<void, DatabaseSetupError>> {
  return Result.tryPromise({
    try: async () => {
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
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "supabase",
        message: `Failed to update .env file: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

function extractDbUrl(output: string): string | null {
  const dbUrlMatch = output.match(/DB URL:\s*(postgresql:\/\/[^\s]+)/);
  return dbUrlMatch?.[1] ?? null;
}

async function initializeSupabase(
  serverDir: string,
  packageManager: PackageManager,
): Promise<Result<void, DatabaseSetupError>> {
  log.info("Initializing Supabase project...");
  return Result.tryPromise({
    try: async () => {
      const supabaseInitArgs = getPackageExecutionArgs(packageManager, "supabase init");
      await execa(supabaseInitArgs[0], supabaseInitArgs.slice(1), {
        cwd: serverDir,
        stdio: "inherit",
      });
      log.success("Supabase project initialized");
    },
    catch: (e) => {
      const error = e as Error;
      const isNotFound = error.message?.includes("ENOENT");
      const message = isNotFound
        ? "Supabase CLI not found. Please install it globally (npm install -g supabase) or ensure it's in your PATH."
        : `Failed to initialize Supabase project: ${error.message ?? String(e)}`;

      return new DatabaseSetupError({
        provider: "supabase",
        message,
        cause: e,
      });
    },
  });
}

async function startSupabase(
  serverDir: string,
  packageManager: PackageManager,
): Promise<Result<string, DatabaseSetupError>> {
  log.info("Starting Supabase services (this may take a moment)...");
  const supabaseStartArgs = getPackageExecutionArgs(packageManager, "supabase start");

  return Result.tryPromise({
    try: async () => {
      const subprocess = execa(supabaseStartArgs[0], supabaseStartArgs.slice(1), {
        cwd: serverDir,
      });

      let stdoutData = "";

      if (subprocess.stdout) {
        subprocess.stdout.on("data", (data) => {
          const text = data.toString();
          process.stdout.write(text);
          stdoutData += text;
        });
      }

      if (subprocess.stderr) {
        subprocess.stderr.pipe(process.stderr);
      }

      await subprocess;
      await new Promise((resolve) => setTimeout(resolve, 100));

      return stdoutData;
    },
    catch: (e) => {
      const execaError = e as ExecaError;
      const isDockerError = execaError?.message?.includes("Docker is not running");
      const message = isDockerError
        ? "Docker is not running. Please start Docker and try again."
        : `Failed to start Supabase services: ${execaError?.message ?? String(e)}`;

      return new DatabaseSetupError({
        provider: "supabase",
        message,
        cause: e,
      });
    },
  });
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

export async function setupSupabase(
  config: ProjectConfig,
  cliInput?: { manualDb?: boolean },
): Promise<SupabaseSetupResult> {
  const { projectDir, packageManager, backend } = config;
  const manualDb = cliInput?.manualDb ?? false;

  const serverDir = path.join(projectDir, "packages", "db");

  const ensureDirResult = await Result.tryPromise({
    try: () => fs.ensureDir(serverDir),
    catch: (e) =>
      new DatabaseSetupError({
        provider: "supabase",
        message: `Failed to create directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (ensureDirResult.isErr()) {
    return ensureDirResult;
  }

  if (manualDb) {
    displayManualSupabaseInstructions();
    return writeSupabaseEnvFile(projectDir, backend, "");
  }

  const mode = await select({
    message: "Supabase setup: choose mode",
    options: [
      {
        label: "Automatic",
        value: "auto",
        hint: "Automated setup with provider CLI, sets .env",
      },
      {
        label: "Manual",
        value: "manual",
        hint: "Manual setup, add env vars yourself",
      },
    ],
    initialValue: "auto",
  });

  if (isCancel(mode)) {
    return userCancelled("Operation cancelled");
  }

  if (mode === "manual") {
    displayManualSupabaseInstructions();
    return writeSupabaseEnvFile(projectDir, backend, "");
  }

  const initResult = await initializeSupabase(serverDir, packageManager);
  if (initResult.isErr()) {
    log.error(pc.red(initResult.error.message));
    displayManualSupabaseInstructions();
    return writeSupabaseEnvFile(projectDir, backend, "");
  }

  const startResult = await startSupabase(serverDir, packageManager);
  if (startResult.isErr()) {
    log.error(pc.red(startResult.error.message));
    displayManualSupabaseInstructions();
    return writeSupabaseEnvFile(projectDir, backend, "");
  }

  const supabaseOutput = startResult.value;
  const dbUrl = extractDbUrl(supabaseOutput);

  if (dbUrl) {
    const envResult = await writeSupabaseEnvFile(projectDir, backend, dbUrl);
    if (envResult.isOk()) {
      log.success(pc.green("Supabase local development setup ready!"));
    } else {
      log.error(pc.red("Supabase setup completed, but failed to update .env automatically."));
      displayManualSupabaseInstructions(supabaseOutput);
    }
    return envResult;
  }

  log.error(pc.yellow("Supabase started, but could not extract DB URL automatically."));
  displayManualSupabaseInstructions(supabaseOutput);
  return databaseSetupError(
    "supabase",
    "Could not extract database URL from Supabase output. Please configure manually.",
  );
}
