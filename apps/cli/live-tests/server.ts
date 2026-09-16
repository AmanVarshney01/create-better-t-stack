import type { ProjectConfig } from "@better-t-stack/types";
import { expect, request } from "@playwright/test";
import { z } from "zod";

import type { DatabaseAssertions } from "./database";
import type { Deployment } from "./providers";

export async function verifyServer(
  config: ProjectConfig,
  deployment: Deployment,
  stage: string,
  database?: DatabaseAssertions,
  previousStage?: string,
) {
  if (!deployment.server) throw new Error("Server verification requires a server URL");
  const origin = new URL(deployment.server).origin;
  const headers = new Headers({
    Origin:
      deployment.web ?? (origin.startsWith("http://localhost:") ? "http://localhost:3001" : origin),
  });
  if (deployment.protectionBypass)
    headers.set("x-vercel-protection-bypass", deployment.protectionBypass);
  const context = await request.newContext({
    extraHTTPHeaders: Object.fromEntries(headers),
    timeout: 30_000,
  });
  type Input = { text: string } | { id: number | string; completed?: boolean };
  const rpc = async (procedure: string, input?: Input, status = 200) => {
    const mutation = /todo\.(create|toggle|delete)$/.test(procedure);
    const trpc = config.api === "trpc";
    const response = await context.fetch(
      `${deployment.server}/${trpc ? `trpc/${procedure}` : `rpc/${procedure.replaceAll(".", "/")}`}`,
      {
        method: trpc && !mutation ? "GET" : "POST",
        data: trpc ? (mutation ? input : undefined) : { json: input },
      },
    );
    expect(response.status(), procedure).toBe(status);
    if (status !== 200) return undefined;
    const body = await response.json();
    return trpc
      ? z.object({ result: z.object({ data: z.json() }) }).parse(body).result.data
      : z.object({ json: z.json().optional() }).parse(body).json;
  };
  try {
    expect((await context.get(deployment.server)).status(), "Server health").toBe(200);
    if (config.api !== "none") expect(await rpc("healthCheck")).toBe("OK");
    if (config.auth === "better-auth") {
      if (config.api !== "none") await rpc("privateData", undefined, 401);
      const email = `server-${previousStage ?? stage}@example.test`;
      const signedIn = await context.post(
        `${origin}/api/auth/${previousStage ? "sign-in" : "sign-up"}/email`,
        {
          data: { name: "Live Test", email, password: "Live-test-only-password-2026!" },
        },
      );
      expect(signedIn.status(), "Authentication").toBe(200);
      const session = await context.get(`${origin}/api/auth/get-session`);
      expect((await session.json()).user.email).toBe(email);
      await database?.user(email);
      if (config.api !== "none")
        expect(await rpc("privateData")).toMatchObject({
          message: "This is private",
          user: { email },
        });
    }
    if (config.examples.includes("todo")) {
      const persistedTask = `Survives restart ${previousStage ?? stage}`;
      if (previousStage) {
        expect(await rpc("todo.getAll")).toContainEqual(
          expect.objectContaining({ text: persistedTask, completed: false }),
        );
        await database?.todo(persistedTask, false);
      }
      const text = `Server task ${stage}`;
      await rpc("todo.create", { text });
      const todos = z
        .array(
          z.object({
            id: z.union([z.number(), z.string()]),
            text: z.string(),
            completed: z.boolean(),
          }),
        )
        .parse(await rpc("todo.getAll"));
      const todo = todos.find((row) => row.text === text);
      expect(todo).toBeDefined();
      await database?.todo(text, false);
      await rpc("todo.toggle", { id: todo!.id, completed: true });
      await database?.todo(text, true);
      expect(await rpc("todo.getAll")).toContainEqual({ ...todo, completed: true });
      await rpc("todo.delete", { id: todo!.id });
      await database?.todo(text, undefined);
      expect(await rpc("todo.getAll")).not.toContainEqual({ ...todo, completed: true });
      if (!previousStage) {
        await rpc("todo.create", { text: persistedTask });
        await database?.todo(persistedTask, false);
      }
    }
    if (config.auth === "better-auth") {
      expect((await context.post(`${origin}/api/auth/sign-out`, { data: {} })).status()).toBe(200);
      expect(await (await context.get(`${origin}/api/auth/get-session`)).json()).toBeNull();
      if (config.api !== "none") await rpc("privateData", undefined, 401);
    }
  } finally {
    await context.dispose();
  }
}
