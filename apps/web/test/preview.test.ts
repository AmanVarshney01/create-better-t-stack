import { describe, expect, test } from "bun:test";

import type { VirtualNode } from "@better-t-stack/template-generator";
import { createORPCClient, ORPCError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";

import { POST } from "../src/app/api/rpc/[[...rest]]/route";
import { DEFAULT_STACK, PRESET_TEMPLATES } from "../src/lib/constant";
import { resolveStackCompatibility } from "../src/lib/stack-compatibility";
import { StackStateSchema, stackStateToConfig } from "../src/lib/stack-schema";
import { loadStackParams } from "../src/lib/stack-url-state";
import { generateStackCommand, generateStackUrlFromState } from "../src/lib/stack-utils";
import type { router } from "../src/server/router";

const client: RouterClient<typeof router> = createORPCClient(
  new RPCLink({
    url: "http://localhost/api/rpc",
    fetch: (request, init) => POST(new Request(request, init)),
  }),
);

function files(node: VirtualNode, result = new Map<string, string>()) {
  if (node.type === "file") result.set(node.path, node.content);
  else for (const child of node.children) files(child, result);
  return result;
}

describe("builder preview over oRPC", () => {
  for (const preset of PRESET_TEMPLATES) {
    test(`generates ${preset.name} from a shared stack URL`, async () => {
      const resolved = resolveStackCompatibility(preset.stack).stack;
      const shared = await loadStackParams(
        Promise.resolve(new URL(generateStackUrlFromState(resolved))),
      );
      const input = StackStateSchema.parse(shared);
      const preview = await client.preview(input);
      const output = files(preview.root);
      expect(preview.fileCount).toBe(output.size);
      expect(JSON.parse(output.get("package.json")!).name).toBe(
        stackStateToConfig(resolved).projectName,
      );
      expect(generateStackCommand(shared)).toBe(generateStackCommand(resolved));
    });
  }

  test("normalizes project names consistently and uses the folder basename", async () => {
    for (const projectName of ["My App", "apps/My App"]) {
      const input = StackStateSchema.parse({ ...DEFAULT_STACK, projectName });
      const preview = await client.preview(input);
      expect(JSON.parse(files(preview.root).get("package.json")!).name).toBe("My-App");
    }
  });

  test("repairs incompatible shared choices before generating framework-specific files", async () => {
    const input = StackStateSchema.parse({ ...DEFAULT_STACK, webFrontend: ["nuxt"], api: "trpc" });
    const preview = await client.preview(input);
    const output = files(preview.root);
    const api = JSON.parse(output.get("packages/api/package.json")!);
    expect(api.dependencies["@orpc/server"]).toBeDefined();
    expect(api.dependencies["@trpc/server"]).toBeUndefined();
  });

  test("rejects invalid payloads at the HTTP boundary", async () => {
    for (const json of [
      null,
      { webFrontend: "next" },
      { backend: "invented" },
      { projectName: "-bad" },
      { projectName: "/" },
    ]) {
      const response = await POST(
        new Request("http://localhost/api/rpc/preview", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ json }),
        }),
      );
      expect(response.status).toBe(400);
    }
    await expect(client.preview({ projectName: "-bad" })).rejects.toBeInstanceOf(ORPCError);
  });

  test("rejects malformed saved preferences and fills missing fields in older preferences", () => {
    expect(StackStateSchema.safeParse({ addons: "pwa" }).success).toBe(false);
    expect(StackStateSchema.safeParse({ backend: "invented" }).success).toBe(false);
    expect(StackStateSchema.parse({ projectName: "saved-app" })).toEqual({
      ...DEFAULT_STACK,
      projectName: "saved-app",
      yolo: "false",
    });
  });
});
