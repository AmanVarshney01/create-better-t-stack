import type { ProjectConfig } from "@better-t-stack/types";

import {
  generateVirtualProject,
  EMBEDDED_TEMPLATES,
  type VirtualNode,
} from "@better-t-stack/template-generator";
import { createServerFn } from "@tanstack/react-start/server";
import { z } from "zod";

// Schema for stack state input
const stackStateSchema = z.object({
  projectName: z.string().optional(),
  webFrontend: z.array(z.string()).optional(),
  nativeFrontend: z.array(z.string()).optional(),
  astroIntegration: z.string().optional(),
  backend: z.string().optional(),
  runtime: z.string().optional(),
  database: z.string().optional(),
  orm: z.string().optional(),
  api: z.string().optional(),
  auth: z.string().optional(),
  payments: z.string().optional(),
  addons: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  git: z.union([z.boolean(), z.string()]).optional(),
  packageManager: z.string().optional(),
  dbSetup: z.string().optional(),
  webDeploy: z.string().optional(),
  serverDeploy: z.string().optional(),
});

type StackState = z.infer<typeof stackStateSchema>;

function stackStateToConfig(state: StackState): ProjectConfig {
  const webFrontend = state.webFrontend || [];
  const nativeFrontend = state.nativeFrontend || [];

  // Combine frontends, filtering out "none"
  const frontend = [
    ...webFrontend.filter((f) => f !== "none"),
    ...nativeFrontend.filter((f) => f !== "none"),
  ] as ProjectConfig["frontend"];

  // Handle self-* backend options
  let backend = state.backend || "hono";
  if (backend === "self-next" || backend === "self-tanstack-start") {
    backend = "self";
  }

  // Convert git string to boolean
  const git = typeof state.git === "boolean" ? state.git : state.git === "true";

  return {
    projectName: state.projectName || "my-better-t-app",
    projectDir: "/virtual",
    relativePath: "./virtual",
    database: (state.database || "none") as ProjectConfig["database"],
    orm: (state.orm || "none") as ProjectConfig["orm"],
    backend: backend as ProjectConfig["backend"],
    runtime: (state.runtime || "bun") as ProjectConfig["runtime"],
    frontend: frontend.length > 0 ? frontend : ["tanstack-router"],
    addons: (state.addons || []).filter((a) => a !== "none") as ProjectConfig["addons"],
    examples: (state.examples || []).filter((e) => e !== "none") as ProjectConfig["examples"],
    auth: (state.auth || "none") as ProjectConfig["auth"],
    payments: (state.payments || "none") as ProjectConfig["payments"],
    git,
    packageManager: (state.packageManager || "bun") as ProjectConfig["packageManager"],
    install: false,
    dbSetup: (state.dbSetup || "none") as ProjectConfig["dbSetup"],
    api: (state.api || "trpc") as ProjectConfig["api"],
    webDeploy: (state.webDeploy || "none") as ProjectConfig["webDeploy"],
    serverDeploy: (state.serverDeploy || "none") as ProjectConfig["serverDeploy"],
  };
}

function transformTree(node: VirtualNode): Record<string, unknown> {
  if (node.type === "file") {
    return {
      name: node.name,
      path: node.path,
      type: "file" as const,
      content: node.content,
      extension: node.extension,
    };
  }

  return {
    name: node.name,
    path: node.path,
    type: "directory" as const,
    children: node.children.map(transformTree),
  };
}

export const generatePreview = createServerFn({ method: "POST" })
  .validator(stackStateSchema)
  .handler(async ({ data }) => {
    try {
      const config = stackStateToConfig(data);

      const result = await generateVirtualProject({
        config,
        templates: EMBEDDED_TEMPLATES,
      });

      if (!result.success || !result.tree) {
        return {
          success: false as const,
          error: result.error || "Failed to generate project",
        };
      }

      const transformedRoot = transformTree(result.tree.root);

      return {
        success: true as const,
        tree: {
          root: transformedRoot,
          fileCount: result.tree.fileCount,
          directoryCount: result.tree.directoryCount,
        },
      };
    } catch (error) {
      console.error("Preview generation error:", error);
      return {
        success: false as const,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });
