import {
  prismaWebEnvEntries,
  selfCloudflareWebEnvEntries,
  splitCloudflareWebEnvEntries,
} from "./env";
import { assertNever, type AlchemyDeploymentPlan, type DeployedWebFramework } from "./plan";
import { writeLines, writeObject, type AlchemyWriter } from "./writer";

function writeEnv(writer: AlchemyWriter, entries: readonly string[]): void {
  writeObject(writer, "env: {", () => writeLines(writer, entries), "},");
}

function writeStaticSite(
  writer: AlchemyWriter,
  plan: AlchemyDeploymentPlan,
  framework: "next" | "svelte",
  declaration: string,
  entries: readonly string[],
): void {
  if (framework === "svelte") {
    writer.writeLine(
      "// _worker.js is a shim importing outside its directory, so it must be bundled",
    );
  }
  writeObject(
    writer,
    `${declaration} Cloudflare.Website.StaticSite("web", {`,
    () => {
      writer.writeLine('cwd: "../../apps/web",');
      writer.writeLine(
        `command: "${plan.config.packageManager} run ${framework === "next" ? "build:cloudflare" : "build"}",`,
      );
      writer.writeLine(
        "// Rebuild shared workspace dependencies until Alchemy has a workspace-aware default memo.",
      );
      writer.writeLine("memo: false,");
      if (framework === "next") {
        writer.writeLine('outdir: ".open-next/assets",');
        writer.writeLine('main: "../../apps/web/.open-next/worker.js",');
        writer.writeLine("bundle: false,");
        writeObject(
          writer,
          "compatibility: {",
          () => {
            writer.writeLine('flags: ["nodejs_compat", "global_fetch_strictly_public"],');
          },
          "},",
        );
      } else {
        writer.writeLine('outdir: ".svelte-kit/cloudflare",');
        writer.writeLine('main: "../../apps/web/.svelte-kit/cloudflare/_worker.js",');
        writeObject(
          writer,
          "compatibility: {",
          () => {
            writer.writeLine('flags: ["nodejs_compat"],');
          },
          "},",
        );
      }
      writeEnv(writer, entries);
      writeObject(
        writer,
        "dev: {",
        () => {
          writer.writeLine(`command: "${plan.config.packageManager} run dev:bare",`);
          writer.writeLine(`url: "http://localhost:${framework === "svelte" ? "5173" : "3001"}",`);
        },
        "},",
      );
    },
    "});",
  );
}

function writeNuxt(writer: AlchemyWriter, declaration: string, entries: readonly string[]): void {
  writeObject(
    writer,
    `${declaration} Cloudflare.Website.Nuxt("web", {`,
    () => {
      writer.writeLine('rootDir: "../../apps/web",');
      writeEnv(writer, entries);
    },
    "});",
  );
}

function writeAstro(writer: AlchemyWriter, declaration: string, entries: readonly string[]): void {
  writeObject(
    writer,
    `${declaration} Cloudflare.Website.Astro("web", {`,
    () => {
      writer.writeLine('rootDir: "../../apps/web",');
      writeEnv(writer, entries);
    },
    "});",
  );
}

function writeVite(
  writer: AlchemyWriter,
  declaration: string,
  framework: "tanstack-router" | "react-router" | "tanstack-start" | "solid",
  entries: readonly string[],
): void {
  writeObject(
    writer,
    `${declaration} Cloudflare.Website.Vite("web", {`,
    () => {
      writer.writeLine('rootDir: "../../apps/web",');
      if (framework !== "tanstack-router") {
        writeObject(
          writer,
          "compatibility: {",
          () => {
            writer.writeLine('flags: ["nodejs_compat"],');
          },
          "},",
        );
      }
      if (framework === "solid") {
        writeObject(
          writer,
          "assets: {",
          () => {
            writer.writeLine("runWorkerFirst: true,");
          },
          "},",
        );
      } else if (framework === "tanstack-router") {
        writeObject(
          writer,
          "assets: {",
          () => {
            writer.writeLine('htmlHandling: "auto-trailing-slash",');
            writer.writeLine('notFoundHandling: "single-page-application",');
          },
          "},",
        );
      }
      writeEnv(writer, entries);
    },
    "});",
  );
}

function writeCloudflareWeb(
  writer: AlchemyWriter,
  plan: AlchemyDeploymentPlan,
  framework: DeployedWebFramework,
  topology: "self" | "split",
): void {
  const declaration = topology === "self" ? "export const web =" : "const webWorker = yield*";
  const entries =
    topology === "self"
      ? selfCloudflareWebEnvEntries(plan, framework)
      : splitCloudflareWebEnvEntries(plan, framework);

  switch (framework) {
    case "next":
    case "svelte":
      writeStaticSite(writer, plan, framework, declaration, entries);
      break;
    case "nuxt":
      writeNuxt(writer, declaration, entries);
      break;
    case "astro":
      writeAstro(writer, declaration, entries);
      break;
    case "tanstack-router":
    case "react-router":
    case "tanstack-start":
    case "solid":
      writeVite(writer, declaration, framework, entries);
      break;
    default:
      assertNever(framework);
  }
}

function prismaFramework(framework: DeployedWebFramework): string | undefined {
  switch (framework) {
    case "next":
      return "nextjs";
    case "nuxt":
      return "nuxt";
    case "astro":
      return "astro";
    case "tanstack-start":
      return "tanstack-start";
    case "tanstack-router":
    case "react-router":
    case "svelte":
    case "solid":
      return undefined;
    default:
      return assertNever(framework);
  }
}

function writePrismaWeb(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (plan.web.target !== "prisma") return;
  const { framework, topology } = plan.web;

  writer.writeLine('export const web = Prisma.Compute("web", Effect.gen(function* () {');
  writer.indent(() => {
    writer.writeLine("const project = yield* prismaProject;");
    if (topology === "self") {
      writer.writeLine("const resolvedDatabaseEnv = yield* databaseEnv;");
    } else if (plan.server.target !== "none") {
      writer.writeLine("const deployedServer = yield* server;");
    }
    writer.blankLine();
    writeObject(
      writer,
      "const webEnv = {",
      () => {
        writeLines(writer, prismaWebEnvEntries(plan, framework));
      },
      "};",
    );

    writer.blankLine();
    writer.writeLine("return {");
    writer.indent(() => {
      writer.writeLine("project,");
      writer.writeLine('path: "../../apps/web",');
      const frameworkName = prismaFramework(framework);
      if (frameworkName) {
        writer.writeLine(
          `build: { type: "auto" as const, framework: "${frameworkName}" as const, env: webEnv },`,
        );
      } else {
        writeObject(
          writer,
          "build: {",
          () => {
            writer.writeLine(`command: "${plan.config.packageManager} run build",`);
            writer.writeLine('outdir: ".output",');
            writer.writeLine('entrypoint: "server/index.mjs",');
            writer.writeLine("env: webEnv,");
          },
          "},",
        );
        writer.writeLine("port: 3000,");
      }
      writer.writeLine("env: webEnv,");
      writer.writeLine('healthCheck: { path: "/" },');
      writer.writeLine("destroyOldDeployment: true,");
      writeObject(
        writer,
        "dev: {",
        () => {
          writer.writeLine(`command: "${plan.config.packageManager} run dev:bare",`);
          writer.writeLine(`port: ${framework === "astro" ? "4321" : "3001"},`);
          writer.writeLine("env: webEnv,");
        },
        "},",
      );
    });
    writer.writeLine("};");
  });
  writer.writeLine("}));");
}

export function writeExportedWebResource(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (plan.web.target === "prisma") {
    writePrismaWeb(writer, plan);
    return;
  }
  if (plan.web.target === "cloudflare" && plan.web.topology === "self") {
    writeCloudflareWeb(writer, plan, plan.web.framework, "self");
    writer.blankLine();
    writer.writeLine("export type WebEnv = Cloudflare.InferEnv<typeof web>;");
  }
}

export function writeStackWebResource(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (plan.web.target === "none") return;
  if (plan.web.target === "cloudflare" && plan.web.topology === "split") {
    writeCloudflareWeb(writer, plan, plan.web.framework, "split");
  } else {
    writer.writeLine("const webWorker = yield* web;");
  }
}
