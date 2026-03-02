import { createFileRoute } from "@tanstack/react-router";

import type { StackState } from "@/lib/constant";

import { stackStateToProjectConfig } from "@/lib/preview-config";

// VirtualNode type definition for transformed output
interface VirtualNode {
  name: string;
  path: string;
  type: "file" | "directory";
  content?: string;
  extension?: string;
  children?: VirtualNode[];
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
        const noIndexHeaders = {
          "X-Robots-Tag": "noindex, nofollow, noarchive",
          "Cache-Control": "no-store",
        };
        try {
          const body = (await request.json()) as Partial<StackState>;

          // Dynamic import to keep this server-only
          const { generateVirtualProject, EMBEDDED_TEMPLATES } =
            await import("@better-fullstack/template-generator");

          const config = stackStateToProjectConfig(body);

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
              { status: 500, headers: noIndexHeaders },
            );
          }

          const transformedRoot = transformTree(result.tree.root);

          return Response.json(
            {
              success: true,
              tree: {
                root: transformedRoot,
                fileCount: result.tree.fileCount,
                directoryCount: result.tree.directoryCount,
              },
            },
            { headers: noIndexHeaders },
          );
        } catch (error) {
          console.error("Preview generation error:", error);
          return Response.json(
            {
              success: false,
              error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500, headers: noIndexHeaders },
          );
        }
      },
    },
  },
});
