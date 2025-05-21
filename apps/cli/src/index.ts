import path from "node:path";
import {
  cancel,
  intro,
  isCancel,
  log,
  outro,
  select,
  spinner,
} from "@clack/prompts";
import { consola } from "consola";
import fs from "fs-extra";
import pc from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { DEFAULT_CONFIG } from "./constants";
import { createProject } from "./helpers/create-project";
import { gatherConfig } from "./prompts/config-prompts";
import { getProjectName } from "./prompts/project-name";
import type {
  ProjectAddons,
  ProjectApi,
  ProjectBackend,
  ProjectConfig,
  ProjectDBSetup,
  ProjectDatabase,
  ProjectExamples,
  ProjectFrontend,
  ProjectOrm,
  ProjectPackageManager,
  ProjectRuntime,
  YargsArgv,
} from "./types";
import { displayConfig } from "./utils/display-config";
import { generateReproducibleCommand } from "./utils/generate-reproducible-command";
import { getLatestCLIVersion } from "./utils/get-latest-cli-version";
import { renderTitle } from "./utils/render-title";

const exit = () => process.exit(0);
process.on("SIGINT", exit);
process.on("SIGTERM", exit);

async function main() {
  const startTime = Date.now();

  try {
    const argv = await yargs(hideBin(process.argv))
      .scriptName("create-better-t-stack")
      .usage(
        "$0 [project-directory] [options]",
        "Create a new Better-T Stack project"
      )
      .positional("project-directory", {
        describe: "Project name/directory",
        type: "string",
      })
      .option("yes", {
        alias: "y",
        type: "boolean",
        describe: "Use default configuration and skip prompts",
        default: false,
      })
      .option("database", {
        type: "string",
        describe: "Database type",
        choices: ["none", "sqlite", "postgres", "mysql", "mongodb"],
      })
      .option("orm", {
        type: "string",
        describe: "ORM type",
        choices: ["drizzle", "prisma", "mongoose", "none"],
      })
      .option("auth", {
        type: "boolean",
        describe: "Include authentication (use --no-auth to exclude)",
      })
      .option("frontend", {
        type: "array",
        string: true,
        describe: "Frontend types",
        choices: [
          "tanstack-router",
          "react-router",
          "tanstack-start",
          "next",
          "nuxt",
          "native-nativewind",
          "native-unistyles",
          "svelte",
          "solid",
          "none",
        ],
      })
      .option("addons", {
        type: "array",
        string: true,
        describe: "Additional addons",
        choices: [
          "pwa",
          "tauri",
          "starlight",
          "biome",
          "husky",
          "turborepo",
          "none",
        ],
      })
      .option("examples", {
        type: "array",
        string: true,
        describe: "Examples to include",
        choices: ["todo", "ai", "none"],
      })
      .option("git", {
        type: "boolean",
        describe: "Initialize git repository (use --no-git to skip)",
      })
      .option("package-manager", {
        alias: "pm",
        type: "string",
        describe: "Package manager",
        choices: ["npm", "pnpm", "bun"],
      })
      .option("install", {
        type: "boolean",
        describe: "Install dependencies (use --no-install to skip)",
      })
      .option("db-setup", {
        type: "string",
        describe: "Database setup",
        choices: [
          "turso",
          "neon",
          "prisma-postgres",
          "mongodb-atlas",
          "supabase",
          "none",
        ],
      })
      .option("backend", {
        type: "string",
        describe: "Backend framework",
        choices: [
          "hono",
          "express",
          "fastify",
          "next",
          "elysia",
          "convex",
          "none",
        ],
      })
      .option("runtime", {
        type: "string",
        describe: "Runtime",
        choices: ["bun", "node", "none"],
      })
      .option("api", {
        type: "string",
        describe: "API type",
        choices: ["trpc", "orpc", "none"],
      })
      .completion()
      .recommendCommands()
      .version(getLatestCLIVersion())
      .alias("version", "v")
      .help()
      .alias("help", "h")
      .strict()
      .wrap(null)
      .parse();

    const options = argv as YargsArgv;
    const cliProjectNameArg = options.projectDirectory;

    renderTitle();
    intro(pc.magenta("Creating a new Better-T-Stack project"));

    let currentPathInput: string;
    let finalPathInput: string;
    let finalResolvedPath: string;
    let finalBaseName: string;
    let shouldClearDirectory = false;

    if (options.yes && cliProjectNameArg) {
      currentPathInput = cliProjectNameArg;
    } else if (options.yes) {
      let defaultName = DEFAULT_CONFIG.relativePath;
      let counter = 1;
      while (
        fs.pathExistsSync(path.resolve(process.cwd(), defaultName)) &&
        fs.readdirSync(path.resolve(process.cwd(), defaultName)).length > 0
      ) {
        defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
        counter++;
      }
      currentPathInput = defaultName;
    } else {
      currentPathInput = await getProjectName(cliProjectNameArg);
    }

    while (true) {
      const resolvedPath = path.resolve(process.cwd(), currentPathInput);
      const dirExists = fs.pathExistsSync(resolvedPath);
      const dirIsNotEmpty =
        dirExists && fs.readdirSync(resolvedPath).length > 0;

      if (!dirIsNotEmpty) {
        finalPathInput = currentPathInput;
        shouldClearDirectory = false;
        break;
      }

      log.warn(
        `Directory "${pc.yellow(
          currentPathInput
        )}" already exists and is not empty.`
      );

      const action = await select<"overwrite" | "merge" | "rename" | "cancel">({
        message: "What would you like to do?",
        options: [
          {
            value: "overwrite",
            label: "Overwrite",
            hint: "Empty the directory and create the project",
          },
          {
            value: "merge",
            label: "Merge",
            hint: "Create project files inside, potentially overwriting conflicts",
          },
          {
            value: "rename",
            label: "Choose a different name/path",
            hint: "Keep the existing directory and create a new one",
          },
          { value: "cancel", label: "Cancel", hint: "Abort the process" },
        ],
        initialValue: "rename",
      });

      if (isCancel(action)) {
        cancel(pc.red("Operation cancelled."));
        process.exit(0);
      }

      if (action === "overwrite") {
        finalPathInput = currentPathInput;
        shouldClearDirectory = true;
        break;
      }
      if (action === "merge") {
        finalPathInput = currentPathInput;
        shouldClearDirectory = false;
        log.info(
          `Proceeding into existing directory "${pc.yellow(
            currentPathInput
          )}". Files may be overwritten.`
        );
        break;
      }
      if (action === "rename") {
        log.info("Please choose a different project name or path.");
        currentPathInput = await getProjectName(undefined);
      } else if (action === "cancel") {
        cancel(pc.red("Operation cancelled."));
        process.exit(0);
      }
    }

    if (finalPathInput === ".") {
      finalResolvedPath = process.cwd();
      finalBaseName = path.basename(finalResolvedPath);
    } else {
      finalResolvedPath = path.resolve(process.cwd(), finalPathInput);
      finalBaseName = path.basename(finalResolvedPath);
    }

    if (shouldClearDirectory) {
      const s = spinner();
      s.start(`Clearing directory "${finalResolvedPath}"...`);
      try {
        await fs.emptyDir(finalResolvedPath);
        s.stop(`Directory "${finalResolvedPath}" cleared.`);
      } catch (error) {
        s.stop(pc.red(`Failed to clear directory "${finalResolvedPath}".`));
        consola.error(error);
        process.exit(1);
      }
    } else {
      await fs.ensureDir(finalResolvedPath);
    }

    const flagConfig = processAndValidateFlags(options, finalBaseName);
    const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

    if (!options.yes && Object.keys(otherFlags).length > 0) {
      log.info(pc.yellow("Using these pre-selected options:"));
      log.message(displayConfig(otherFlags));
      log.message("");
    }

    let config: ProjectConfig;
    if (options.yes) {
      config = {
        ...DEFAULT_CONFIG,
        ...flagConfig,
        projectName: finalBaseName,
        projectDir: finalResolvedPath,
        relativePath: finalPathInput,
      };

      if (config.backend === "convex") {
        config.auth = false;
        config.database = "none";
        config.orm = "none";
        config.api = "none";
        config.runtime = "none";
        config.dbSetup = "none";
        config.examples = ["todo"];
        log.info(
          "Due to '--backend convex' flag, the following options have been automatically set: auth=false, database=none, orm=none, api=none, runtime=none, dbSetup=none, examples=todo"
        );
      } else if (config.backend === "none") {
        config.auth = false;
        config.database = "none";
        config.orm = "none";
        config.api = "none";
        config.runtime = "none";
        config.dbSetup = "none";
        config.examples = [];
        log.info(
          "Due to '--backend none', the following options have been automatically set: --auth=false, --database=none, --orm=none, --api=none, --runtime=none, --db-setup=none, --examples=none"
        );
      } else if (config.database === "none") {
        config.orm = "none";
        log.info(
          "Due to '--database none', '--orm' has been automatically set to 'none'."
        );

        config.auth = false;
        log.info(
          "Due to '--database none', '--auth' has been automatically set to 'false'."
        );

        config.dbSetup = "none";
        log.info(
          "Due to '--database none', '--db-setup' has been automatically set to 'none'."
        );
      }

      log.info(
        pc.yellow("Using default/flag options (config prompts skipped):")
      );
      log.message(displayConfig(config));
      log.message("");
    } else {
      config = await gatherConfig(
        flagConfig,
        finalBaseName,
        finalResolvedPath,
        finalPathInput
      );
    }

    await createProject(config);

    log.success(
      pc.blue(
        `You can reproduce this setup with the following command:\n${generateReproducibleCommand(
          config
        )}`
      )
    );

    const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
    outro(
      pc.magenta(
        `Project created successfully in ${pc.bold(
          elapsedTimeInSeconds
        )} seconds!`
      )
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "YError") {
        cancel(pc.red(`Invalid arguments: ${error.message}`));
      } else {
        consola.error(`An unexpected error occurred: ${error.message}`);
        if (!error.message.includes("is only supported with")) {
          consola.error(error.stack);
        }
      }
      process.exit(1);
    } else {
      consola.error("An unexpected error occurred.");
      console.error(error);
      process.exit(1);
    }
  }
}

function processAndValidateFlags(
  options: YargsArgv,
  projectName?: string
): Partial<ProjectConfig> {
  const config: Partial<ProjectConfig> = {};
  const providedFlags: Set<string> = new Set(
    Object.keys(options).filter((key) => key !== "_" && key !== "$0")
  );

  if (options.api) {
    config.api = options.api as ProjectApi;
    if (options.api === "none") {
      if (
        options.examples &&
        !(options.examples.length === 1 && options.examples[0] === "none")
      ) {
        consola.fatal(
          "Cannot use '--examples' when '--api' is set to 'none'. Please remove the --examples flag or choose an API type."
        );
        process.exit(1);
      }
    }
  }

  if (options.backend) {
    config.backend = options.backend as ProjectBackend;
  }

  if (
    providedFlags.has("backend") &&
    config.backend &&
    config.backend !== "convex" &&
    config.backend !== "none"
  ) {
    if (providedFlags.has("runtime") && options.runtime === "none") {
      consola.fatal(
        `'--runtime none' is only supported with '--backend convex' or '--backend none'. Please choose 'bun', 'node', or remove the --runtime flag.`
      );
      process.exit(1);
    }
  }

  if (options.database) {
    config.database = options.database as ProjectDatabase;
  }
  if (options.orm) {
    config.orm = options.orm as ProjectOrm;
  }
  if (options.auth !== undefined) {
    config.auth = options.auth;
  }
  if (options.git !== undefined) {
    config.git = options.git;
  }
  if (options.install !== undefined) {
    config.install = options.install;
  }
  if (options.runtime) {
    config.runtime = options.runtime as ProjectRuntime;
  }
  if (options.dbSetup) {
    config.dbSetup = options.dbSetup as ProjectDBSetup;
  }
  if (options.packageManager) {
    config.packageManager = options.packageManager as ProjectPackageManager;
  }

  if (projectName) {
    config.projectName = projectName;
  } else if (options.projectDirectory) {
    config.projectName = path.basename(
      path.resolve(process.cwd(), options.projectDirectory)
    );
  }

  if (options.frontend && options.frontend.length > 0) {
    if (options.frontend.includes("none")) {
      if (options.frontend.length > 1) {
        consola.fatal(`Cannot combine 'none' with other frontend options.`);
        process.exit(1);
      }
      config.frontend = [];
    } else {
      const validOptions = options.frontend.filter(
        (f): f is ProjectFrontend => f !== "none"
      );
      const webFrontends = validOptions.filter(
        (f) =>
          f === "tanstack-router" ||
          f === "react-router" ||
          f === "tanstack-start" ||
          f === "next" ||
          f === "nuxt" ||
          f === "svelte" ||
          f === "solid"
      );
      const nativeFrontends = validOptions.filter(
        (f) => f === "native-nativewind" || f === "native-unistyles"
      );

      if (webFrontends.length > 1) {
        consola.fatal(
          "Cannot select multiple web frameworks. Choose only one of: tanstack-router, tanstack-start, react-router, next, nuxt, svelte, solid"
        );
        process.exit(1);
      }
      if (nativeFrontends.length > 1) {
        consola.fatal(
          "Cannot select multiple native frameworks. Choose only one of: native-nativewind, native-unistyles"
        );
        process.exit(1);
      }
      config.frontend = validOptions;
    }
  }
  if (options.addons && options.addons.length > 0) {
    if (options.addons.includes("none")) {
      if (options.addons.length > 1) {
        consola.fatal(`Cannot combine 'none' with other addons.`);
        process.exit(1);
      }
      config.addons = [];
    } else {
      config.addons = options.addons.filter(
        (addon): addon is ProjectAddons => addon !== "none"
      );
    }
  }
  if (options.examples && options.examples.length > 0) {
    if (options.examples.includes("none")) {
      if (options.examples.length > 1) {
        consola.fatal("Cannot combine 'none' with other examples.");
        process.exit(1);
      }
      config.examples = [];
    } else {
      config.examples = options.examples.filter(
        (ex): ex is ProjectExamples => ex !== "none"
      );
      if (options.examples.includes("none") && config.backend !== "convex") {
        config.examples = [];
      }
    }
  }

  if (config.backend === "convex") {
    const incompatibleFlags: string[] = [];

    if (providedFlags.has("auth") && options.auth === true)
      incompatibleFlags.push("--auth");
    if (providedFlags.has("database") && options.database !== "none")
      incompatibleFlags.push(`--database ${options.database}`);
    if (providedFlags.has("orm") && options.orm !== "none")
      incompatibleFlags.push(`--orm ${options.orm}`);
    if (providedFlags.has("api") && options.api !== "none")
      incompatibleFlags.push(`--api ${options.api}`);
    if (providedFlags.has("runtime") && options.runtime !== "none")
      incompatibleFlags.push(`--runtime ${options.runtime}`);
    if (providedFlags.has("dbSetup") && options.dbSetup !== "none")
      incompatibleFlags.push(`--db-setup ${options.dbSetup}`);

    if (incompatibleFlags.length > 0) {
      consola.fatal(
        `The following flags are incompatible with '--backend convex': ${incompatibleFlags.join(
          ", "
        )}. Please remove them.`
      );
      process.exit(1);
    }

    if (providedFlags.has("frontend") && options.frontend) {
      const incompatibleFrontends = options.frontend.filter(
        (f) => f === "nuxt" || f === "solid"
      );
      if (incompatibleFrontends.length > 0) {
        consola.fatal(
          `The following frontends are not compatible with '--backend convex': ${incompatibleFrontends.join(
            ", "
          )}. Please choose a different frontend or backend.`
        );
        process.exit(1);
      }
    }

    config.auth = false;
    config.database = "none";
    config.orm = "none";
    config.api = "none";
    config.runtime = "none";
    config.dbSetup = "none";
    config.examples = ["todo"];
  } else if (config.backend === "none") {
    const incompatibleFlags: string[] = [];

    if (providedFlags.has("auth") && options.auth === true)
      incompatibleFlags.push("--auth");
    if (providedFlags.has("database") && options.database !== "none")
      incompatibleFlags.push(`--database ${options.database}`);
    if (providedFlags.has("orm") && options.orm !== "none")
      incompatibleFlags.push(`--orm ${options.orm}`);
    if (providedFlags.has("api") && options.api !== "none")
      incompatibleFlags.push(`--api ${options.api}`);
    if (providedFlags.has("runtime") && options.runtime !== "none")
      incompatibleFlags.push(`--runtime ${options.runtime}`);
    if (providedFlags.has("dbSetup") && options.dbSetup !== "none")
      incompatibleFlags.push(`--db-setup ${options.dbSetup}`);

    if (incompatibleFlags.length > 0) {
      consola.fatal(
        `The following flags are incompatible with '--backend none': ${incompatibleFlags.join(
          ", "
        )}. Please remove them.`
      );
      process.exit(1);
    }

    config.auth = false;
    config.database = "none";
    config.orm = "none";
    config.api = "none";
    config.runtime = "none";
    config.dbSetup = "none";
    if (
      options.examples &&
      !options.examples.includes("none") &&
      options.examples.length > 0
    ) {
      consola.fatal(
        "Cannot select examples when backend is 'none'. Please remove the --examples flag or set --examples none."
      );
      process.exit(1);
    }
    config.examples = [];
  } else {
    const effectiveDatabase =
      config.database ?? (options.yes ? DEFAULT_CONFIG.database : undefined);
    const effectiveOrm =
      config.orm ?? (options.yes ? DEFAULT_CONFIG.orm : undefined);
    const _effectiveAuth =
      config.auth ?? (options.yes ? DEFAULT_CONFIG.auth : undefined);
    const _effectiveDbSetup =
      config.dbSetup ?? (options.yes ? DEFAULT_CONFIG.dbSetup : undefined);
    const _effectiveExamples =
      config.examples ?? (options.yes ? DEFAULT_CONFIG.examples : undefined);
    const effectiveFrontend =
      config.frontend ?? (options.yes ? DEFAULT_CONFIG.frontend : undefined);
    const effectiveApi =
      config.api ?? (options.yes ? DEFAULT_CONFIG.api : undefined);
    const effectiveBackend =
      config.backend ?? (options.yes ? DEFAULT_CONFIG.backend : undefined);

    if (effectiveDatabase === "none") {
      if (providedFlags.has("orm") && options.orm !== "none") {
        consola.fatal(
          `Cannot use ORM '--orm ${options.orm}' when database is 'none'.`
        );
        process.exit(1);
      }
      config.orm = "none";
      log.info(
        "Due to '--database none', '--orm' has been automatically set to 'none'."
      );

      if (providedFlags.has("auth") && options.auth === true) {
        consola.fatal(
          "Authentication requires a database. Cannot use --auth when database is 'none'."
        );
        process.exit(1);
      }
      config.auth = false;
      log.info(
        "Due to '--database none', '--auth' has been automatically set to 'false'."
      );

      if (providedFlags.has("dbSetup") && options.dbSetup !== "none") {
        consola.fatal(
          `Database setup '--db-setup ${options.dbSetup}' requires a database. Cannot use when database is 'none'.`
        );
        process.exit(1);
      }
      config.dbSetup = "none";
      log.info(
        "Due to '--database none', '--db-setup' has been automatically set to 'none'."
      );
    }

    if (config.orm === "mongoose" && !providedFlags.has("database")) {
      if (effectiveDatabase && effectiveDatabase !== "mongodb") {
        consola.fatal(
          `Mongoose ORM requires MongoDB. Cannot use --orm mongoose with --database ${effectiveDatabase}.`
        );
        process.exit(1);
      }
      config.database = "mongodb";
    }

    if (effectiveDatabase === "mongodb" && effectiveOrm === "drizzle") {
      consola.fatal(
        "Drizzle ORM is not compatible with MongoDB. Please use --orm prisma or --orm mongoose."
      );
      process.exit(1);
    }

    if (
      effectiveOrm === "mongoose" &&
      effectiveDatabase &&
      effectiveDatabase !== "mongodb"
    ) {
      consola.fatal(
        `Mongoose ORM requires MongoDB. Cannot use --orm mongoose with --database ${effectiveDatabase}.`
      );
      process.exit(1);
    }

    if (config.dbSetup && config.dbSetup !== "none") {
      const dbSetup = config.dbSetup;

      if (!effectiveDatabase || effectiveDatabase === "none") {
        consola.fatal(
          `Database setup '--db-setup ${dbSetup}' requires a database. Cannot use when database is 'none'.`
        );
        process.exit(1);
      }

      if (dbSetup === "turso") {
        if (effectiveDatabase && effectiveDatabase !== "sqlite") {
          consola.fatal(
            `Turso setup requires SQLite. Cannot use --db-setup turso with --database ${effectiveDatabase}`
          );
          process.exit(1);
        }
        if (effectiveOrm !== "drizzle") {
          consola.fatal(
            `Turso setup requires Drizzle ORM. Cannot use --db-setup turso with --orm ${
              effectiveOrm ?? "none"
            }.`
          );
          process.exit(1);
        }
      } else if (dbSetup === "supabase") {
        if (effectiveDatabase !== "postgres") {
          consola.fatal(
            `Supabase setup requires PostgreSQL. Cannot use --db-setup supabase with --database ${effectiveDatabase}.`
          );
          process.exit(1);
        }
      } else if (dbSetup === "prisma-postgres") {
        if (effectiveDatabase !== "postgres") {
          consola.fatal(
            `Prisma PostgreSQL setup requires PostgreSQL. Cannot use --db-setup prisma-postgres with --database ${effectiveDatabase}.`
          );
          process.exit(1);
        }
        if (effectiveOrm !== "prisma") {
          consola.fatal(
            `Prisma PostgreSQL setup requires Prisma ORM. Cannot use --db-setup prisma-postgres with --orm ${effectiveOrm}.`
          );
          process.exit(1);
        }
      } else if (dbSetup === "mongodb-atlas") {
        if (effectiveDatabase !== "mongodb") {
          consola.fatal(
            `MongoDB Atlas setup requires MongoDB. Cannot use --db-setup mongodb-atlas with --database ${effectiveDatabase}.`
          );
          process.exit(1);
        }
        if (effectiveOrm !== "prisma" && effectiveOrm !== "mongoose") {
          consola.fatal(
            `MongoDB Atlas setup requires Prisma or Mongoose ORM. Cannot use --db-setup mongodb-atlas with --orm ${effectiveOrm}.`
          );
          process.exit(1);
        }
      } else if (dbSetup === "neon") {
        if (effectiveDatabase !== "postgres") {
          consola.fatal(
            `Neon PostgreSQL setup requires PostgreSQL. Cannot use --db-setup neon with --database ${effectiveDatabase}.`
          );
          process.exit(1);
        }
      }
    }

    const includesNuxt = effectiveFrontend?.includes("nuxt");
    const includesSvelte = effectiveFrontend?.includes("svelte");
    const includesSolid = effectiveFrontend?.includes("solid");

    if (
      (includesNuxt || includesSvelte || includesSolid) &&
      effectiveApi === "trpc"
    ) {
      consola.fatal(
        `tRPC API is not supported with '${
          includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid"
        }' frontend. Please use --api orpc or --api none or remove '${
          includesNuxt ? "nuxt" : includesSvelte ? "svelte" : "solid"
        }' from --frontend.`
      );
      process.exit(1);
    }

    if (config.addons && config.addons.length > 0) {
      const webSpecificAddons = ["pwa", "tauri"];
      const hasWebSpecificAddons = config.addons.some((addon) =>
        webSpecificAddons.includes(addon)
      );
      const hasCompatibleWebFrontend = effectiveFrontend?.some((f) => {
        const isPwaCompatible =
          f === "tanstack-router" ||
          f === "react-router" ||
          f === "solid" ||
          f === "next";
        const isTauriCompatible =
          f === "tanstack-router" ||
          f === "react-router" ||
          f === "nuxt" ||
          f === "svelte" ||
          f === "solid" ||
          f === "next";

        if (
          config.addons?.includes("pwa") &&
          config.addons?.includes("tauri")
        ) {
          return isPwaCompatible && isTauriCompatible;
        }
        if (config.addons?.includes("pwa")) {
          return isPwaCompatible;
        }
        if (config.addons?.includes("tauri")) {
          return isTauriCompatible;
        }
        return true;
      });

      if (hasWebSpecificAddons && !hasCompatibleWebFrontend) {
        let incompatibleReason = "Selected frontend is not compatible.";
        if (config.addons.includes("pwa")) {
          incompatibleReason =
            "PWA requires tanstack-router, react-router, next, or solid.";
        }
        if (config.addons.includes("tauri")) {
          incompatibleReason =
            "Tauri requires tanstack-router, react-router, nuxt, svelte, solid, or next.";
        }
        consola.fatal(
          `Incompatible addon/frontend combination: ${incompatibleReason}`
        );
        process.exit(1);
      }

      if (config.addons.includes("husky") && !config.addons.includes("biome")) {
        consola.warn(
          "Husky addon is recommended to be used with Biome for lint-staged configuration."
        );
      }
      config.addons = [...new Set(config.addons)];
    }

    const onlyNativeFrontend =
      effectiveFrontend &&
      effectiveFrontend.length === 1 &&
      (effectiveFrontend[0] === "native-nativewind" ||
        effectiveFrontend[0] === "native-unistyles");

    if (
      onlyNativeFrontend &&
      config.examples &&
      config.examples.length > 0 &&
      !config.examples.includes("none")
    ) {
      consola.fatal(
        "Examples are not supported when only a native frontend (NativeWind or Unistyles) is selected."
      );
      process.exit(1);
    }

    if (
      config.examples &&
      config.examples.length > 0 &&
      !config.examples.includes("none")
    ) {
      if (
        config.examples.includes("todo") &&
        effectiveBackend !== "convex" &&
        effectiveBackend !== "none" &&
        effectiveDatabase === "none"
      ) {
        consola.fatal(
          "The 'todo' example requires a database if a backend (other than Convex) is present. Cannot use --examples todo when database is 'none' and a backend is selected."
        );
        process.exit(1);
      }

      if (config.examples.includes("ai") && effectiveBackend === "elysia") {
        consola.fatal(
          "The 'ai' example is not compatible with the Elysia backend."
        );
        process.exit(1);
      }

      if (config.examples.includes("ai") && includesSolid) {
        consola.fatal(
          "The 'ai' example is not compatible with the Solid frontend."
        );
        process.exit(1);
      }
    }
  }

  return config;
}

main().catch((err) => {
  consola.error("Aborting installation due to unexpected error...");
  if (err instanceof Error) {
    if (
      !err.message.includes("is only supported with") &&
      !err.message.includes("incompatible with") &&
      !err.message.includes("requires") &&
      !err.message.includes("Cannot use") &&
      !err.message.includes("Cannot select multiple") &&
      !err.message.includes("Cannot combine") &&
      !err.message.includes("not supported")
    ) {
      consola.error(err.message);
      consola.error(err.stack);
    }
  } else {
    console.error(err);
  }
  process.exit(1);
});
