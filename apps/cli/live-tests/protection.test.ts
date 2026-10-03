import { expect, test } from "bun:test";

import { chromium, request } from "@playwright/test";

import { authorizeDeployment } from "./protection";

test.skipIf(process.env.BTS_LIVE_BROWSER_TESTS !== "1")(
  "bypass cookies authorize browser, SSR and HTTP checks without leaking to external requests",
  async () => {
    const externalRequests: Headers[] = [];
    const external = Bun.serve({
      hostname: "127.0.0.1",
      port: 0,
      fetch(req) {
        externalRequests.push(req.headers);
        return new Response("external");
      },
    });
    const externalUrl = `http://127.0.0.1:${external.port}`;
    const secret = "disposable-bypass-test-secret";
    let bootstrapRequests = 0;
    const protectedRequests: Headers[] = [];
    const protectedServer = Bun.serve({
      hostname: "localhost",
      port: 0,
      fetch(req) {
        if (req.headers.get("x-vercel-protection-bypass") === secret) {
          expect(req.headers.get("x-vercel-set-bypass-cookie")).toBe("true");
          bootstrapRequests++;
          // An external bootstrap redirect must not receive the bootstrap headers.
          return new Response(null, {
            status: 302,
            headers: {
              location: `${externalUrl}/bootstrap-redirect`,
              "set-cookie":
                "__vercel_protection_bypass=test-cookie; Path=/; HttpOnly; SameSite=Lax",
            },
          });
        }
        protectedRequests.push(req.headers);
        if (!req.headers.get("cookie")?.includes("__vercel_protection_bypass=test-cookie"))
          return new Response("protected", { status: 401 });
        if (new URL(req.url).pathname === "/redirect")
          return Response.redirect(`${externalUrl}/navigation-redirect`, 302);
        return new Response(`<h1>Authorized</h1><img src="${externalUrl}/asset">`, {
          headers: { "content-type": "text/html" },
        });
      },
    });
    const origin = `http://localhost:${protectedServer.port}`;
    const deployment = { web: origin, server: `${origin}/api`, protectionBypass: secret };
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const http = await request.newContext();
    try {
      expect((await context.request.get(origin)).status()).toBe(401);
      protectedRequests.length = 0;
      await authorizeDeployment(context.request, deployment);
      expect(bootstrapRequests).toBe(1);
      expect(externalRequests).toHaveLength(0);
      const page = await context.newPage();
      expect((await page.goto(origin))?.status()).toBe(200);
      expect(await page.getByRole("heading").textContent()).toBe("Authorized");
      await page.goto(`${origin}/redirect`);
      const serverRendered = await browser.newContext({
        javaScriptEnabled: false,
        storageState: await context.storageState(),
      });
      try {
        const serverPage = await serverRendered.newPage();
        expect((await serverPage.goto(origin))?.status()).toBe(200);
        expect(await serverPage.getByRole("heading").textContent()).toBe("Authorized");
        await serverPage.goto(`${origin}/redirect`);
      } finally {
        await serverRendered.close();
      }
      await authorizeDeployment(http, deployment);
      expect(bootstrapRequests).toBe(2);
      expect((await http.get(origin)).status()).toBe(200);
      expect((await http.get(`${origin}/redirect`)).status()).toBe(200);
      expect(externalRequests.length).toBeGreaterThanOrEqual(5);
      for (const headers of externalRequests) {
        expect(headers.get("x-vercel-protection-bypass")).toBeNull();
        expect(headers.get("x-vercel-set-bypass-cookie")).toBeNull();
        expect(headers.get("cookie")).toBeNull();
      }
      for (const headers of protectedRequests) {
        expect(headers.get("x-vercel-protection-bypass")).toBeNull();
        expect(headers.get("cookie")).toContain("__vercel_protection_bypass=test-cookie");
      }
    } finally {
      await context.close();
      await http.dispose();
      await browser.close();
      await protectedServer.stop(true);
      await external.stop(true);
    }
  },
  30_000,
);
