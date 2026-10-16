import path from "node:path";

import { isCancel, select } from "@clack/prompts";
import { Result } from "better-result";
import { type ExecaError, execa } from "execa";
import fs from "fs-extra";
import pc from "picocolors";
import { z } from "zod";

import { DbSetupModeSchema } from "../../types";
import type { PackageManager, ProjectConfig } from "../../types";
import { isSilent } from "../../utils/context";
import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { getInterruptSignal } from "../../utils/interrupt";
import { getPackageExecutionArgs, getPackageExecutionCommand } from "../../utils/package-runner";
import { cliLog } from "../../utils/terminal-output";
import {
  type DatabaseSetupCliOptions,
  type DbSetupMode,
  resolveDbSetupMode,
} from "../core/db-setup-options";
import { prepareGitRepository } from "../core/git";

type SupabaseSetupResult = Result<void, DatabaseSetupError | UserCancelledError>;

// Stack flags and output are experimental, so use the tested release for every command.
export const SUPABASE_CLI_PACKAGE = "supabase@2.121.0";
const stackEnv = { SUPABASE_EXPERIMENTAL_STACK: "1" };
const statusSchema = z.object({
  DB_URL: z.url().refine((value) => ["postgres:", "postgresql:"].includes(new URL(value).protocol)),
});

async function writeSupabaseEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  databaseUrl: string,
): Promise<Result<void, DatabaseSetupError>> {
  return Result.tryPromise({
    try: async () => {
      const targetApp = backend === "self" ? "apps/web" : "apps/server";
      const envPath = path.join(projectDir, targetApp, ".env");
      const variables: EnvVariable[] = [
        {
          key: "DATABASE_URL",
          value: databaseUrl,
          condition: true,
        },
        {
          key: "DIRECT_URL",
          value: databaseUrl,
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

async function readSupabaseStatus(serverDir: string, packageManager: PackageManager) {
  const statusArgs = getPackageExecutionArgs(
    packageManager,
    `${SUPABASE_CLI_PACKAGE} status --agent no --env --output-format json`,
  );
  return Result.tryPromise({
    try: async () => {
      const { stdout } = await execa(statusArgs[0], statusArgs.slice(1), {
        cwd: serverDir,
        env: stackEnv,
      });
      return statusSchema.parse(JSON.parse(stdout)).DB_URL;
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "supabase",
        message:
          "Could not read the Supabase database URL. Run Supabase status and configure DATABASE_URL and DIRECT_URL manually.",
        cause: e,
      }),
  });
}

async function initializeSupabase(
  serverDir: string,
  packageManager: PackageManager,
): Promise<Result<void, DatabaseSetupError>> {
  cliLog.info("Initializing Supabase project...");
  return Result.tryPromise({
    try: async () => {
      if (await fs.pathExists(path.join(serverDir, "supabase/config.toml"))) return;
      const supabaseInitArgs = getPackageExecutionArgs(
        packageManager,
        `${SUPABASE_CLI_PACKAGE} init --agent no`,
      );
      await execa(supabaseInitArgs[0], supabaseInitArgs.slice(1), {
        cwd: serverDir,
        stdio: "inherit",
        env: stackEnv,
      });
      cliLog.success("Supabase project initialized");
    },
    catch: (e) => {
      const error = e as Error;
      const isNotFound = error.message?.includes("ENOENT");
      const message = isNotFound
        ? "Could not run the Supabase CLI. Ensure your selected package manager is installed and available in PATH."
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
  cliLog.info("Starting Supabase services (this may take a moment)...");
  const supabaseStartArgs = getPackageExecutionArgs(
    packageManager,
    `${SUPABASE_CLI_PACKAGE} start --agent no --preparation on-demand`,
  );

  return Result.tryPromise({
    try: async () => {
      const subprocess = execa(supabaseStartArgs[0], supabaseStartArgs.slice(1), {
        cwd: serverDir,
        env: stackEnv,
      });

      let stdoutData = "";

      if (subprocess.stdout) {
        subprocess.stdout.on("data", (data) => {
          const text = data.toString();
          if (!isSilent()) {
            process.stdout.write(text);
          }
          stdoutData += text;
        });
      }

      if (subprocess.stderr) {
        subprocess.stderr.pipe(process.stderr);
      }

      await subprocess;

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

function displayManualSupabaseInstructions(
  targetApp: "apps/web" | "apps/server",
  packageManager: PackageManager,
  output?: string | null,
) {
  const command = getPackageExecutionCommand(packageManager, SUPABASE_CLI_PACKAGE);
  cliLog.info(
    `"Manual Supabase Setup Instructions:"
1. Open your project's \`packages/db\` directory.
2. Run \`${command} init\` if \`supabase/config.toml\` does not exist.
3. Set \`stack = true\` under \`[experimental]\` in \`supabase/config.toml\` and remove fixed port settings to allow separate stacks per branch/worktree.
4. Run \`${command} start --preparation on-demand\`. Docker/Podman is used when available; otherwise the native runtime supports macOS 14+ on Apple silicon and Linux with glibc 2.35+ on amd64/arm64. Windows and Intel Macs require Docker.
5. Run \`${command} status --env --output-format json\` and copy \`DB_URL\`. Stack commands are experimental; use the pinned CLI version.${
      output
        ? `
${pc.bold("Relevant output from `supabase start`:")}
${pc.dim(output)}`
        : ""
    }
6. Add the database URL to the .env file in \`${targetApp}/.env\` as \`DATABASE_URL\` and \`DIRECT_URL\`:
			${pc.gray('DATABASE_URL="your_supabase_db_url"\nDIRECT_URL="your_supabase_db_url"')}`,
  );
}

export async function setupSupabase(
  config: ProjectConfig,
  cliInput?: DatabaseSetupCliOptions,
): Promise<SupabaseSetupResult> {
  const { projectDir, packageManager, backend } = config;
  const targetApp: "apps/web" | "apps/server" = backend === "self" ? "apps/web" : "apps/server";
  const setupMode = resolveDbSetupMode("supabase", {
    manualDb: cliInput?.manualDb,
    dbSetupOptions: cliInput?.dbSetupOptions ?? config.dbSetupOptions,
  });

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

  if (setupMode === "manual") {
    displayManualSupabaseInstructions(targetApp, packageManager);
    return Result.ok();
  }

  let mode: DbSetupMode | undefined = setupMode;

  if (!mode) {
    if (isSilent()) {
      mode = "manual";
    } else {
      const promptedMode = await select<DbSetupMode>({
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

      if (isCancel(promptedMode)) {
        return userCancelled("Operation cancelled");
      }

      mode = DbSetupModeSchema.parse(promptedMode);
    }
  }

  if (mode === "manual") {
    displayManualSupabaseInstructions(targetApp, packageManager);
    return Result.ok();
  }

  // The stack identity includes the Git branch. Establish it before starting the
  // database; the post-scaffold Git step will commit the completed project later.
  const gitResult = await prepareGitRepository(projectDir, config.git, getInterruptSignal());
  if (gitResult.isErr()) {
    return Result.err(
      new DatabaseSetupError({
        provider: "supabase",
        message: `Failed to prepare Git before Supabase setup: ${gitResult.error.message}`,
        cause: gitResult.error,
      }),
    );
  }

  const initResult = await initializeSupabase(serverDir, packageManager);
  if (initResult.isErr()) {
    cliLog.error(pc.red(initResult.error.message));
    displayManualSupabaseInstructions(targetApp, packageManager);
    return initResult;
  }

  cliLog.info(`Using experimental Supabase stacks with ${SUPABASE_CLI_PACKAGE}.`);
  const startResult = await startSupabase(serverDir, packageManager);
  if (startResult.isErr()) {
    cliLog.error(pc.red(startResult.error.message));
    displayManualSupabaseInstructions(targetApp, packageManager);
    return startResult;
  }

  const supabaseOutput = startResult.value;
  const statusResult = await readSupabaseStatus(serverDir, packageManager);

  if (statusResult.isOk()) {
    const envResult = await writeSupabaseEnvFile(projectDir, backend, statusResult.value);
    if (envResult.isOk()) {
      cliLog.success(pc.green("Supabase local development setup ready!"));
    } else {
      cliLog.error(pc.red("Supabase setup completed, but failed to update .env automatically."));
      displayManualSupabaseInstructions(targetApp, packageManager, supabaseOutput);
    }
    return envResult;
  }

  cliLog.error(pc.yellow("Supabase started, but could not extract DB URL automatically."));
  displayManualSupabaseInstructions(targetApp, packageManager, supabaseOutput);
  return statusResult;
}
