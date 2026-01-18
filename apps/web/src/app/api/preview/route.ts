import type { ProjectConfig } from "@better-t-stack/types";

import { generate, type VirtualNode } from "@better-t-stack/template-generator";
import { EMBEDDED_TEMPLATES } from "@better-t-stack/template-generator";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Convert StackState from web to CLI options format
    const config = stackStateToConfig(body);

    // Generate project to virtual filesystem using Result-based API
    const result = await generate({
      config,
      templates: EMBEDDED_TEMPLATES,
    });

    // Handle Result type
    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    const tree = result.value;

    // Transform VirtualFileTree to web's expected format
    const transformedRoot = transformTree(tree.root);

    return NextResponse.json({
      success: true,
      tree: {
        root: transformedRoot,
        fileCount: tree.fileCount,
        directoryCount: tree.directoryCount,
      },
    });
  } catch (error) {
    console.error("Preview generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

/**
 * Transform VirtualFileTree format to web's expected tree format
 */
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

interface StackState {
  projectName?: string;
  webFrontend?: string[];
  nativeFrontend?: string[];
  backend?: string;
  runtime?: string;
  database?: string;
  orm?: string;
  api?: string;
  auth?: string;
  payments?: string;
  addons?: string[];
  examples?: string[];
  git?: boolean;
  packageManager?: string;
  dbSetup?: string;
  webDeploy?: string;
  serverDeploy?: string;
}

function stackStateToConfig(state: StackState): ProjectConfig {
  // Convert web StackState format to ProjectConfig format
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
    git: state.git ?? false,
    packageManager: (state.packageManager || "bun") as ProjectConfig["packageManager"],
    install: false,
    dbSetup: (state.dbSetup || "none") as ProjectConfig["dbSetup"],
    api: (state.api || "trpc") as ProjectConfig["api"],
    webDeploy: (state.webDeploy || "none") as ProjectConfig["webDeploy"],
    serverDeploy: (state.serverDeploy || "none") as ProjectConfig["serverDeploy"],
  };
}
