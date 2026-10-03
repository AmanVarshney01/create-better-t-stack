import { describe, expect, it } from "bun:test";

import { Project, Node } from "ts-morph";
import { z } from "zod";

import { createVirtual, type CreateInput } from "../src";
import { collectFiles } from "./setup";

const packageSchema = z.object({
  imports: z.record(z.string(), z.string()),
  devDependencies: z.record(z.string(), z.string()),
});

const baseConfig = {
  projectName: "sveltekit-migration",
  frontend: ["svelte"],
  backend: "none",
  runtime: "none",
  database: "none",
  orm: "none",
  dbSetup: "none",
  api: "none",
  auth: "none",
  payments: "none",
  webDeploy: "none",
  serverDeploy: "none",
  addons: [],
  examples: [],
  packageManager: "bun",
  git: false,
  install: false,
} satisfies CreateInput;

async function generate(config: Partial<CreateInput> = {}) {
  const result = await createVirtual({ ...baseConfig, ...config });
  if (result.isErr()) throw result.error;
  return collectFiles(result.value.root, result.value.root.path);
}

const targets = [
  { webDeploy: "none", adapter: "auto" },
  { webDeploy: "docker", adapter: "node" },
  { webDeploy: "prisma", adapter: "node" },
  { webDeploy: "vercel", adapter: "vercel" },
  { webDeploy: "cloudflare", adapter: "cloudflare" },
  { webDeploy: "none", adapter: "static", addons: ["electrobun"] },
  { webDeploy: "none", adapter: "static", addons: ["tauri"] },
] satisfies Array<{
  webDeploy: CreateInput["webDeploy"];
  adapter: string;
  addons?: CreateInput["addons"];
}>;

describe("SvelteKit configuration", () => {
  for (const target of targets) {
    it(`configures the ${target.adapter} adapter in Vite for ${target.addons?.[0] ?? target.webDeploy}`, async () => {
      const files = await generate({ webDeploy: target.webDeploy, addons: target.addons ?? [] });
      expect(files.has("apps/web/svelte.config.js")).toBe(false);
      const pkg = packageSchema.parse(JSON.parse(files.get("apps/web/package.json")!));
      const source = new Project({ useInMemoryFileSystem: true }).createSourceFile(
        "vite.config.ts",
        files.get("apps/web/vite.config.ts")!,
      );
      const adapter = source.getImportDeclaration(`@sveltejs/adapter-${target.adapter}`);
      expect(adapter?.getDefaultImport()?.getText()).toBe("adapter");
      expect(pkg.devDependencies[`@sveltejs/adapter-${target.adapter}`]).toBeDefined();
      const call = source
        .getDescendants()
        .find(
          (node) => Node.isCallExpression(node) && node.getExpression().getText() === "sveltekit",
        );
      expect(call && Node.isCallExpression(call) && call.getArguments()[0]?.getText()).toContain(
        "adapter:",
      );
    });
  }

  it("resolves generated subpath imports to real files", async () => {
    const files = await generate({
      backend: "self",
      api: "orpc",
      database: "sqlite",
      orm: "drizzle",
      auth: "better-auth",
      examples: ["todo", "ai"],
    });
    const pkg = packageSchema.parse(JSON.parse(files.get("apps/web/package.json")!));
    for (const [file, content] of files) {
      if (!file.startsWith("apps/web/src/")) continue;
      for (const [, subpath] of content.matchAll(/from ['"](#lib\/[^'"]+)['"]/g)) {
        const target = pkg.imports["#lib/*"]!.replace("*", subpath!.slice("#lib/".length));
        expect(files.has(`apps/web/${target.replace(/^\.\//, "")}`), `${file}: ${subpath}`).toBe(
          true,
        );
      }
    }
  });

  it("declares only public inputs in Kit's environment module", async () => {
    const files = await generate({ backend: "convex" });
    const env = files.get("apps/web/src/env.ts")!;
    expect(env).toContain("PUBLIC_CONVEX_URL:");
    expect(env).not.toContain("BETTER_AUTH_SECRET");
    expect(files.get("apps/web/src/routes/+layout.svelte")).toContain("$app/env/public");
  });

  it("uses native Cloudflare bindings in fullstack request handlers", async () => {
    const files = await generate({ backend: "self", api: "orpc", webDeploy: "cloudflare" });
    expect(files.get("apps/web/src/env.server.ts")).toContain('from "cloudflare:workers"');
    for (const [file, content] of files) {
      if (file.startsWith("apps/web/src/")) expect(content).not.toContain("platform?.env");
    }
    const pkg = packageSchema.parse(JSON.parse(files.get("apps/web/package.json")!));
    expect(pkg.devDependencies.wrangler).toBeDefined();
  });
});
