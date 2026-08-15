import { cloudflareServerEnvEntries, prismaServerEnvEntries } from "./env";
import type { AlchemyDeploymentPlan } from "./plan";
import { writeLines, writeObject, type AlchemyWriter } from "./writer";

function writeCloudflareServer(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writeObject(
    writer,
    'export const server = Cloudflare.Worker("server", {',
    () => {
      writer.writeLine('main: "../../apps/server/src/index.ts",');
      writeObject(
        writer,
        "compatibility: {",
        () => {
          writer.writeLine('flags: ["nodejs_compat"],');
        },
        "},",
      );
      writeObject(
        writer,
        "env: {",
        () => {
          writeLines(writer, cloudflareServerEnvEntries(plan));
        },
        "},",
      );
      writeObject(
        writer,
        "dev: {",
        () => {
          writer.writeLine("port: 3000,");
        },
        "},",
      );
    },
    "});",
  );
  writer.blankLine();
  writer.writeLine("export type ServerEnv = Cloudflare.InferEnv<typeof server>;");
}

function writePrismaServer(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  writer.writeLine('export const server = Prisma.Compute("server", Effect.gen(function* () {');
  writer.indent(() => {
    writer.writeLine("const project = yield* prismaProject;");
    writer.writeLine("const resolvedDatabaseEnv = yield* databaseEnv;");
    writer.blankLine();
    writer.writeLine("return {");
    writer.indent(() => {
      writer.writeLine("project,");
      writer.writeLine('path: "../../apps/server",');
      writeObject(
        writer,
        "build: {",
        () => {
          writer.writeLine('type: "auto" as const,');
          writer.writeLine('framework: "bun" as const,');
        },
        "},",
      );
      writer.writeLine('entrypoint: "src/index.ts",');
      writer.writeLine("port: 3000,");
      writeObject(
        writer,
        "env: {",
        () => {
          writeLines(writer, prismaServerEnvEntries(plan));
        },
        "},",
      );
      writer.writeLine('healthCheck: { path: "/" },');
      writer.writeLine("destroyOldDeployment: true,");
      writeObject(
        writer,
        "dev: {",
        () => {
          writer.writeLine(`command: "${plan.config.packageManager} run dev:bare",`);
          writer.writeLine("port: 3000,");
        },
        "},",
      );
    });
    writer.writeLine("};");
  });
  writer.writeLine("}));");
}

export function writeServerResource(writer: AlchemyWriter, plan: AlchemyDeploymentPlan): void {
  if (plan.server.target === "none") return;
  if (plan.server.target === "cloudflare") writeCloudflareServer(writer, plan);
  else writePrismaServer(writer, plan);
}
