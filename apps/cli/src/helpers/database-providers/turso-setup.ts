import os from "node:os";
import path from "node:path";
import { log } from "../../utils/logger";
import consola from "consola";
import { $ } from "bun";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { commandExists } from "../../utils/command-exists";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

type TursoConfig = {
  dbUrl: string;
  authToken: string;
};

export type TursoSetupOptions = {
  mode?: "auto" | "manual";
  dbName?: string;
  installCli?: boolean;
};

async function isTursoInstalled() {
  return commandExists("turso");
}

async function isTursoLoggedIn() {
  try {
    const output = await $`turso auth whoami`.text();
    return !output.includes("You are not logged in");
  } catch {
    return false;
  }
}

async function loginToTurso() {
  try {
    log.step("Logging in to Turso...");
    await $`turso auth login`;
    log.success("Logged into Turso");
    return true;
  } catch {
    log.error("Failed to log in to Turso");
    return false;
  }
}

async function installTursoCLI(isMac: boolean) {
  try {
    log.step("Installing Turso CLI...");

    if (isMac) {
      await $`brew install tursodatabase/tap/turso`;
    } else {
      const installScript = await $`curl -sSfL https://get.tur.so/install.sh`.text();
      await $`bash -c ${installScript}`;
    }

    log.success("Turso CLI installed");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("User force closed")) {
      log.warn("Turso CLI installation cancelled by user");
      throw new Error("Installation cancelled");
    }
    log.error("Failed to install Turso CLI");
    return false;
  }
}

async function getTursoGroups() {
  try {
    log.step("Fetching Turso groups...");
    const stdout = await $`turso group list`.text();
    const lines = stdout.trim().split("\n");

    if (lines.length <= 1) {
      log.info("No Turso groups found");
      return [];
    }

    const groups = lines.slice(1).map((line: string) => {
      const [name, locations, version, status] = line.trim().split(/\s{2,}/);
      return { name, locations, version, status };
    });

    log.success(`Found ${groups.length} Turso groups`);
    return groups;
  } catch (error) {
    log.error("Error fetching Turso groups");
    console.error("Error fetching Turso groups:", error);
    return [];
  }
}

async function selectTursoGroup() {
  const groups = await getTursoGroups();

  if (groups.length === 0) {
    return null;
  }

  // Use the first available group by default in TUI mode
  log.info(`Using group: ${pc.blue(groups[0].name)}`);
  return groups[0].name;
}

async function createTursoDatabase(dbName: string, groupName: string | null) {
  try {
    log.step(
      `Creating Turso database "${dbName}"${groupName ? ` in group "${groupName}"` : ""}...`,
    );

    if (groupName) {
      await $`turso db create ${dbName} --group ${groupName}`;
    } else {
      await $`turso db create ${dbName}`;
    }

    log.success(`Turso database "${dbName}" created`);
  } catch (error) {
    log.error(`Failed to create database "${dbName}"`);
    if (error instanceof Error && error.message.includes("already exists")) {
      throw new Error("DATABASE_EXISTS");
    }
    throw error;
  }

  log.step("Retrieving database connection details...");
  try {
    const dbUrl = await $`turso db show ${dbName} --url`.text();
    const authToken = await $`turso db tokens create ${dbName}`.text();

    log.success("Database connection details retrieved");

    return {
      dbUrl: dbUrl.trim(),
      authToken: authToken.trim(),
    };
  } catch {
    log.error("Failed to retrieve database connection details");
    return undefined;
  }
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: TursoConfig,
) {
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
}

function displayManualSetupInstructions() {
  log.info(`Manual Turso Setup Instructions:

1. Visit https://turso.tech and create an account
2. Create a new database from the dashboard
3. Get your database URL and authentication token
4. Add these credentials to the .env file in apps/server/.env

DATABASE_URL=your_database_url
DATABASE_AUTH_TOKEN=your_auth_token`);
}

export async function setupTurso(config: ProjectConfig, options: TursoSetupOptions = {}) {
  const { projectDir, backend } = config;
  const mode = options.mode ?? "auto";
  const dbName = options.dbName ?? path.basename(projectDir);
  const installCli = options.installCli ?? true;

  try {
    if (mode === "manual") {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
      return;
    }

    log.step("Checking Turso CLI availability...");
    const platform = os.platform();
    const isMac = platform === "darwin";
    const isWindows = platform === "win32";

    if (isWindows) {
      log.warn("Automatic Turso setup is not supported on Windows.");
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
      return;
    }

    const isCliInstalled = await isTursoInstalled();

    if (!isCliInstalled) {
      if (installCli) {
        const installed = await installTursoCLI(isMac);
        if (!installed) {
          await writeEnvFile(projectDir, backend);
          displayManualSetupInstructions();
          return;
        }
      } else {
        await writeEnvFile(projectDir, backend);
        displayManualSetupInstructions();
        return;
      }
    }

    const isLoggedIn = await isTursoLoggedIn();
    if (!isLoggedIn) {
      const loggedIn = await loginToTurso();
      if (!loggedIn) {
        await writeEnvFile(projectDir, backend);
        displayManualSetupInstructions();
        return;
      }
    }

    const selectedGroup = await selectTursoGroup();

    let finalDbName = dbName;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const tursoConfig = await createTursoDatabase(finalDbName, selectedGroup);
        if (tursoConfig) {
          await writeEnvFile(projectDir, backend, tursoConfig);
        } else {
          await writeEnvFile(projectDir, backend);
        }
        break;
      } catch (error) {
        if (error instanceof Error && error.message === "DATABASE_EXISTS") {
          log.warn(`Database "${finalDbName}" already exists, trying alternative name...`);
          finalDbName = `${dbName}-${Math.floor(Math.random() * 1000)}`;
          attempts++;
        } else {
          throw error;
        }
      }
    }

    log.success("Turso database setup completed successfully!");
  } catch (error) {
    consola.error(
      pc.red(`Error during Turso setup: ${error instanceof Error ? error.message : String(error)}`),
    );
    await writeEnvFile(projectDir, backend);
    displayManualSetupInstructions();
    log.info("Setup completed with manual configuration required.");
  }
}
