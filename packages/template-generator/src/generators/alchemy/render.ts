import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../../core/virtual-fs";
import { writeDatabaseResources } from "./database";
import { createAlchemyDeploymentPlan, type AlchemyDeploymentPlan } from "./plan";
import { writeServerResource } from "./server";
import { writeExportedWebResource, writeStackWebResource } from "./web";
import { createAlchemyWriter, writeObject, type AlchemyWriter } from "./writer";

function usesCommand(plan: AlchemyDeploymentPlan): boolean {
  return (
    plan.managedDatabase.kind === "prisma-postgres" ||
    (plan.managedDatabase.kind !== "none" && plan.managedDatabase.orm === "prisma")
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

function usesLayer(plan: AlchemyDeploymentPlan): boolean {
  return plan.hasAlchemyManagedDatabase || (plan.hasCloudflare && plan.hasPrismaDeploy);
}

function writeImports(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine('import * as Alchemy from "alchemy";');
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
  writer.writeLine('import * as Config from "effect/Config";');
  writer.writeLine('import * as Effect from "effect/Effect";');
  if (usesLayer(plan)) writer.writeLine('import * as Layer from "effect/Layer";');
  if (usesRedacted(plan)) writer.writeLine('import * as Redacted from "effect/Redacted";');
  writer.writeLine('import { config } from "dotenv";');
}

function writeDotenv(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine('config({ path: "./.env" });');
  if (plan.web.target !== "none") writer.writeLine('config({ path: "../../apps/web/.env" });');
  if (plan.server.target !== "none") {
    writer.writeLine('config({ path: "../../apps/server/.env" });');
  }
}

function writeStackOptions(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writeObject(
    writer,
    "{",
    () => {
      if (plan.hasCloudflare && (plan.hasPrismaDeploy || plan.hasAlchemyManagedDatabase)) {
        writer.writeLine("providers: Layer.mergeAll(Cloudflare.providers(), databaseProviders),");
      } else if (plan.hasCloudflare) {
        writer.writeLine("providers: Cloudflare.providers(),");
      } else {
        writer.writeLine("providers: databaseProviders,");
      }
      writer.writeLine(
        plan.hasCloudflare ? "state: Cloudflare.state()," : "state: Alchemy.localState(),",
      );
    },
    "},",
  );
}

function writeStack(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine("export default Alchemy.Stack(");
  writer.indent(() => {
    writer.writeLine(`${JSON.stringify(plan.config.projectName)},`);
    writeStackOptions(writer, plan);
    writer.writeLine("Effect.gen(function* () {");
    writer.indent(() => {
      if (plan.server.target !== "none") {
        writer.writeLine("const serverWorker = yield* server;");
      }
      writeStackWebResource(writer, plan);
      writer.blankLine();
      writeObject(
        writer,
        "return {",
        () => {
          if (plan.web.target !== "none") writer.writeLine("web: webWorker.url,");
          if (plan.server.target !== "none") writer.writeLine("server: serverWorker.url,");
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
