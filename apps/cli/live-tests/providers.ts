import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parseEnv } from "node:util";

import { usesAlchemyManagedDatabase, type ProjectConfig } from "@better-t-stack/types";
import { z } from "zod";

import { Blocked, Commands } from "./command";
import { RunState, type Resource } from "./state";

const projectResponse = z.object({
  project: z.object({ id: z.string() }),
  connection_uris: z.array(z.object({ connection_uri: z.string() })).min(1),
});
const deploymentOutput = z.object({
  web: z.string().url().optional(),
  server: z.string().url().optional(),
  protectionBypass: z.string().optional(),
  deploymentUrl: z.string().url().optional(),
});
export type Deployment = z.infer<typeof deploymentOutput>;

export function assertPreviewProtected(response: Response) {
  const location = response.headers.get("location");
  const vercelLogin =
    [302, 303, 307, 308].includes(response.status) &&
    location &&
    URL.canParse(location) &&
    ["vercel.com", "www.vercel.com"].includes(new URL(location).hostname);
  if (![401, 403].includes(response.status) && !vercelLogin)
    throw new Error(`Preview must require Deployment Protection; received HTTP ${response.status}`);
}

function vercelArgs(args: string[]) {
  const scope = process.env.BTS_LIVE_VERCEL_SCOPE;
  if (!scope) throw new Blocked("Set BTS_LIVE_VERCEL_SCOPE to the dedicated test team/account.");
  return ["vercel", ...args, "--scope", scope, "--non-interactive"];
}

async function neonRequest(method: string, endpoint: string, body?: string) {
  const key = process.env.NEON_API_KEY;
  if (!key) throw new Blocked("NEON_API_KEY is required for a real Neon database.");
  const response = await fetch(`https://console.neon.tech/api/v2/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body,
    signal: AbortSignal.timeout(60_000),
  });
  if (method === "DELETE" && response.status === 404) return null;
  if (!response.ok) throw new Error(`Neon ${method} ${endpoint}: HTTP ${response.status}`);
  return response.json();
}

// Account-free databases: Neon claimable projects are deleted during cleanup, and
// Prisma Postgres databases expire on their own through create-db's TTL
async function provisionClaimableNeon(state: RunState, id: string, commands: Commands) {
  const envFile = path.join(commands.directory, "neon-claim.env");
  await writeFile(envFile, "", { mode: 0o600 });
  const stdout = await commands.run("neon-claim-create", commands.directory, "npx", [
    "--yes",
    "neon@latest",
    "claim",
    "create",
    "--output",
    "json",
    "--file",
    envFile,
    "--context-file",
    path.join(commands.directory, "neon-context.json"),
    "--no-analytics",
  ]);
  const { project_id } = z.object({ project_id: z.string() }).parse(JSON.parse(stdout));
  state.resource(id, "neon-claim", project_id, commands.directory);
  const url = parseEnv(await readFile(envFile, "utf8")).DATABASE_URL;
  if (!url) throw new Error("neon claim create did not write DATABASE_URL");
  return commands.secret(url);
}

async function provisionPrismaPostgres(commands: Commands) {
  const stdout = await commands.run("create-db", commands.directory, "npx", [
    "--yes",
    "create-db@latest",
    "create",
    "--json",
    "--region",
    process.env.BTS_LIVE_PRISMA_POSTGRES_REGION ?? "us-east-1",
    "--ttl",
    "2h",
  ]);
  const { connectionString } = z.object({ connectionString: z.string() }).parse(JSON.parse(stdout));
  return commands.secret(connectionString);
}

async function findNeonProjects(name: string) {
  const result = z
    .object({ projects: z.array(z.object({ id: z.string(), name: z.string() })) })
    .parse(await neonRequest("GET", `projects?search=${encodeURIComponent(name)}&limit=400`));
  return result.projects.filter((project) => project.name === name);
}

export async function provisionDatabase(
  config: ProjectConfig,
  state: RunState,
  id: string,
  commands: Commands,
) {
  if (usesAlchemyManagedDatabase(config) || config.dbSetup === "d1" || config.database === "none")
    return undefined;
  if (
    config.database === "sqlite" &&
    config.dbSetup === "none" &&
    config.webDeploy === "none" &&
    config.serverDeploy === "none"
  )
    return `file:${path.join(config.projectDir, "live-test.db")}`;
  if (config.dbSetup === "prisma-postgres") return provisionPrismaPostgres(commands);
  if (config.dbSetup !== "neon")
    throw new Blocked(
      `Database provisioner not yet available: ${config.dbSetup}/${config.database}`,
    );
  if (!process.env.NEON_API_KEY) return provisionClaimableNeon(state, id, commands);
  const project = {
    name: config.projectName,
    region_id: process.env.BTS_LIVE_NEON_REGION ?? "aws-us-east-1",
    org_id: process.env.BTS_LIVE_NEON_ORG_ID,
  };
  const intent = {
    case_id: id,
    provider: "neon-intent" as const,
    id: config.projectName,
    directory: config.projectDir,
    deleted: 0,
  };
  const matches = await findNeonProjects(config.projectName);
  if (matches.length)
    throw new Error("Neon project name already exists; refusing to adopt an unrecorded resource.");
  state.resource(id, intent.provider, intent.id, intent.directory);
  const response = projectResponse.parse(
    await neonRequest("POST", "projects", JSON.stringify({ project })),
  );
  state.resource(id, "neon", response.project.id, config.projectDir);
  state.deleted(intent);
  return commands.secret(response.connection_uris[0]!.connection_uri);
}

export async function deployVercel(
  config: ProjectConfig,
  state: RunState,
  id: string,
  commands: Commands,
  stage: "preview" | "production",
) {
  const root = config.projectDir;
  const existing = state.resources(id).some((resource) => resource.provider === "vercel");
  if (!existing) {
    const intent: Resource = {
      case_id: id,
      provider: "vercel-intent",
      id: config.projectName,
      directory: root,
      deleted: 0,
    };
    state.resource(id, intent.provider, intent.id, root);
    await commands.run(
      "vercel-create",
      root,
      "bunx",
      vercelArgs(["project", "add", config.projectName]),
    );
    state.resource(id, "vercel", config.projectName, root);
    state.deleted(intent);
    await commands.run(
      "vercel-link",
      root,
      "bunx",
      vercelArgs(["link", "--yes", "--project", config.projectName]),
    );
    const link = z
      .object({ projectId: z.string() })
      .parse(JSON.parse(await readFile(path.join(root, ".vercel/project.json"), "utf8")));
    state.resource(id, "vercel", link.projectId, root);
    state.deleted({ ...intent, provider: "vercel" });
  }
  const protectionBypass = commands.secret(crypto.randomUUID().replaceAll("-", ""));
  const bypassInput = path.join(commands.directory, `${stage}-bypass.json`);
  await writeFile(
    bypassInput,
    JSON.stringify({ generate: { secret: protectionBypass, note: "Better T Stack live tests" } }),
    { mode: 0o600 },
  );
  await commands.run(
    "vercel-protection",
    root,
    "bunx",
    vercelArgs([
      "api",
      `/v1/projects/${config.projectName}/protection-bypass`,
      "--method",
      "PATCH",
      "--input",
      bypassInput,
    ]),
  );
  await commands.run("vercel-env", root, "bun", [
    "scripts/sync-vercel-env.ts",
    stage,
    "--",
    "--scope",
    process.env.BTS_LIVE_VERCEL_SCOPE!,
  ]);
  const stdout = await commands.run(
    `vercel-${stage}`,
    root,
    "bunx",
    vercelArgs(["deploy", "--yes", "--target", stage, "--json", "--logs"]),
  );
  const { deployment: result } = z
    .object({
      status: z.literal("ok"),
      deployment: z.object({
        url: z.url(),
        readyState: z.literal("READY"),
        target: z.string().nullable(),
      }),
    })
    .parse(JSON.parse(stdout));
  if ((result.target ?? "preview") !== stage)
    throw new Error(`Expected ${stage} deployment, received ${result.target}`);
  if (stage === "preview") {
    const unprotected = await fetch(result.url, {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    });
    await unprotected.body?.cancel();
    assertPreviewProtected(unprotected);
  }
  let url = result.url;
  if (stage === "production") {
    const inspection = z
      .object({ aliases: z.array(z.string()) })
      .parse(
        JSON.parse(
          await commands.run(
            "vercel-production-alias",
            root,
            "bunx",
            vercelArgs(["inspect", result.url, "--json"]),
          ),
        ),
      );
    const alias = inspection.aliases.find((host) => host === `${config.projectName}.vercel.app`);
    if (!alias) throw new Error("Production deployment has no expected project alias.");
    url = `https://${alias}`;
  }
  const combined = config.webDeploy === "vercel" && config.serverDeploy === "vercel";
  return {
    protectionBypass: stage === "preview" ? protectionBypass : undefined,
    deploymentUrl: result.url,
    web: config.webDeploy === "vercel" ? url : undefined,
    server:
      config.backend === "self"
        ? `${url}/api`
        : config.serverDeploy === "vercel"
          ? `${url}${combined ? "/api" : ""}`
          : undefined,
  } satisfies Deployment;
}

export async function deployAlchemy(
  config: ProjectConfig,
  state: RunState,
  id: string,
  commands: Commands,
) {
  if (!process.env.CLOUDFLARE_ACCOUNT_ID)
    throw new Blocked(
      "Set CLOUDFLARE_ACCOUNT_ID and connect Cloudflare in the Alchemy profile before deploying.",
    );
  const directory = path.join(config.projectDir, "packages/infra");
  const stage = `test-${id.slice(0, 12)}`;
  state.resource(id, "alchemy", stage, directory);
  const deploy = async (name: string) => {
    const stdout = await commands.run(
      name,
      directory,
      config.packageManager,
      ["run", "deploy", "--stage", stage, "--yes"],
      { CI: "" },
    );
    // Alchemy prints the stack's declared web/server outputs after deployment.
    const web = stdout.match(/\bweb:\s*["'](https?:\/\/[^"']+)["']/)?.[1];
    const server = stdout.match(/\bserver:\s*["'](https?:\/\/[^"']+)["']/)?.[1];
    const output = deploymentOutput.parse({ web, server });
    if (!output.web && !output.server)
      throw new Error(
        "Alchemy deployment returned no usable web/server URL; inspect deployment log.",
      );
    return output;
  };
  const output = await deploy("alchemy-deploy");
  if (output.web && output.server && config.backend !== "self") {
    const envFile = path.join(config.projectDir, "apps/server/.env");
    const source = await readFile(envFile, "utf8");
    const origin = JSON.stringify(new URL(output.web).origin);
    const pattern = /^CORS_ORIGIN=.*$/m;
    const content = pattern.test(source)
      ? source.replace(pattern, `CORS_ORIGIN=${origin}`)
      : `${source}\nCORS_ORIGIN=${origin}\n`;
    await writeFile(envFile, content, { mode: 0o600 });
    const configured = await deploy("alchemy-deploy-configured");
    if (configured.web !== output.web || configured.server !== output.server)
      throw new Error("Alchemy deployment URLs changed while configuring the allowed origin.");
    return configured;
  }
  return output;
}

export async function captureVercelLogs(
  config: ProjectConfig,
  deployment: Deployment,
  commands: Commands,
  stage: string,
) {
  await Bun.sleep(15_000);
  await commands.run(
    `vercel-${stage}-runtime`,
    config.projectDir,
    "bunx",
    vercelArgs([
      "logs",
      "--deployment",
      deployment.deploymentUrl ?? deployment.web ?? deployment.server!,
      "--json",
      "--since",
      "15m",
      "--limit",
      "100",
    ]),
  );
}

export async function cleanup(resource: Resource, commands: Commands) {
  if (resource.provider === "vercel-intent") {
    throw new Error(
      `Vercel creation was not confirmed for ${resource.id}; inspect the create log and account before reconciling this intent. No project was deleted by name.`,
    );
  } else if (resource.provider === "neon-intent") {
    for (const project of await findNeonProjects(resource.id))
      await neonRequest("DELETE", `projects/${encodeURIComponent(project.id)}`);
  } else if (resource.provider === "neon-claim") {
    await commands.run("neon-claim-delete", resource.directory, "npx", [
      "--yes",
      "neon@latest",
      "claim",
      "delete",
      resource.id,
      "--yes",
      "--context-file",
      path.join(resource.directory, "neon-context.json"),
      "--no-analytics",
    ]);
  } else if (resource.provider === "neon") {
    await neonRequest("DELETE", `projects/${encodeURIComponent(resource.id)}`);
  } else if (resource.provider === "vercel") {
    await commands.run(
      "vercel-delete",
      resource.directory,
      "bunx",
      vercelArgs([
        "api",
        `/v9/projects/${encodeURIComponent(resource.id)}`,
        "--method",
        "DELETE",
        "--dangerously-skip-permissions",
      ]),
    );
  } else if (resource.provider === "alchemy") {
    await commands.run(
      "alchemy-destroy",
      resource.directory,
      "bun",
      ["run", "destroy", "--stage", resource.id, "--yes"],
      { CI: "" },
    );
  } else {
    await commands.run("docker-down", resource.directory, "docker", [
      "compose",
      "--project-name",
      resource.id,
      "down",
      "--volumes",
    ]);
  }
}

export async function writeEnvironment(
  config: ProjectConfig,
  databaseUrl: string | undefined,
  commands: Commands,
) {
  const values = new Map<string, string>([
    ["BETTER_AUTH_SECRET", commands.secret(crypto.randomUUID() + crypto.randomUUID())],
    ["ALCHEMY_PASSWORD", commands.secret(crypto.randomUUID() + crypto.randomUUID())],
  ]);
  if (databaseUrl) values.set("DATABASE_URL", databaseUrl);
  const files = ["apps/web/.env", "apps/server/.env", "packages/infra/.env"];
  for (const file of files) {
    const pathname = path.join(config.projectDir, file);
    const source = await readFile(pathname, "utf8").catch(() => undefined);
    if (source === undefined) continue;
    let content = source;
    for (const [key, value] of values) {
      const pattern = new RegExp(`^${key}=.*$`, "m");
      if (pattern.test(content))
        content = content.replace(pattern, `${key}=${JSON.stringify(value)}`);
      else if (file.startsWith("packages/infra")) content += `\n${key}=${JSON.stringify(value)}\n`;
    }
    await writeFile(pathname, content, { mode: 0o600 });
  }
}
