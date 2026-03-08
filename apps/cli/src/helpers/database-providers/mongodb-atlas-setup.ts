import path from "node:path";

import { cancel, isCancel, select, text } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";
import fs from "fs-extra";
import pc from "picocolors";

import type { ProjectConfig } from "../../types";
import { commandExists } from "../../utils/command-exists";
import { isSilent } from "../../utils/context";
import { addEnvVariablesToFile, type EnvVariable } from "../../utils/env-utils";
import {
  DatabaseSetupError,
  databaseSetupError,
  UserCancelledError,
  userCancelled,
} from "../../utils/errors";
import { cliLog } from "../../utils/terminal-output";
import {
  type DatabaseSetupCliOptions,
  type DbSetupMode,
  resolveDbSetupMode,
} from "../core/db-setup-options";

type MongoDBConfig = {
  connectionString: string;
};

type MongoDBSetupResult = Result<void, DatabaseSetupError | UserCancelledError>;

async function checkAtlasCLI(): Promise<boolean> {
  const exists = await commandExists("atlas");
  if (exists) {
    cliLog.info("MongoDB Atlas CLI found");
  } else {
    cliLog.warn(pc.yellow("MongoDB Atlas CLI not found"));
  }
  return exists;
}

async function initMongoDBAtlas(
  serverDir: string,
): Promise<Result<MongoDBConfig, DatabaseSetupError | UserCancelledError>> {
  const hasAtlas = await checkAtlasCLI();

  if (!hasAtlas) {
    cliLog.info(
      pc.yellow(
        "Please install it from: https://www.mongodb.com/docs/atlas/cli/current/install-atlas-cli/",
      ),
    );
    return databaseSetupError("mongodb-atlas", "MongoDB Atlas CLI not found");
  }

  cliLog.info("Running MongoDB Atlas setup...");

  const deployResult = await Result.tryPromise({
    try: async () => {
      await $({ cwd: serverDir, stdio: "inherit" })`atlas deployments setup`;
      cliLog.success("MongoDB Atlas deployment ready");
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "mongodb-atlas",
        message: `Failed to setup MongoDB Atlas deployment: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (deployResult.isErr()) {
    return deployResult;
  }

  const connectionString = await text({
    message: "Enter your MongoDB connection string:",
    placeholder: "mongodb+srv://username:password@cluster.mongodb.net/database",
    validate(value) {
      if (!value) return "Please enter a connection string";
      if (!value.startsWith("mongodb")) {
        return "URL should start with mongodb:// or mongodb+srv://";
      }
    },
  });

  if (isCancel(connectionString)) {
    cancel("MongoDB setup cancelled");
    return userCancelled("MongoDB setup cancelled");
  }

  return Result.ok({
    connectionString: connectionString as string,
  });
}

async function writeEnvFile(
  projectDir: string,
  backend: ProjectConfig["backend"],
  config?: MongoDBConfig,
): Promise<Result<void, DatabaseSetupError>> {
  return Result.tryPromise({
    try: async () => {
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
    },
    catch: (e) =>
      new DatabaseSetupError({
        provider: "mongodb-atlas",
        message: `Failed to update environment configuration: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });
}

function displayManualSetupInstructions() {
  cliLog.info(`
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
  cliInput?: DatabaseSetupCliOptions,
): Promise<MongoDBSetupResult> {
  const { projectDir, backend } = config;
  const setupMode = resolveDbSetupMode("mongodb-atlas", {
    manualDb: cliInput?.manualDb,
    dbSetupOptions: cliInput?.dbSetupOptions ?? config.dbSetupOptions,
  });

  const serverDir = path.join(projectDir, "packages/db");

  const ensureDirResult = await Result.tryPromise({
    try: () => fs.ensureDir(serverDir),
    catch: (e) =>
      new DatabaseSetupError({
        provider: "mongodb-atlas",
        message: `Failed to create directory: ${e instanceof Error ? e.message : String(e)}`,
        cause: e,
      }),
  });

  if (ensureDirResult.isErr()) {
    return ensureDirResult;
  }

  if (setupMode === "manual") {
    cliLog.info("MongoDB Atlas manual setup selected");
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions();
    return Result.ok(undefined);
  }

  let mode: DbSetupMode | undefined = setupMode;

  if (!mode) {
    if (isSilent()) {
      cliLog.warn(
        pc.yellow(
          "MongoDB Atlas automatic setup requires interactive input. Falling back to manual setup.",
        ),
      );
      const envResult = await writeEnvFile(projectDir, backend);
      if (envResult.isErr()) {
        return envResult;
      }
      displayManualSetupInstructions();
      return Result.ok(undefined);
    }

    const promptedMode = await select<DbSetupMode>({
      message: "MongoDB Atlas setup: choose mode",
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

  if (mode === "manual") {
    cliLog.info("MongoDB Atlas manual setup selected");
    const envResult = await writeEnvFile(projectDir, backend);
    if (envResult.isErr()) {
      return envResult;
    }
    displayManualSetupInstructions();
    return Result.ok(undefined);
  }

  const mongoConfigResult = await initMongoDBAtlas(serverDir);

  if (mongoConfigResult.isOk()) {
    const envResult = await writeEnvFile(projectDir, backend, mongoConfigResult.value);
    if (envResult.isErr()) {
      return envResult;
    }
    cliLog.success(pc.green("MongoDB Atlas setup complete! Connection saved to .env file."));
    return Result.ok(undefined);
  }

  // Handle errors - check for user cancellation
  if (UserCancelledError.is(mongoConfigResult.error)) {
    return mongoConfigResult;
  }

  cliLog.warn(pc.yellow("Falling back to local MongoDB configuration"));
  const envResult = await writeEnvFile(projectDir, backend);
  if (envResult.isErr()) {
    return envResult;
  }
  displayManualSetupInstructions();
  return Result.ok(undefined);
}
