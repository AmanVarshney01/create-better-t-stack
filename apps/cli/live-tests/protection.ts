import { expect, type APIRequestContext } from "@playwright/test";

import type { Deployment } from "./providers";

export async function authorizeDeployment(request: APIRequestContext, deployment: Deployment) {
  if (!deployment.protectionBypass) return;
  const origins = new Set(
    [deployment.web, deployment.server].flatMap((url) => (url ? [new URL(url).origin] : [])),
  );
  for (const origin of origins) {
    // Vercel sets a scoped cookie for subsequent browser requests. Do not follow
    // redirects with a bypass header or configure it as a context-wide header.
    const response = await request.get(origin, {
      headers: {
        "x-vercel-protection-bypass": deployment.protectionBypass,
        "x-vercel-set-bypass-cookie": "true",
      },
      maxRedirects: 0,
    });
    try {
      expect([200, 302, 303, 307, 308], "Vercel bypass cookie response").toContain(
        response.status(),
      );
      expect(response.headers()["set-cookie"], "Vercel bypass cookie").toBeTruthy();
    } finally {
      await response.dispose();
    }
  }
}
