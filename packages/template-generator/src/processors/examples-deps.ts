import type { ProjectConfig } from "@better-t-stack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency, type AvailableDependencies } from "../utils/add-deps";

export function processExamplesDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  if (!config.examples || config.examples.length === 0 || config.examples[0] === "none") return;

  if (
    config.examples.includes("todo") &&
    config.backend !== "convex" &&
    config.backend !== "none"
  ) {
    setupTodoDependencies(vfs, config);
  }

  if (config.examples.includes("ai")) {
    setupAIDependencies(vfs, config);
  }
}

function setupTodoDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { orm, database, backend } = config;
  const apiPkgPath = "packages/api/package.json";
  if (!vfs.exists(apiPkgPath) || backend === "none") return;

  if (orm === "drizzle") {
    const deps: AvailableDependencies[] = ["drizzle-orm"];
    if (database === "postgres") deps.push("@types/pg");
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: deps });
  } else if (orm === "prisma") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["@prisma/client"] });
  } else if (orm === "mongoose") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["mongoose"] });
  } else if (orm === "typeorm") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["typeorm"] });
  } else if (orm === "kysely") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["kysely"] });
  } else if (orm === "mikroorm") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["@mikro-orm/core"] });
  } else if (orm === "sequelize") {
    addPackageDependency({ vfs, packagePath: apiPkgPath, dependencies: ["sequelize"] });
  }
}

function setupAIDependencies(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { frontend, backend, ai } = config;

  const webPkgPath = "apps/web/package.json";
  const nativePkgPath = "apps/native/package.json";
  const serverPkgPath = "apps/server/package.json";
  const convexBackendPkgPath = "packages/backend/package.json";

  const webExists = vfs.exists(webPkgPath);
  const nativeExists = vfs.exists(nativePkgPath);
  const serverExists = vfs.exists(serverPkgPath);
  const convexBackendExists = vfs.exists(convexBackendPkgPath);

  const hasReactWeb = frontend.some((f) =>
    ["react-router", "tanstack-router", "next", "tanstack-start"].includes(f),
  );
  const hasNuxt = frontend.includes("nuxt");
  const hasSvelte = frontend.includes("svelte");
  const hasReactNative = frontend.some((f) =>
    ["native-bare", "native-uniwind", "native-unistyles"].includes(f),
  );

  // Check which AI SDK is selected
  const useMastra = ai === "mastra";
  const useVoltAgent = ai === "voltagent";
  const useLangGraph = ai === "langgraph";

  if (backend === "convex" && convexBackendExists) {
    addPackageDependency({
      vfs,
      packagePath: convexBackendPkgPath,
      dependencies: ["@convex-dev/agent"],
      customDependencies: { ai: "^5.0.117", "@ai-sdk/google": "^2.0.52" },
    });
  } else if (backend === "self" && webExists) {
    if (useMastra) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["mastra", "@mastra/core"],
      });
    } else if (useVoltAgent) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@voltagent/core", "@voltagent/server-hono", "@voltagent/libsql"],
        customDependencies: { ai: "^6.0.0", "@ai-sdk/google": "^3.0.1", zod: "^3.25.76" },
      });
    } else if (useLangGraph) {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["@langchain/langgraph", "@langchain/core", "@langchain/google-genai"],
      });
    } else {
      addPackageDependency({
        vfs,
        packagePath: webPkgPath,
        dependencies: ["ai", "@ai-sdk/google", "@ai-sdk/devtools"],
      });
    }
  } else if (serverExists && backend !== "none") {
    if (useMastra) {
      addPackageDependency({
        vfs,
        packagePath: serverPkgPath,
        dependencies: ["mastra", "@mastra/core"],
      });
    } else if (useVoltAgent) {
      addPackageDependency({
        vfs,
        packagePath: serverPkgPath,
        dependencies: ["@voltagent/core", "@voltagent/server-hono", "@voltagent/libsql"],
        customDependencies: { ai: "^6.0.0", "@ai-sdk/google": "^3.0.1", zod: "^3.25.76" },
      });
    } else if (useLangGraph) {
      addPackageDependency({
        vfs,
        packagePath: serverPkgPath,
        dependencies: ["@langchain/langgraph", "@langchain/core", "@langchain/google-genai"],
      });
    } else {
      addPackageDependency({
        vfs,
        packagePath: serverPkgPath,
        dependencies: ["ai", "@ai-sdk/google", "@ai-sdk/devtools"],
      });
    }
  }

  if (webExists) {
    const deps: AvailableDependencies[] = [];
    if (backend === "convex") {
      if (hasReactWeb) deps.push("@convex-dev/agent", "streamdown");
    } else if (useMastra) {
      // Mastra uses @ai-sdk/react for frontend integration
      if (hasReactWeb) deps.push("@ai-sdk/react", "streamdown");
    } else if (useVoltAgent) {
      // VoltAgent uses @ai-sdk/react for frontend integration (built on Vercel AI SDK)
      if (hasReactWeb) deps.push("@ai-sdk/react", "streamdown");
    } else if (useLangGraph) {
      // LangGraph uses native streaming - no special frontend SDK needed
      // Just add streamdown for markdown rendering
      if (hasReactWeb) deps.push("streamdown");
    } else {
      deps.push("ai");
      if (hasNuxt) deps.push("@ai-sdk/vue");
      else if (hasSvelte) deps.push("@ai-sdk/svelte");
      else if (hasReactWeb) deps.push("@ai-sdk/react", "streamdown");
    }
    if (deps.length > 0) {
      addPackageDependency({ vfs, packagePath: webPkgPath, dependencies: deps });
    }
  }

  if (nativeExists && hasReactNative) {
    if (backend === "convex") {
      addPackageDependency({
        vfs,
        packagePath: nativePkgPath,
        dependencies: ["@convex-dev/agent"],
      });
    } else {
      addPackageDependency({
        vfs,
        packagePath: nativePkgPath,
        dependencies: ["ai", "@ai-sdk/react"],
      });
    }
  }
}
