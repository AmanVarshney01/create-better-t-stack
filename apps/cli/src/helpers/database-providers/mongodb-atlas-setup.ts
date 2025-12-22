import path from "node:path";
import { log } from "../../utils/logger";
import { $ } from "bun";
import fs from "fs-extra";
import pc from "picocolors";
import type { ProjectConfig } from "../../types";
import { commandExists } from "../../utils/command-exists";
import { addEnvVariablesToFile, type EnvVariable } from "../core/env-setup";

type MongoDBConfig = {
  connectionString: string;
};

export type MongoDBAtlasSetupOptions = {
  mode?: "auto" | "manual";
  connectionString?: string;
};

async function checkAtlasCLI() {
  try {
    const exists = await commandExists("atlas");
    if (exists) {
      log.info("MongoDB Atlas CLI found");
    } else {
      log.warn("MongoDB Atlas CLI not found");
    }
    return exists;
  } catch {
    log.error("Error checking MongoDB Atlas CLI");
    return false;
  }
}

async function initMongoDBAtlas(serverDir: string, connectionString?: string) {
  try {
    const hasAtlas = await checkAtlasCLI();

    if (!hasAtlas) {
      log.error("MongoDB Atlas CLI not found.");
      log.info(
        "Please install it from: https://www.mongodb.com/docs/atlas/cli/current/install-atlas-cli/",
      );
      return null;
    }

    log.info("Running MongoDB Atlas setup...");

    await $`atlas deployments setup`;

    log.success("MongoDB Atlas deployment ready");

    // If no connection string provided, we can't proceed without user input
    // For TUI mode, the connection string should be passed as a parameter
    if (!connectionString) {
      log.warn("No connection string provided. Please add it manually to .env");
      return null;
    }

    return {
      connectionString,
    };
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message);
    }
    return null;
  }
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: MongoDBConfig,
) {
  try {
    const targetApp = backend === "self" ? "apps/web" : "apps/server";
    const envPath = path.join(projectDir, targetApp, ".env");
    const variables: EnvVariable[] = [
      {
        key: "DATABASE_URL",
        value: config?.connectionString ?? "mongodb://localhost:27017/mydb",
        condition: true,
      },
    ];
    await addEnvVariablesToFile(envPath, variables);
  } catch {
    log.error("Failed to update environment configuration");
  }
}

function displayManualSetupInstructions() {
  log.info(`
${pc.green("MongoDB Atlas Manual Setup Instructions:")}

1. Install Atlas CLI:
   ${pc.blue("https://www.mongodb.com/docs/atlas/cli/stable/install-atlas-cli/")}

2. Run the following command and follow the prompts:
   ${pc.blue("atlas deployments setup")}

3. Get your connection string from the Atlas dashboard:
   Format: ${pc.dim("mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE_NAME")}

4. Add the connection string to your .env file:
   ${pc.dim('DATABASE_URL="your_connection_string"')}
`);
}

export async function setupMongoDBAtlas(
  config: ProjectConfig,
  options: MongoDBAtlasSetupOptions = {},
) {
  const { projectDir, backend } = config;
  const mode = options.mode ?? "auto";
  const connectionString = options.connectionString;

  const serverDir = path.join(projectDir, "packages/db");
  try {
    await fs.ensureDir(serverDir);

    if (mode === "manual") {
      log.info("MongoDB Atlas manual setup selected");
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
      return;
    }

    const mongoConfig = await initMongoDBAtlas(serverDir, connectionString);

    if (mongoConfig) {
      await writeEnvFile(projectDir, backend, mongoConfig);
      log.success("MongoDB Atlas setup complete! Connection saved to .env file.");
    } else {
      log.warn("Falling back to local MongoDB configuration");
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
    }
  } catch (error) {
    log.error(
      `Error during MongoDB Atlas setup: ${error instanceof Error ? error.message : String(error)}`,
    );

    try {
      await writeEnvFile(projectDir, backend);
      displayManualSetupInstructions();
    } catch {}
  }
}
