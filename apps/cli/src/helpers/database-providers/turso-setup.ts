import os from "node:os";
import path from "node:path";

import { confirm, isCancel, select, text } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";
import { commandExists } from "../../utils/command-exists";
import { isSilent } from "../../utils/context";
import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import { DatabaseSetupError, UserCancelledError, userCancelled } from "../../utils/errors";
import { cliLog, createSpinner } from "../../utils/terminal-output";
import {
  type DatabaseSetupCliOptions,
  type DbSetupMode,
  resolveDbSetupMode,
} from "../core/db-setup-options";

type TursoConfig = {
  dbUrl: string;
  authToken: string;
};

type TursoSetupResult = Result<void, DatabaseSetupError | UserCancelledError>;

async function isTursoInstalled(): Promise<boolean> {
  return commandExists("turso");
}

async function isTursoLoggedIn(): Promise<boolean> {
  const result = await Result.tryPromise({
    try: async () => {
      const output = await $`turso auth whoami`;
      return !output.stdout.includes("You are not logged in");
    },
    catch: () => false,
  });
  return result.isOk() ? result.value : false;
}

async function loginToTurso(): Promise<Result<void, DatabaseSetupError>> {
  const s = createSpinner();
  s.start("Logging in to Turso...");

  return Result.tryPromise({
    try: async () => {
      await $`turso auth login`;
      s.stop("Logged into Turso");
    },
    catch: (e) => {
      s.stop(pc.red("Failed to log in to Turso"));
      return new DatabaseSetupError({
        provider: "turso",
        message: `Failed to log in to Turso: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });
}

async function installTursoCLI(isMac: boolean): Promise<Result<void, DatabaseSetupError>> {
  const s = createSpinner();
  s.start("Installing Turso CLI...");

  return Result.tryPromise({
    try: async () => {
      if (isMac) {
        await $`brew install tursodatabase/tap/turso`;
      } else {
        const { stdout: installScript } = await $`curl -sSfL https://get.tur.so/install.sh`;
        await $`bash -c '${installScript}'`;
      }
      s.stop("Turso CLI installed");
    },
    catch: (e) => {
      const error = e as Error;
      const isCancelled = error.message?.includes("User force closed");
      s.stop(
        isCancelled ? "Turso CLI installation cancelled" : pc.red("Failed to install Turso CLI"),
      );

      return new DatabaseSetupError({
        provider: "turso",
        message: isCancelled
          ? "Installation cancelled by user"
          : `Failed to install Turso CLI: ${error.message ?? String(e)}`,
        cause: e,
      });
    },
  });
}

type TursoGroup = {
  name: string;
  locations: string;
  version: string;
  status: string;
};

async function getTursoGroups(): Promise<TursoGroup[]> {
  const s = createSpinner();
  s.start("Fetching Turso groups...");

  const result = await Result.tryPromise({
    try: async () => {
      const { stdout } = await $`turso group list`;
      const lines = stdout.trim().split("\n");

      if (lines.length <= 1) {
        s.stop("No Turso groups found");
        return [];
      }

      const groups = lines.slice(1).map((line) => {
        const [name, locations, version, status] = line.trim().split(/\s{2,}/);
        return { name, locations, version, status };
      });

      s.stop(`Found ${groups.length} Turso groups`);
      return groups;
    },
    catch: () => {
      s.stop(pc.red("Error fetching Turso groups"));
      return [] as TursoGroup[];
    },
  });

  return result.isOk() ? result.value : [];
}

async function selectTursoGroup(): Promise<Result<string | null, UserCancelledError>> {
  const groups = await getTursoGroups();

  if (groups.length === 0) {
    return Result.ok(null);
  }

  if (groups.length === 1) {
    cliLog.info(`Using the only available group: ${pc.blue(groups[0].name)}`);
    return Result.ok(groups[0].name);
  }

  const groupOptions = groups.map((group) => ({
    value: group.name,
    label: `${group.name} (${group.locations})`,
  }));

  const selectedGroup = await select({
    message: "Select a Turso database group:",
    options: groupOptions,
  });

  if (isCancel(selectedGroup)) {
    return userCancelled("Operation cancelled");
  }

  return Result.ok(selectedGroup as string);
}

async function createTursoDatabase(
  dbName: string,
  groupName: string | null,
): Promise<Result<TursoConfig, DatabaseSetupError>> {
  const s = createSpinner();
  s.start(`Creating Turso database "${dbName}"${groupName ? ` in group "${groupName}"` : ""}...`);

  const createResult = await Result.tryPromise({
    try: async () => {
      if (groupName) {
        await $`turso db create ${dbName} --group ${groupName}`;
      } else {
        await $`turso db create ${dbName}`;
      }
      s.stop(`Turso database "${dbName}" created`);
    },
    catch: (e) => {
      const error = e as Error;
      s.stop(pc.red(`Failed to create database "${dbName}"`));

      if (error.message?.includes("already exists")) {
        return new DatabaseSetupError({
          provider: "turso",
          message: "DATABASE_EXISTS",
          cause: e,
        });
      }

      return new DatabaseSetupError({
        provider: "turso",
        message: `Failed to create database: ${error.message ?? String(e)}`,
        cause: e,
      });
    },
  });

  if (createResult.isErr()) {
    return createResult;
  }

  s.start("Retrieving database connection details...");

  return Result.tryPromise({
    try: async () => {
      const { stdout: dbUrl } = await $`turso db show ${dbName} --url`;
      const { stdout: authToken } = await $`turso db tokens create ${dbName}`;

      s.stop("Database connection details retrieved");

      return {
        dbUrl: dbUrl.trim(),
        authToken: authToken.trim(),
      };
    },
    catch: (e) => {
      s.stop(pc.red("Failed to retrieve database connection details"));
      return new DatabaseSetupError({
        provider: "turso",
        message: `Failed to retrieve connection details: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      });
    },
  });
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: TursoConfig,
): Promise<Result<void, DatabaseSetupError>> {
  return Result.tryPromise({
    try: async () => {
      const targetApp = backend === "self" ? "apps/web" : "apps/server";
      const envPath = path.join(projectDir, targetApp, ".env");
      const variables: EnvVariable[] = [
        {
          key: "DATABASE_URL",
          value: config?.dbUrl ?? "",
          condition: true,
        },
        {
          key: "DATABASE_AUTH_TOKEN",
          value: config?.authToken ?? "",
          condition: true,
        },
      ];
      await addEnvVariablesToFile(envPath, variables);
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "turso",
        message: `Failed to update .env file: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

function displayManualSetupInstructions(targetApp: "apps/web" | "apps/server") {
  cliLog.info(`Manual Turso Setup Instructions:

1. Visit https://turso.tech and create an account
2. Create a new database from the dashboard
3. Get your database URL and authentication token
4. Add these credentials to the .env file in ${targetApp}/.env

DATABASE_URL=your_database_url
DATABASE_AUTH_TOKEN=your_auth_token`);
}

export async function setupTurso(
  config: ProjectConfig,
  cliInput?: DatabaseSetupCliOptions,
): Promise<TursoSetupResult> {
  const { projectDir, backend } = config;
  const targetApp: "apps/web" | "apps/server" = backend === "self" ? "apps/web" : "apps/server";
  const setupMode = resolveDbSetupMode("turso", {
    manualDb: cliInput?.manualDb,
    dbSetupOptions: cliInput?.dbSetupOptions ?? config.dbSetupOptions,
  });
  const setupSpinner = createSpinner();

  if (setupMode === "manual") {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(targetApp);
    return Result.ok(undefined);
  }

  let mode: DbSetupMode | undefined = setupMode;

  if (!mode) {
    if (isSilent()) {
      mode = "manual";
    } else {
      const promptedMode = await select<DbSetupMode>({
        message: "Turso setup: choose mode",
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

      mode = promptedMode;
    }
  }

  if (mode === "manual") {
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(targetApp);
    return Result.ok(undefined);
  }

  setupSpinner.start("Checking Turso CLI availability...");
  const platform = os.platform();
  const isMac = platform === "darwin";
  const isWindows = platform === "win32";

  if (isWindows) {
    setupSpinner.stop(pc.yellow("Turso setup not supported on Windows"));
    cliLog.warn(pc.yellow("Automatic Turso setup is not supported on Windows."));
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions(targetApp);
    return Result.ok(undefined);
  }

  setupSpinner.stop("Turso CLI availability checked");

  const isCliInstalled = await isTursoInstalled();

  if (!isCliInstalled) {
    let shouldInstall = cliInput?.dbSetupOptions?.turso?.installCli;

    if (shouldInstall === undefined) {
      if (isSilent()) {
        shouldInstall = false;
      } else {
        const promptedInstall = await confirm({
          message: "Would you like to install Turso CLI?",
          initialValue: true,
        });

        if (isCancel(promptedInstall)) {
          return userCancelled("Operation cancelled");
        }

        shouldInstall = promptedInstall;
      }
    }

    if (!shouldInstall) {
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(targetApp);
      return Result.ok(undefined);
    }

    const installResult = await installTursoCLI(isMac);
    if (installResult.isErr()) {
      cliLog.error(pc.red(installResult.error.message));
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(targetApp);
      return Result.ok(undefined);
    }
  }

  const isLoggedIn = await isTursoLoggedIn();
  if (!isLoggedIn) {
    if (isSilent()) {
      cliLog.warn(pc.yellow("Turso CLI is not logged in. Falling back to manual setup."));
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(targetApp);
      return Result.ok(undefined);
    }

    const loginResult = await loginToTurso();
    if (loginResult.isErr()) {
      cliLog.error(pc.red(loginResult.error.message));
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(targetApp);
      return Result.ok(undefined);
    }
  }

  let selectedGroup =
    cliInput?.dbSetupOptions?.turso?.groupName ?? config.dbSetupOptions?.turso?.groupName ?? null;

  if (!selectedGroup) {
    if (isSilent()) {
      const groups = await getTursoGroups();
      selectedGroup = groups[0]?.name ?? null;
    } else {
      const groupResult = await selectTursoGroup();
      if (groupResult.isErr()) {
        return groupResult;
      }
      selectedGroup = groupResult.value;
    }
  }

  let suggestedName =
    cliInput?.dbSetupOptions?.turso?.databaseName ??
    config.dbSetupOptions?.turso?.databaseName ??
    path.basename(projectDir);

  if (isSilent()) {
    const createResult = await createTursoDatabase(suggestedName, selectedGroup);
    if (createResult.isErr()) {
      cliLog.error(pc.red(createResult.error.message));
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(targetApp);
      cliLog.success("Setup completed with manual configuration required.");
      return Result.ok(undefined);
    }

    const envResult = await writeEnvFile(projectDir, backend, createResult.value);
    if (envResult.isErr()) {
      return envResult;
    }

    cliLog.success("Turso database setup completed successfully!");
    return Result.ok(undefined);
  }

  while (true) {
    const dbNameResponse = await text({
      message: "Enter a name for your database:",
      defaultValue: suggestedName,
      initialValue: suggestedName,
      placeholder: suggestedName,
    });

    if (isCancel(dbNameResponse)) {
      return userCancelled("Operation cancelled");
    }

    const dbName = dbNameResponse as string;

    const createResult = await createTursoDatabase(dbName, selectedGroup);

    if (createResult.isErr()) {
      if (createResult.error.message === "DATABASE_EXISTS") {
        cliLog.warn(pc.yellow(`Database "${pc.red(dbName)}" already exists`));
        suggestedName = `${dbName}-${Math.floor(Math.random() * 1000)}`;
        continue;
      }
      cliLog.error(pc.red(createResult.error.message));
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions(targetApp);
      cliLog.success("Setup completed with manual configuration required.");
      return Result.ok(undefined);
    }

    const envResult = await writeEnvFile(projectDir, backend, createResult.value);
    if (envResult.isErr()) {
      return envResult;
    }

    cliLog.success("Turso database setup completed successfully!");
    return Result.ok(undefined);
  }
}
