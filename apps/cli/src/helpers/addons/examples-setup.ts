import fs from "fs-extra";
import path from "node:path";

import type { AvailableDependencies } from "../../constants";
import type { ProjectConfig } from "../../types";

import { addPackageDependency } from "../../utils/add-package-deps";

export async function setupExamples(config: ProjectConfig) {
  const { examples, backend } = config;

  if (!examples || examples.length === 0 || examples[0] === "none") {
    return;
  }

  if (examples.includes("todo") && backend !== "convex" && backend !== "none") {
    await setupTodoDependencies(config);
  }

  if (examples.includes("ai")) {
    await setupAIDependencies(config);
  }
}

async function setupTodoDependencies(config: ProjectConfig) {
  const { projectDir, orm, database, backend } = config;

  const apiDir = path.join(projectDir, "packages/api");
  const apiDirExists = await fs.pathExists(apiDir);

  if (!apiDirExists || backend === "none") {
    return;
  }

  if (orm === "drizzle") {
    const dependencies: AvailableDependencies[] = ["drizzle-orm"];
    if (database === "postgres") {
      dependencies.push("@types/pg");
    }
    await addPackageDependency({
      dependencies,
      projectDir: apiDir,
    });
  } else if (orm === "prisma") {
    await addPackageDependency({
      dependencies: ["@prisma/client"],
      projectDir: apiDir,
    });
  } else if (orm === "mongoose") {
    await addPackageDependency({
      dependencies: ["mongoose"],
      projectDir: apiDir,
    });
  }
}

async function setupAIDependencies(config: ProjectConfig) {
  const { frontend, backend, projectDir } = config;

  const webClientDir = path.join(projectDir, "apps/web");
  const nativeClientDir = path.join(projectDir, "apps/native");
  const serverDir = path.join(projectDir, "apps/server");
  const convexBackendDir = path.join(projectDir, "packages/backend");

  const webClientDirExists = await fs.pathExists(webClientDir);
  const nativeClientDirExists = await fs.pathExists(nativeClientDir);
  const serverDirExists = await fs.pathExists(serverDir);
  const convexBackendDirExists = await fs.pathExists(convexBackendDir);

  const hasReactWeb =
    frontend.includes("react-router") ||
    frontend.includes("tanstack-router") ||
    frontend.includes("next") ||
    frontend.includes("tanstack-start");
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");

  const hasReactNative =
    frontend.includes("native-bare") ||
    frontend.includes("native-uniwind") ||
    frontend.includes("native-unistyles");

  if (backend === "convex" && convexBackendDirExists) {
    await addPackageDependency({
      dependencies: ["@convex-dev/agent", "ai", "@ai-sdk/google"],
      projectDir: convexBackendDir,
    });
  } else if (backend === "self" && webClientDirExists) {
    await addPackageDependency({
      dependencies: ["ai", "@ai-sdk/google"],
      projectDir: webClientDir,
    });
  } else if (serverDirExists && backend !== "none") {
    await addPackageDependency({
      dependencies: ["ai", "@ai-sdk/google"],
      projectDir: serverDir,
    });
  }

  if (webClientDirExists) {
    const dependencies: AvailableDependencies[] = [];

    if (backend === "convex") {
      if (hasReactWeb) {
        dependencies.push("@convex-dev/agent", "streamdown");
      }
    } else {
      dependencies.push("ai");
      if (hasNuxt) {
        dependencies.push("@ai-sdk/vue");
      } else if (hasSvelte) {
        dependencies.push("@ai-sdk/svelte");
      } else if (hasReactWeb) {
        dependencies.push("@ai-sdk/react", "streamdown");
      }
    }

    if (dependencies.length > 0) {
      await addPackageDependency({
        dependencies,
        projectDir: webClientDir,
      });
    }
  }

  if (nativeClientDirExists && hasReactNative) {
    if (backend === "convex") {
      await addPackageDependency({
        dependencies: ["@convex-dev/agent"],
        projectDir: nativeClientDir,
      });
    } else {
      await addPackageDependency({
        dependencies: ["ai", "@ai-sdk/react"],
        projectDir: nativeClientDir,
      });
    }
  }
}
