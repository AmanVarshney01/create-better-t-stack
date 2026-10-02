import { describe, expect, test } from "bun:test";

import { Project } from "ts-morph";
import { z } from "zod";

import { createVirtual, type CreateInput } from "../src";
import { collectFiles } from "./setup";

const modes = [
  { frontend: "react-router", backend: "hono", deploy: "none", server: false },
  { frontend: "react-router", backend: "hono", deploy: "vercel", server: true },
  { frontend: "react-router", backend: "hono", deploy: "docker", server: true },
  { frontend: "react-router", backend: "hono", deploy: "none", server: false, desktop: "tauri" },
  { frontend: "svelte", backend: "hono", deploy: "none", server: false },
  { frontend: "svelte", backend: "hono", deploy: "vercel", server: true },
  { frontend: "svelte", backend: "hono", deploy: "docker", server: true },
  { frontend: "svelte", backend: "self", deploy: "none", server: true },
  { frontend: "svelte", backend: "hono", deploy: "none", server: false, desktop: "electrobun" },
] as const;

const fetchOptionsSchema = z.object({
  throw: z.literal(true),
  headers: z.object({ cookie: z.string() }).optional(),
  signal: z.instanceof(AbortSignal).optional(),
  baseURL: z.string().optional(),
  customFetchImpl: z.unknown().optional(),
});

type AuthFixture = {
  getSession: (input: { fetchOptions: unknown }) => Promise<unknown>;
  customer?: { state: (input: { fetchOptions: unknown }) => Promise<unknown> };
};

const loadSchema = z.function({
  input: [z.object({ request: z.instanceof(Request), url: z.instanceof(URL), fetch: z.unknown() })],
  output: z.unknown(),
});

async function generate(mode: (typeof modes)[number], payments: CreateInput["payments"]) {
  const result = await createVirtual({
    projectName: "auth-loader-test",
    frontend: [mode.frontend],
    backend: mode.backend,
    runtime: mode.backend === "self" ? "none" : "node",
    database: "postgres",
    orm: "drizzle",
    dbSetup: "none",
    api: "orpc",
    auth: "better-auth",
    payments,
    webDeploy: mode.deploy,
    serverDeploy: mode.deploy,
    addons: "desktop" in mode ? [mode.desktop] : [],
    packageManager: "bun",
    install: false,
    git: false,
  });
  if (result.isErr()) throw result.error;
  const files = collectFiles(result.value.root, result.value.root.path);
  const file =
    mode.frontend === "react-router"
      ? "apps/web/src/routes/dashboard.tsx"
      : `apps/web/src/routes/dashboard/+page${mode.server ? ".server" : ""}.ts`;
  const content = files.get(file);
  if (!content) throw new Error(`Missing generated loader: ${file}`);
  const source = new Project({ useInMemoryFileSystem: true }).createSourceFile(
    "dashboard.tsx",
    content,
  );
  // Execute the generated loader, with auth responses supplied by the test.
  // Real framework redirects and type generation are covered by the build/live cases.
  for (const declaration of source.getImportDeclarations()) declaration.remove();
  if (mode.frontend === "react-router") {
    for (const declaration of source.getFunctions()) {
      if (declaration.getName() !== (mode.server ? "loader" : "clientLoader")) {
        declaration.remove();
      }
    }
  }
  const compiled = new Bun.Transpiler({ loader: "ts" })
    .transformSync(source.getFullText())
    .replace(/^export /gm, "");
  const name = mode.frontend === "svelte" ? "load" : mode.server ? "loader" : "clientLoader";
  return (authClient: AuthFixture) => {
    const redirect =
      mode.frontend === "svelte"
        ? (status: number, url: string) => {
            throw new Response(null, { status, headers: { location: url } });
          }
        : (url: string) => new Response(null, { status: 302, headers: { location: url } });
    const load = loadSchema.implementAsync(
      new Function("authClient", "redirect", `${compiled}\nreturn ${name};`)(authClient, redirect),
    );
    return async (request: Request): Promise<unknown> =>
      load({ request, url: new URL(request.url), fetch });
  };
}

for (const mode of modes) {
  describe(`${mode.frontend}/${mode.backend}/${mode.deploy}${"desktop" in mode ? `/${mode.desktop}` : ""} auth loader`, () => {
    test("loads request-local user and billing data before rendering", async () => {
      const calls: z.infer<typeof fetchOptionsSchema>[] = [];
      const createLoader = await generate(mode, "polar");
      const load = createLoader({
        getSession: async ({ fetchOptions }: { fetchOptions: unknown }) => {
          const options = fetchOptionsSchema.parse(fetchOptions);
          calls.push(options);
          return {
            user: { name: options.headers?.cookie ?? "browser-user" },
            session: { token: "private-token" },
          };
        },
        customer: {
          state: async ({ fetchOptions }: { fetchOptions: unknown }) => {
            calls.push(fetchOptionsSchema.parse(fetchOptions));
            return { activeSubscriptions: [{ id: "subscription" }] };
          },
        },
      });
      for (const user of ["first-user", "second-user"]) {
        const request = new Request("https://web.example.test/dashboard", {
          headers: {
            cookie: user,
            authorization: "must-not-forward",
            "x-unrelated": "must-not-forward",
          },
        });
        expect(await load(request)).toEqual({
          user: { name: mode.server ? user : "browser-user" },
          customerState: { activeSubscriptions: [{ id: "subscription" }] },
        });
        for (const options of calls.splice(0)) {
          expect(options.headers).toEqual(mode.server ? { cookie: user } : undefined);
          expect(options.signal).toBe(
            mode.frontend === "react-router" || mode.server ? request.signal : undefined,
          );
          if (mode.frontend === "svelte") expect(options.customFetchImpl).toBe(fetch);
          if (mode.backend === "self")
            expect(options.baseURL).toBe("https://web.example.test/api/auth");
        }
      }
    });

    test("redirects missing sessions before loading billing data", async () => {
      const createLoader = await generate(mode, "polar");
      const load = createLoader({
        getSession: async () => null,
        customer: {
          state: () => {
            throw new Error("Billing must not run without a session");
          },
        },
      });
      try {
        await load(new Request("https://web.example.test/dashboard"));
        throw new Error("Unauthenticated loader did not redirect");
      } catch (response) {
        expect(response).toBeInstanceOf(Response);
        if (!(response instanceof Response)) throw response;
        expect(response.headers.get("location")).toBe("/login");
      }
    });

    test("propagates auth service errors instead of treating them as logout", async () => {
      const createLoader = await generate(mode, "none");
      const failure = new Error("Auth service unavailable");
      const load = createLoader({
        getSession: async ({ fetchOptions }: { fetchOptions: unknown }) => {
          fetchOptionsSchema.parse(fetchOptions);
          throw failure;
        },
      });
      await expect(load(new Request("https://web.example.test/dashboard"))).rejects.toBe(failure);
    });
  });
}
