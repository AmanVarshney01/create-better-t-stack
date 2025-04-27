import path from "node:path";
import fs from "fs-extra";
import type { ProjectBackend, ProjectConfig } from "../types";
import { addPackageDependency } from "../utils/add-package-deps";

export async function setupRuntime(config: ProjectConfig): Promise<void> {
 const { projectName, runtime, backend } = config;
 const projectDir = path.resolve(process.cwd(), projectName);
 if (backend === "next") {
  return;
 }

 const serverDir = path.join(projectDir, "apps/server");

 if (runtime === "bun") {
  await setupBunRuntime(serverDir, backend);
 } else if (runtime === "node") {
  await setupNodeRuntime(serverDir, backend);
 }
}

async function setupBunRuntime(
 serverDir: string,
 backend: ProjectBackend,
): Promise<void> {
 const packageJsonPath = path.join(serverDir, "package.json");
 const packageJson = await fs.readJson(packageJsonPath);

 packageJson.scripts = {
  ...packageJson.scripts,
  dev: "bun run --hot src/index.ts",
  start: "bun run dist/src/index.js",
 };

 await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

 await addPackageDependency({
  devDependencies: ["@types/bun"],
  projectDir: serverDir,
 });
}

async function setupNodeRuntime(
 serverDir: string,
 backend: ProjectBackend,
): Promise<void> {
 const packageJsonPath = path.join(serverDir, "package.json");
 const packageJson = await fs.readJson(packageJsonPath);

 packageJson.scripts = {
  ...packageJson.scripts,
  dev: "tsx watch src/index.ts",
  start: "node dist/src/index.js",
 };

 await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

 await addPackageDependency({
  devDependencies: ["tsx", "@types/node"],
  projectDir: serverDir,
 });

 if (backend === "hono") {
  await addPackageDependency({
   dependencies: ["@hono/node-server"],
   projectDir: serverDir,
  });
 } else if (backend === "elysia") {
  await addPackageDependency({
   dependencies: ["@elysiajs/node"],
   projectDir: serverDir,
  });
 } else if (backend === "fastify") {
  await addPackageDependency({
   dependencies: ["@fastify/autoload", "@fastify/cors", "@fastify/env", "@fastify/helmet", "close-with-grace", "fastify-better-auth", "fastify-plugin"],
   projectDir: serverDir,
  });
 }
}
