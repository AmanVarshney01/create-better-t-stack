import type { Frontend, ProjectConfig } from "@better-fullstack/types";

import type { VirtualFileSystem } from "../core/virtual-fs";

import { addPackageDependency } from "../utils/add-deps";

// Fullstack frontends with built-in servers that use backend=none
const FULLSTACK_FRONTENDS: Frontend[] = ["fresh", "qwik", "angular", "redwood"];

/**
 * Process AI SDK dependencies based on config.ai selection
 * Installs the appropriate AI framework/SDK to the server package
 */
export function processAIDeps(vfs: VirtualFileSystem, config: ProjectConfig): void {
  const { ai, backend, frontend } = config;

  // Skip if no AI SDK selected
  if (ai === "none") return;

  // Get the web frontend for client-side AI packages
  const webFrontend = frontend.find((f) => !f.startsWith("native") && f !== "none");

  // Template generator uses apps/web for web frontends, not the framework name
  const webPath = "apps/web/package.json";

  // Determine the target package path based on backend
  // For "self" backend (Next.js, Nuxt, etc.), the server code is in the web app
  // For fullstack frontends with built-in servers (Fresh, Qwik, etc.), use web package
  const hasFullstackFrontend = frontend.some((f) => FULLSTACK_FRONTENDS.includes(f));
  let serverPath: string;

  if (backend === "self" && webFrontend) {
    serverPath = webPath;
  } else if (backend === "none" && hasFullstackFrontend) {
    serverPath = webPath;
  } else if (backend === "none") {
    return;
  } else {
    serverPath = "apps/server/package.json";
  }

  // Skip if target doesn't exist
  if (!vfs.exists(serverPath)) return;

  // Get frontend package path - use apps/web for all web frontends
  const frontendPath = webFrontend && vfs.exists(webPath) ? webPath : null;

  switch (ai) {
    case "vercel-ai":
      // Vercel AI SDK - core package
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["ai"],
      });
      // Add React hooks if React frontend
      if (
        frontendPath &&
        webFrontend &&
        ["tanstack-router", "react-router", "tanstack-start", "next"].includes(webFrontend)
      ) {
        addPackageDependency({
          vfs,
          packagePath: frontendPath,
          dependencies: ["@ai-sdk/react"],
        });
      }
      // Add Vue hooks if Vue frontend
      if (frontendPath && webFrontend === "nuxt") {
        addPackageDependency({
          vfs,
          packagePath: frontendPath,
          dependencies: ["@ai-sdk/vue"],
        });
      }
      // Add Svelte hooks if Svelte frontend
      if (frontendPath && webFrontend === "svelte") {
        addPackageDependency({
          vfs,
          packagePath: frontendPath,
          dependencies: ["@ai-sdk/svelte"],
        });
      }
      break;

    case "mastra":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["mastra", "@mastra/core"],
      });
      break;

    case "voltagent":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: [
          "@voltagent/core",
          "@voltagent/server-hono",
          "@voltagent/libsql",
          "@voltagent/logger",
        ],
      });
      break;

    case "langgraph":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@langchain/langgraph", "@langchain/core", "@langchain/google-genai"],
      });
      break;

    case "openai-agents":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@openai/agents"],
      });
      break;

    case "google-adk":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["@google/adk"],
      });
      break;

    case "modelfusion":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["modelfusion"],
      });
      break;

    case "langchain":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["langchain", "@langchain/core"],
      });
      break;

    case "llamaindex":
      addPackageDependency({
        vfs,
        packagePath: serverPath,
        dependencies: ["llamaindex"],
      });
      break;
  }
}
