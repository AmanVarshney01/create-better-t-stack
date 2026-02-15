import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as z from "zod/v4";

import { CreateInputSchema } from "../types";
import { getLatestCLIVersion } from "../utils/get-latest-cli-version";
import { createStack } from "./tools/create-stack";
import { planStack } from "./tools/plan-stack";

const AddonOptionsSchema = z.object({
  fumadocs: z
    .object({
      template: z
        .enum([
          "next-mdx",
          "next-mdx-static",
          "waku",
          "react-router",
          "react-router-spa",
          "tanstack-start",
          "tanstack-start-spa",
        ])
        .optional(),
    })
    .optional(),
  wxt: z
    .object({
      template: z.enum(["vanilla", "vue", "react", "solid", "svelte"]).optional(),
    })
    .optional(),
  mcp: z
    .object({
      scope: z.enum(["project", "global"]).optional(),
      agents: z.array(z.string()).optional(),
      serverKeys: z.array(z.string()).optional(),
    })
    .optional(),
  skills: z
    .object({
      scope: z.enum(["project", "global"]).optional(),
      agents: z.array(z.string()).optional(),
      skillKeys: z.array(z.string()).optional(),
    })
    .optional(),
});

const SharedInputSchema = {
  projectName: z.string().optional(),
  directory: z.string().optional(),
  config: z.unknown().optional(),
  addonOptions: AddonOptionsSchema.optional(),
};

function validateConfig(input: unknown) {
  const parsed = CreateInputSchema.partial().safeParse(input ?? {});
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    throw new Error(`Invalid config: ${issue?.message ?? "unknown error"}`);
  }
  return parsed.data;
}

export async function startMcpServer() {
  const server = new McpServer({
    name: "create-better-t-stack",
    version: getLatestCLIVersion(),
  });

  server.registerTool(
    "plan_stack",
    {
      description:
        "Validate and normalize a Better-T-Stack configuration without writing files. Returns reproducible command and planned external steps.",
      inputSchema: SharedInputSchema,
      outputSchema: {
        success: z.boolean(),
        normalizedConfig: z.record(z.string(), z.unknown()).optional(),
        reproducibleCommand: z.string().optional(),
        plannedExternalSteps: z
          .array(
            z.object({
              addon: z.string(),
              status: z.literal("planned"),
              selectedOptions: z.record(z.string(), z.unknown()).optional(),
            }),
          )
          .optional(),
        warnings: z.array(z.string()),
        errors: z.array(z.string()),
      },
    },
    async (args) => {
      try {
        const result = planStack({
          projectName: args.projectName,
          directory: args.directory,
          config: validateConfig(args.config),
          addonOptions: args.addonOptions,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      } catch (error) {
        const result = {
          success: false,
          warnings: [] as string[],
          errors: [error instanceof Error ? error.message : String(error)],
        };
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      }
    },
  );

  server.registerTool(
    "create_stack",
    {
      description:
        "Scaffold a Better-T-Stack project on disk. Returns success, partial_success, or failed along with external step reports.",
      inputSchema: {
        ...SharedInputSchema,
        directoryConflict: z.enum(["merge", "overwrite", "increment", "error"]).optional(),
      },
      outputSchema: {
        status: z.enum(["success", "partial_success", "failed"]),
        projectDirectory: z.string().optional(),
        relativePath: z.string().optional(),
        reproducibleCommand: z.string().optional(),
        externalStepReports: z.array(z.record(z.string(), z.unknown())),
        warnings: z.array(z.string()),
        errors: z.array(z.string()),
      },
    },
    async (args) => {
      try {
        const result = await createStack({
          projectName: args.projectName,
          directory: args.directory,
          config: validateConfig(args.config),
          addonOptions: args.addonOptions,
          directoryConflict: args.directoryConflict,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      } catch (error) {
        const result = {
          status: "failed" as const,
          externalStepReports: [],
          warnings: [] as string[],
          errors: [error instanceof Error ? error.message : String(error)],
        };
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result,
        };
      }
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
