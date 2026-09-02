import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../../core/virtual-fs";
import { writeDatabaseResources } from "./database";
import {
  cloudflareServerEnvEntries,
  prismaServerEnvEntries,
  prismaWebEnvEntries,
  selfCloudflareWebEnvEntries,
  splitCloudflareWebEnvEntries,
} from "./env";
import { writeObservabilityResources } from "./observability";
import { createAlchemyDeploymentPlan, type AlchemyDeploymentPlan } from "./plan";
import { writeServerResource } from "./server";
import { writeExportedWebResource, writeStackWebResource } from "./web";
import { createAlchemyWriter, writeObject, type AlchemyWriter } from "./writer";

function databaseProvidersUseCommand(plan: AlchemyDeploymentPlan): boolean {
  return (
    plan.managedDatabase.kind === "prisma-postgres" ||
    (plan.managedDatabase.kind !== "none" && plan.managedDatabase.orm === "prisma")
  );
}

function usesCommand(plan: AlchemyDeploymentPlan): boolean {
  return (
    databaseProvidersUseCommand(plan) ||
    plan.needsStandaloneServerDev ||
    plan.needsStandaloneWebDev ||
    plan.hasAxiomVercelRuntime
  );
}

function usesOutput(plan: AlchemyDeploymentPlan): boolean {
  const database = plan.managedDatabase;
  return (
    database.kind === "neon" ||
    database.kind === "prisma-postgres" ||
    (database.kind === "planetscale-mysql" && database.orm === "prisma")
  );
}

function usesRedacted(plan: AlchemyDeploymentPlan): boolean {
  const database = plan.managedDatabase;
  return (
    database.kind === "neon" || (database.kind === "planetscale-mysql" && database.orm === "prisma")
  );
}

function providerLayers(plan: AlchemyDeploymentPlan): string[] {
  const layers: string[] = [];
  if (plan.hasCloudflare) layers.push("Cloudflare.providers()");
  if (plan.hasAlchemyManagedDatabase || plan.hasPrismaDeploy) layers.push("databaseProviders");
  if (plan.hasAxiom) layers.push("Axiom.providers()");
  if (
    (plan.needsStandaloneServerDev || plan.needsStandaloneWebDev || plan.hasAxiomVercelRuntime) &&
    !databaseProvidersUseCommand(plan)
  ) {
    layers.push("Command.providers()");
  }
  return layers;
}

function usesLayer(plan: AlchemyDeploymentPlan): boolean {
  return providerLayers(plan).length > 1;
}

function usesConfig(plan: AlchemyDeploymentPlan): boolean {
  if (
    plan.hasPrismaDeploy &&
    !plan.hasAlchemyManagedDatabase &&
    plan.config.dbSetup !== "d1" &&
    plan.config.database !== "none"
  ) {
    return true;
  }

  const entries: string[] = [];

  if (plan.server.target === "cloudflare") entries.push(...cloudflareServerEnvEntries(plan));
  if (plan.server.target === "prisma") entries.push(...prismaServerEnvEntries(plan));
  if (plan.web.target === "cloudflare") {
    entries.push(
      ...(plan.web.topology === "self"
        ? selfCloudflareWebEnvEntries(plan, plan.web.framework)
        : splitCloudflareWebEnvEntries(plan, plan.web.framework)),
    );
  }
  if (plan.web.target === "prisma") {
    entries.push(...prismaWebEnvEntries(plan, plan.web.framework));
  }

  return entries.some((entry) => entry.includes("Config."));
}

function writeImports(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine('import * as Alchemy from "alchemy";');
  if (plan.hasAxiom) writer.writeLine('import * as Axiom from "alchemy/Axiom";');
  if (usesCommand(plan)) writer.writeLine('import * as Command from "alchemy/Command";');
  if (plan.managedDatabase.kind === "neon") {
    writer.writeLine('import * as Neon from "alchemy/Neon";');
  }
  if (
    plan.managedDatabase.kind === "planetscale-postgres" ||
    plan.managedDatabase.kind === "planetscale-mysql"
  ) {
    writer.writeLine('import * as Planetscale from "alchemy/Planetscale";');
  }
  if (plan.hasPrismaDeploy || plan.managedDatabase.kind === "prisma-postgres") {
    writer.writeLine('import * as Prisma from "alchemy/Prisma";');
  }
  if (usesOutput(plan)) writer.writeLine('import * as Output from "alchemy/Output";');
  if (plan.hasCloudflare) writer.writeLine('import * as Cloudflare from "alchemy/Cloudflare";');
  if (usesConfig(plan)) writer.writeLine('import * as Config from "effect/Config";');
  writer.writeLine('import * as Effect from "effect/Effect";');
  if (usesLayer(plan)) writer.writeLine('import * as Layer from "effect/Layer";');
  if (usesRedacted(plan)) writer.writeLine('import * as Redacted from "effect/Redacted";');
  writer.writeLine('import { config } from "dotenv";');
}

function writeDotenv(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine('config({ path: "./.env" });');
  if (plan.web.target !== "none" || plan.hasAxiomWebRuntime) {
    writer.writeLine('config({ path: "../../apps/web/.env" });');
  }
  if (plan.server.target !== "none" || plan.hasAxiomServerRuntime) {
    writer.writeLine('config({ path: "../../apps/server/.env" });');
  }
}

function writeStackOptions(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  const layers = providerLayers(plan);
  writeObject(
    writer,
    "{",
    () => {
      if (layers.length === 1) {
        writer.writeLine(`providers: ${layers[0]},`);
      } else {
        writer.writeLine(`providers: Layer.mergeAll(${layers.join(", ")}),`);
      }
      writer.writeLine(
        plan.hasCloudflare ? "state: Cloudflare.state()," : "state: Alchemy.localState(),",
      );
    },
    "},",
  );
}

function writeStandaloneDevResources(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (!plan.needsStandaloneServerDev && !plan.needsStandaloneWebDev) return;

  if (plan.needsStandaloneServerDev) {
    writeObject(
      writer,
      'const serverDev = yield* Command.Dev("server-dev", {',
      () => {
        writer.writeLine(`command: "${plan.config.packageManager} run dev:bare",`);
        writer.writeLine('cwd: "../../apps/server",');
        writer.writeLine("env: observabilityResources.runtimeEnv,");
      },
      "});",
    );
  }
  if (plan.needsStandaloneWebDev) {
    writeObject(
      writer,
      'const webDev = yield* Command.Dev("web-dev", {',
      () => {
        writer.writeLine(`command: "${plan.config.packageManager} run dev:bare",`);
        writer.writeLine('cwd: "../../apps/web",');
        writer.writeLine("env: observabilityResources.runtimeEnv,");
      },
      "});",
    );
  }
}

function writeVercelEnvSync(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (!plan.hasAxiomVercelRuntime) return;

  writer.writeLine("const isDev = yield* Alchemy.ALCHEMY_DEV;");
  writer.writeLine("if (!isDev) {");
  writer.indent(() => {
    writer.writeLine("const { stage } = yield* Alchemy.Stack;");
    writer.writeLine(
      'const vercelEnvironment = stage === "production" ? "production" : "preview";',
    );
    writeObject(
      writer,
      'yield* Command.Exec("axiom-vercel-env", {',
      () => {
        writer.writeLine(
          `command: \`${plan.config.packageManager} run env:\${vercelEnvironment}\`,`,
        );
        writer.writeLine('cwd: "../..",');
        writer.writeLine("env: observabilityResources.runtimeEnv,");
        writer.writeLine('memo: { include: ["scripts/sync-vercel-env.ts", "vercel.json"] },');
      },
      "});",
    );
  });
  writer.writeLine("}");
}

function writeStack(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine("export default Alchemy.Stack(");
  writer.indent(() => {
    writer.writeLine(`${JSON.stringify(plan.config.projectName)},`);
    writeStackOptions(writer, plan);
    writer.writeLine("Effect.gen(function* () {");
    writer.indent(() => {
      if (plan.hasAxiom) {
        writer.writeLine("const observabilityResources = yield* observability;");
      }
      if (plan.server.target !== "none") {
        writer.writeLine("const serverWorker = yield* server;");
      }
      writeStackWebResource(writer, plan);
      writeStandaloneDevResources(writer, plan);
      writeVercelEnvSync(writer, plan);
      writer.blankLine();
      writeObject(
        writer,
        "return {",
        () => {
          if (plan.web.target !== "none") writer.writeLine("web: webWorker.url,");
          else if (plan.needsStandaloneWebDev) writer.writeLine("web: webDev.url,");
          if (plan.server.target !== "none") writer.writeLine("server: serverWorker.url,");
          else if (plan.needsStandaloneServerDev) writer.writeLine("server: serverDev.url,");
          if (plan.hasAxiom) writer.writeLine("axiomDataset: observabilityResources.dataset.name,");
        },
        "};",
      );
    });
    writer.writeLine("}),");
  });
  writer.writeLine(");");
}

export function generateAlchemyRun(config: ProjectConfig): string {
  const plan = createAlchemyDeploymentPlan(config);
  const writer = createAlchemyWriter();

  writeImports(writer, plan);
  writer.blankLine();
  writeDotenv(writer, plan);
  writer.blankLine();
  writeDatabaseResources(writer, plan);
  if (plan.hasAlchemyManagedDatabase || plan.hasPrismaDeploy || plan.hasD1Resource) {
    writer.blankLine();
  }
  writeObservabilityResources(writer, plan);
  if (plan.hasAxiom) writer.blankLine();
  writeServerResource(writer, plan);
  if (plan.server.target !== "none") writer.blankLine();
  writeExportedWebResource(writer, plan);
  if (plan.web.target !== "none") writer.blankLine();
  writeStack(writer, plan);

  return writer.toString();
}

export function processAlchemyRun(vfs: VirtualFileSystem, config: ProjectConfig): void {
  vfs.writeFile("packages/infra/alchemy.run.ts", generateAlchemyRun(config));
}
