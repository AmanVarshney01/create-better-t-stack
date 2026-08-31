import type { AlchemyDeploymentPlan } from "./plan";
import { writeObject, type AlchemyWriter } from "./writer";

export function writeObservabilityResources(
  writer: AlchemyWriter,
  plan: AlchemyDeploymentPlan,
): void {
  if (!plan.hasAxiom) return;

  writer.writeLine("export const observability = Effect.gen(function* () {");
  writer.indent(() => {
    writer.writeLine("const { stage } = yield* Alchemy.Stack;");
    writer.writeLine(`const datasetName = \`${plan.config.projectName}-\${stage}-logs\`;`);
    writer.blankLine();
    writeObject(
      writer,
      'const dataset = yield* Axiom.Dataset("logs", {',
      () => {
        writer.writeLine("name: datasetName,");
        writer.writeLine('kind: "axiom:events:v1",');
        writer.writeLine(`description: "${plan.config.projectName} application logs",`);
      },
      "});",
    );
    writeObject(
      writer,
      'const ingest = yield* Axiom.ApiToken("logs-ingest", {',
      () => {
        writer.writeLine(`name: \`${plan.config.projectName}-\${stage}-logs-ingest\`,`);
        writeObject(
          writer,
          "datasetCapabilities: {",
          () => {
            writeObject(
              writer,
              "[datasetName]: {",
              () => writer.writeLine('ingest: ["create"],'),
              "},",
            );
          },
          "},",
        );
      },
      "});",
    );
    writer.blankLine();
    writeObject(
      writer,
      "return {",
      () => {
        writer.writeLine("dataset,");
        writeObject(
          writer,
          "runtimeEnv: {",
          () => {
            writer.writeLine("AXIOM_API_KEY: ingest.token,");
            writer.writeLine("AXIOM_DATASET: dataset.name,");
            writer.writeLine("AXIOM_EDGE_URL: dataset.edgeDeploymentUrl,");
          },
          "},",
        );
      },
      "};",
    );
  });
  writer.writeLine("});");

  const hasPrismaRuntime =
    (plan.server.target === "prisma" && plan.hasAxiomServerRuntime) ||
    (plan.web.target === "prisma" && plan.hasAxiomWebRuntime);
  const hasCloudflareRuntime =
    (plan.server.target === "cloudflare" && plan.hasAxiomServerRuntime) ||
    (plan.web.target === "cloudflare" && plan.hasAxiomWebRuntime);

  if (hasPrismaRuntime || hasCloudflareRuntime) {
    writer.blankLine();
    writer.writeLine(
      "export const observabilityEnv = observability.pipe(Effect.map(({ runtimeEnv }) => runtimeEnv));",
    );
  }

  if (hasCloudflareRuntime) {
    writer.blankLine();
    writeObject(
      writer,
      "export const observabilityBindings = {",
      () => {
        for (const key of ["AXIOM_API_KEY", "AXIOM_DATASET", "AXIOM_EDGE_URL"]) {
          writer.writeLine(`${key}: observabilityEnv.pipe(Effect.map(({ ${key} }) => ${key})),`);
        }
      },
      "};",
    );
  }
}
