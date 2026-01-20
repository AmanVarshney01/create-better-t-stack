import type { ProjectConfig } from "@better-fullstack/types";

import { createFileRoute } from "@tanstack/react-router";

// VirtualNode type definition for transformed output
interface VirtualNode {
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  extension?: string;
  children?: VirtualNode[];
}

interface StackState {
  projectName?: string;
  webFrontend?: string[];
  nativeFrontend?: string[];
  astroIntegration?: string;
  cssFramework?: string;
  uiLibrary?: string;
  backend?: string;
  runtime?: string;
  database?: string;
  orm?: string;
  api?: string;
  auth?: string;
  payments?: string;
  backendLibraries?: string;
  ai?: string;
  stateManagement?: string;
  forms?: string;
  testing?: string;
  email?: string;
  codeQuality?: string[];
  documentation?: string[];
  appPlatforms?: string[];
  examples?: string[];
  git?: boolean | string;
  packageManager?: string;
  dbSetup?: string;
  webDeploy?: string;
  serverDeploy?: string;
}

function stackStateToConfig(state: StackState): ProjectConfig {
  const webFrontend = state.webFrontend || [];
  const nativeFrontend = state.nativeFrontend || [];

  const frontend = [
    ...webFrontend.filter((f) => f !== "none"),
    ...nativeFrontend.filter((f) => f !== "none"),
  ] as ProjectConfig["frontend"];

  let backend = state.backend || "hono";
  if (backend === "self-next" || backend === "self-tanstack-start") {
    backend = "self";
  }

  const git = typeof state.git === "boolean" ? state.git : state.git === "true";

  return {
    projectName: state.projectName || "my-better-t-app",
    projectDir: "/virtual",
    relativePath: "./virtual",
    ecosystem: "typescript" as ProjectConfig["ecosystem"],
    database: (state.database || "none") as ProjectConfig["database"],
    orm: (state.orm || "none") as ProjectConfig["orm"],
    backend: backend as ProjectConfig["backend"],
    runtime: (state.runtime || "bun") as ProjectConfig["runtime"],
    frontend: frontend.length > 0 ? frontend : ["tanstack-router"],
    addons: [
      ...(state.codeQuality || []),
      ...(state.documentation || []),
      ...(state.appPlatforms || []),
    ].filter((a) => a !== "none") as ProjectConfig["addons"],
    examples: (state.examples || []).filter((e) => e !== "none") as ProjectConfig["examples"],
    auth: (state.auth || "none") as ProjectConfig["auth"],
    payments: (state.payments || "none") as ProjectConfig["payments"],
    effect: (state.backendLibraries || "none") as ProjectConfig["effect"],
    ai: (state.ai || "none") as ProjectConfig["ai"],
    stateManagement: (state.stateManagement || "none") as ProjectConfig["stateManagement"],
    forms: (state.forms || "none") as ProjectConfig["forms"],
    testing: (state.testing || "none") as ProjectConfig["testing"],
    email: (state.email || "none") as ProjectConfig["email"],
    git,
    packageManager: (state.packageManager || "bun") as ProjectConfig["packageManager"],
    install: false,
    dbSetup: (state.dbSetup || "none") as ProjectConfig["dbSetup"],
    api: (state.api || "trpc") as ProjectConfig["api"],
    webDeploy: (state.webDeploy || "none") as ProjectConfig["webDeploy"],
    serverDeploy: (state.serverDeploy || "none") as ProjectConfig["serverDeploy"],
    cssFramework: (state.cssFramework || "tailwind") as ProjectConfig["cssFramework"],
    uiLibrary: (state.uiLibrary || "shadcn-ui") as ProjectConfig["uiLibrary"],
    validation: "none" as ProjectConfig["validation"],
    realtime: "none" as ProjectConfig["realtime"],
    jobQueue: "none" as ProjectConfig["jobQueue"],
    animation: "none" as ProjectConfig["animation"],
    fileUpload: "none" as ProjectConfig["fileUpload"],
    logging: "none" as ProjectConfig["logging"],
    observability: "none" as ProjectConfig["observability"],
    cms: "none" as ProjectConfig["cms"],
    caching: "none" as ProjectConfig["caching"],
    rustWebFramework: "none" as ProjectConfig["rustWebFramework"],
    rustFrontend: "none" as ProjectConfig["rustFrontend"],
    rustOrm: "none" as ProjectConfig["rustOrm"],
    rustApi: "none" as ProjectConfig["rustApi"],
    rustCli: "none" as ProjectConfig["rustCli"],
    rustLibraries: [] as ProjectConfig["rustLibraries"],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformTree(node: any): VirtualNode {
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
    children: node.children?.map(transformTree) || [],
  };
}

export const Route = createFileRoute("/api/preview")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as StackState;

          // Dynamic import to keep this server-only
          const { generateVirtualProject, EMBEDDED_TEMPLATES } =
            await import("@better-fullstack/template-generator");

          const config = stackStateToConfig(body);

          const result = await generateVirtualProject({
            config,
            templates: EMBEDDED_TEMPLATES,
          });

          if (!result.success || !result.tree) {
            return Response.json(
              {
                success: false,
                error: result.error || "Failed to generate project",
              },
              { status: 500 },
            );
          }

          const transformedRoot = transformTree(result.tree.root);

          return Response.json({
            success: true,
            tree: {
              root: transformedRoot,
              fileCount: result.tree.fileCount,
              directoryCount: result.tree.directoryCount,
            },
          });
        } catch (error) {
          console.error("Preview generation error:", error);
          return Response.json(
            {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
