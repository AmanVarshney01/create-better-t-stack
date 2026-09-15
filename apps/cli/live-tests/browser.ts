import { writeFile } from "node:fs/promises";
import path from "node:path";

import { type ProjectConfig } from "@better-t-stack/types";
import { chromium, expect as baseExpect, type Browser } from "@playwright/test";

import { Blocked } from "./command";
import type { Deployment } from "./providers";

const expect = baseExpect.configure({ timeout: 20_000 });

export function verificationBlockers(config: ProjectConfig): string[] {
  const reasons: string[] = [];
  if (config.frontend.some((f) => f.startsWith("native-")))
    reasons.push("Native device runner required");
  if (config.backend === "convex")
    reasons.push("Isolated Convex deployment and verification required");
  if (config.auth === "clerk")
    reasons.push("Clerk test-instance provisioning and verification required");
  if (config.payments !== "none")
    reasons.push("Polar sandbox checkout/webhook verification required");
  if (config.examples.includes("ai"))
    reasons.push("AI provider credentials and response verification required");
  const unsupportedAddons = config.addons.filter(
    (a) =>
      !["none", "turborepo", "nx", "vite-plus", "biome", "oxlint", "husky", "lefthook"].includes(a),
  );
  if (unsupportedAddons.length)
    reasons.push(`Addon runtime verification required: ${unsupportedAddons.join(", ")}`);
  if (!config.frontend.length) reasons.push("Server-only RPC client verification required");
  if (config.webDeploy === "docker") reasons.push("Container browser runner required");
  if (
    config.webDeploy !== "none" &&
    config.backend !== "self" &&
    config.backend !== "none" &&
    config.serverDeploy === "none"
  )
    reasons.push("A remote frontend cannot access the separate local backend");
  return reasons;
}

export async function openBrowser(): Promise<Browser> {
  return chromium.launch();
}

export async function verifyBrowser(
  browser: Browser,
  config: ProjectConfig,
  deployment: Deployment,
  directory: string,
  stage: string,
) {
  if (!deployment.web) throw new Blocked("No deployed web URL available for browser verification");
  const context = await browser.newContext();
  if (deployment.protectionBypass) {
    const origins = new Set(
      [deployment.web, deployment.server].filter(Boolean).map((url) => new URL(url!).origin),
    );
    await context.route(
      (url) => origins.has(url.origin),
      (route) =>
        route.continue({
          headers: {
            ...route.request().headers(),
            "x-vercel-protection-bypass": deployment.protectionBypass!,
          },
        }),
    );
  }
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);
  page.setDefaultNavigationTimeout(60_000);
  const errors: string[] = [];
  const cancelledNavigations: string[] = [];
  const requests: { url: string; status: number }[] = [];
  page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));
  page.on("requestfailed", (request) => {
    const failure = request.failure()?.errorText;
    if (
      failure === "net::ERR_ABORTED" &&
      request.method() === "GET" &&
      request.headers().rsc === "1"
    ) {
      cancelledNavigations.push(request.url());
      return;
    }
    errors.push(`${request.method()} ${request.url()}: ${failure}`);
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (response.request().headers().rsc === "1" && response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
    if (!/^\/(api\/)?(auth|trpc|rpc)(\/|$)/.test(url.pathname)) return;
    requests.push({ url: response.url(), status: response.status() });
    if (!response.ok() || url.origin !== new URL(deployment.server ?? deployment.web!).origin) {
      errors.push(`${response.status()} ${response.url()}`);
    }
  });
  try {
    const home = await page.goto(deployment.web);
    expect(home?.status(), "Deployed home page").toBe(200);
    if (config.api !== "none")
      await expect(page.getByText("Connected", { exact: true })).toBeVisible();
    if (config.auth === "better-auth") {
      const loginSession = page.waitForResponse((response) =>
        response.url().includes("/api/auth/get-session"),
      );
      await page.goto(`${deployment.web}/login`);
      expect((await loginSession).status(), "Login page session request").toBe(200);
      if (config.frontend.includes("svelte"))
        await page.getByRole("button", { name: "Need an account? Sign Up" }).click();
      await page.getByRole("textbox", { name: "Name", exact: true }).fill("Live Test");
      await page
        .getByRole("textbox", { name: "Email", exact: true })
        .fill(`live-${stage}@example.test`);
      await page
        .getByRole("textbox", { name: "Password", exact: true })
        .fill("Live-test-only-password-2026!");
      await page.locator("form").getByRole("button", { name: "Sign Up", exact: true }).click();
      await expect(page).toHaveURL(/\/dashboard\/?$/);
      if (config.api !== "none")
        await expect(page.getByText(/^(API: )?This is private$/)).toBeVisible();
      await page.reload();
      await expect(page.getByText(/Welcome.*Live Test/)).toBeVisible();
      if (config.api !== "none")
        await expect(page.getByText(/^(API: )?This is private$/)).toBeVisible();
    }
    if (config.examples.includes("todo")) {
      const todosLoaded = page.waitForResponse((response) => /todo[/.]getAll/.test(response.url()));
      await page.goto(`${deployment.web}/todos`);
      expect((await todosLoaded).status(), "Todo list request").toBe(200);
      const task = `Persisted task ${stage}`;
      await page
        .getByPlaceholder(config.frontend.includes("svelte") ? "New task..." : "Add a new task...")
        .fill(task);
      await page.getByRole("button", { name: "Add", exact: true }).click();
      const todo = page.getByRole("checkbox", { name: task, exact: true });
      await expect(todo).toBeVisible();
      const [toggle] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === "POST" && /todo[/.]toggle/.test(response.url()),
        ),
        todo.click(),
      ]);
      expect(toggle.status(), "Todo toggle request").toBe(200);
      await expect(todo).toBeChecked();
      await page.reload();
      await expect(todo).toBeChecked();
      const [deleted] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === "POST" && /todo[/.]delete/.test(response.url()),
        ),
        page
          .getByRole("listitem")
          .filter({ has: todo })
          .getByRole("button", { name: "Delete todo" })
          .click(),
      ]);
      expect(deleted.status(), "Todo delete request").toBe(200);
      await expect(todo).toHaveCount(0);
      await page.reload();
      await expect(todo).toHaveCount(0);
    }
    if (config.auth === "better-auth") {
      const signedOut = page.waitForResponse(
        (response) =>
          response.url().includes("/api/auth/sign-out") && response.request().method() === "POST",
      );
      if (config.frontend.some((frontend) => frontend === "nuxt" || frontend === "svelte"))
        await page.getByRole("button", { name: /^Sign out$/i }).click();
      else {
        await page.getByRole("button", { name: "Live Test", exact: true }).click();
        await page.getByRole("menuitem", { name: "Sign Out" }).click();
      }
      expect((await signedOut).status(), "Sign-out request").toBe(200);
      await expect(page.getByRole("button", { name: "Sign In", exact: true })).toBeVisible();
      await page.goto(`${deployment.web}/dashboard`);
      await expect(page).toHaveURL(/\/login\/?$/);
      if (!config.frontend.includes("svelte"))
        await page.getByRole("button", { name: "Already have an account? Sign In" }).click();
      await page
        .getByRole("textbox", { name: "Email", exact: true })
        .fill(`live-${stage}@example.test`);
      await page
        .getByRole("textbox", { name: "Password", exact: true })
        .fill("Live-test-only-password-2026!");
      await page.locator("form").getByRole("button", { name: "Sign In", exact: true }).click();
      await expect(page).toHaveURL(/\/dashboard\/?$/);
    }
    expect(errors, "Browser crashes, network failures and wrong API origins").toEqual([]);
    if (config.api !== "none")
      expect(requests.some((r) => r.url.includes("healthCheck") && r.status === 200)).toBe(true);
  } catch (error) {
    await page
      .screenshot({ path: path.join(directory, `${stage}-failure.png`), fullPage: true })
      .catch(() => {});
    throw error;
  } finally {
    await writeFile(
      path.join(directory, `${stage}-network.json`),
      JSON.stringify({ requests, errors, cancelledNavigations }, null, 2),
      { mode: 0o600 },
    );
    await context.tracing.stop({ path: path.join(directory, `${stage}-trace.zip`) });
    await context.close();
  }
}
