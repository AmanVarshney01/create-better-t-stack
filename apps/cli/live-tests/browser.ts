import { writeFile } from "node:fs/promises";
import path from "node:path";

import { type ProjectConfig } from "@better-t-stack/types";
import { chromium, expect as baseExpect, type Browser } from "@playwright/test";

import { Blocked } from "./command";
import type { DatabaseAssertions } from "./database";
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
    (a) => !["none", "turborepo", "nx", "vite-plus", "biome", "oxlint", "pwa"].includes(a),
  );
  if (unsupportedAddons.length)
    reasons.push(`Addon runtime verification required: ${unsupportedAddons.join(", ")}`);
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
  database?: DatabaseAssertions,
  previousStage?: string,
) {
  if (!deployment.web) throw new Blocked("No deployed web URL available for browser verification");
  const context = await browser.newContext();
  const email = `live-${previousStage ?? stage}@example.test`;
  const persistedTask = `Survives restart ${previousStage ?? stage}`;
  const startsWithSignIn = config.frontend.some((f) => ["svelte", "nuxt", "astro"].includes(f));
  const taskPlaceholder = config.frontend.some((f) => ["svelte", "astro"].includes(f))
    ? "New task..."
    : "Add a new task...";
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
  let offline = false;
  const cancelledNavigations: string[] = [];
  const requests: { url: string; status: number }[] = [];
  page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));
  page.on("console", (message) => {
    if (/hydration.*(mismatch|failed)/i.test(message.text()))
      errors.push(`${page.url()}: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    if (offline) return;
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
      await expect(
        page.getByText(config.frontend.includes("nuxt") ? "Connected (OK)" : "Connected", {
          exact: true,
        }),
      ).toBeVisible();
    if (config.auth === "better-auth") {
      const loginSession = config.frontend.includes("nuxt")
        ? undefined
        : page.waitForResponse((response) => response.url().includes("/api/auth/get-session"));
      expect((await page.goto(`${deployment.web}/login`))?.status(), "Login page").toBe(200);
      if (loginSession)
        expect((await loginSession).status(), "Login page session request").toBe(200);
      if (previousStage && !startsWithSignIn)
        await page.getByRole("button", { name: "Already have an account? Sign In" }).click();
      if (!previousStage && config.frontend.includes("svelte"))
        await page.getByRole("button", { name: "Need an account? Sign Up" }).click();
      if (!previousStage && config.frontend.includes("nuxt"))
        await page.getByRole("button", { name: "Sign Up", exact: true }).click();
      if (!previousStage && config.frontend.includes("astro"))
        await page.getByRole("link", { name: "Need an account? Sign Up", exact: true }).click();
      if (!previousStage) await page.getByLabel(/^Name\s*\*?$/).fill("Live Test");
      await page.getByLabel(/^Email\s*\*?$/).fill(email);
      await page.getByLabel(/^Password\s*\*?$/).fill("Live-test-only-password-2026!");
      await page
        .locator("form")
        .getByRole("button", { name: previousStage ? "Sign In" : "Sign Up", exact: true })
        .click();
      await expect(page).toHaveURL(/\/dashboard\/?$/);
      if (config.api !== "none")
        await expect(page.getByText(/^(API: )?This is private$/)).toBeVisible();
      await page.reload();
      if (config.frontend.includes("astro"))
        await expect(page.locator("#user-name")).toHaveText("Live Test");
      else await expect(page.getByText(/Welcome.*Live Test/)).toBeVisible();
      await database?.user(email);
      if (config.api !== "none")
        await expect(page.getByText(/^(API: )?This is private$/)).toBeVisible();
    }
    if (config.examples.includes("todo")) {
      const todosLoaded = config.frontend.includes("nuxt")
        ? undefined
        : page.waitForResponse((response) => /todo[/.]getAll/.test(response.url()));
      expect((await page.goto(`${deployment.web}/todos`))?.status(), "Todo page").toBe(200);
      if (todosLoaded) expect((await todosLoaded).status(), "Todo list request").toBe(200);
      if (previousStage) {
        await expect(
          page.getByRole("checkbox", { name: persistedTask, exact: true }),
        ).toBeVisible();
        await database?.todo(persistedTask, false);
      }
      const task = `Persisted task ${stage}`;
      await page.getByPlaceholder(taskPlaceholder).fill(task);
      await page.getByRole("button", { name: "Add", exact: true }).click();
      const todo = page.getByRole("checkbox", { name: task, exact: true });
      await expect(todo).toBeVisible();
      await database?.todo(task, false);
      const [toggle] = await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === "POST" && /todo[/.]toggle/.test(response.url()),
        ),
        todo.click(),
      ]);
      expect(toggle.status(), "Todo toggle request").toBe(200);
      await expect(todo).toBeChecked();
      await database?.todo(task, true);
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
      await database?.todo(task, undefined);
      await page.reload();
      await expect(todo).toHaveCount(0);
      if (!previousStage) {
        await page.getByPlaceholder(taskPlaceholder).fill(persistedTask);
        await page.getByRole("button", { name: "Add", exact: true }).click();
        await expect(
          page.getByRole("checkbox", { name: persistedTask, exact: true }),
        ).toBeVisible();
        await database?.todo(persistedTask, false);
      }
    }
    if (config.auth === "better-auth") {
      const signedOut = page.waitForResponse(
        (response) =>
          response.url().includes("/api/auth/sign-out") && response.request().method() === "POST",
      );
      const signOut = page
        .getByRole("button", { name: /^Sign out$/i })
        .or(page.getByRole("menuitem", { name: "Sign Out", exact: true }));
      if (!(await signOut.isVisible()))
        await page.getByRole("button", { name: "Live Test", exact: true }).click();
      await signOut.click();
      expect((await signedOut).status(), "Sign-out request").toBe(200);
      await page.waitForURL((url) => url.pathname === "/", { waitUntil: "load" });
      await page.goto(`${deployment.web}/dashboard`);
      await expect(page).toHaveURL(/\/login\/?$/);
      if (!startsWithSignIn)
        await page.getByRole("button", { name: "Already have an account? Sign In" }).click();
      await page.getByLabel(/^Email\s*\*?$/).fill(email);
      await page.getByLabel(/^Password\s*\*?$/).fill("Live-test-only-password-2026!");
      await page.locator("form").getByRole("button", { name: "Sign In", exact: true }).click();
      await expect(page).toHaveURL(/\/dashboard\/?$/);
    }
    if (config.api !== "none" && !config.frontend.includes("nuxt"))
      expect(requests.some((r) => r.url.includes("healthCheck") && r.status === 200)).toBe(true);
    if (config.addons.includes("pwa") && stage !== "development") {
      await page.goto(deployment.web);
      const manifestUrl = await page.locator('link[rel="manifest"]').getAttribute("href");
      expect(manifestUrl, "PWA manifest link").toBeTruthy();
      const manifestResponse = await context.request.get(
        new URL(manifestUrl!, deployment.web).href,
      );
      expect(manifestResponse.status(), "PWA manifest response").toBe(200);
      const manifest = await manifestResponse.json();
      expect(manifest.name).toBe(config.projectName);
      expect(manifest.icons.length).toBeGreaterThan(0);
      for (const icon of manifest.icons)
        expect(
          (await context.request.get(new URL(icon.src, manifestResponse.url()).href)).status(),
          "PWA icon",
        ).toBe(200);
      await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
      const cachedUrls = await page.evaluate(async () => {
        const urls: string[] = [];
        for (const key of await caches.keys())
          for (const request of await (await caches.open(key)).keys()) urls.push(request.url);
        return urls;
      });
      expect(
        cachedUrls.filter((url) => /^\/(api\/)?(auth|trpc|rpc)(\/|$)/.test(new URL(url).pathname)),
        "PWA must not cache authenticated API responses",
      ).toEqual([]);
      offline = true;
      await context.setOffline(true);
      const response = await page.goto(`${deployment.web}/?live-offline=1`);
      expect(response?.status(), "Offline navigation served by the service worker").toBe(200);
      if (config.frontend.includes("tanstack-router"))
        await expect(page.getByRole("link", { name: "Home", exact: true })).toBeVisible();
      else await expect(page.getByRole("heading", { name: "You are offline" })).toBeVisible();
      await context.setOffline(false);
      offline = false;
    }
    expect(errors, "Browser crashes, network failures and wrong API origins").toEqual([]);
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
