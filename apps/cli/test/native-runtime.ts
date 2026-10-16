import path from "node:path";

import { chromium, expect } from "@playwright/test";
import fs from "fs-extra";

import type { CreateInput } from "../src";

/** Select native samples that can verify navigation without external auth services. */
function canVerifyNavigation(config: CreateInput) {
  return (
    config.frontend?.some((frontend) => frontend.startsWith("native-")) &&
    config.backend === "hono" &&
    config.auth === "better-auth" &&
    config.examples?.includes("ai")
  );
}

/** Expose the generated root navigator's back state on its existing modal route. */
export async function writeNativeNavigationProbe(config: CreateInput, projectDir: string) {
  if (!canVerifyNavigation(config)) return;
  await fs.writeFile(
    path.join(projectDir, "apps/native/app/modal.tsx"),
    `import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";

export default function Modal() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <View>
      <Text>Direct-linked modal</Text>
      <Button title="Return home" disabled={!ready || !router.canGoBack()} onPress={() => router.back()} />
    </View>
  );
}
`,
  );
  if (config.frontend?.includes("native-unistyles")) {
    const html = path.join(projectDir, "apps/native/app/+html.tsx");
    await fs.writeFile(
      html,
      (await fs.readFile(html, "utf8")).replace('"expo-router/html"', '"../html-context-probe"'),
    );
    await fs.writeFile(
      path.join(projectDir, "apps/native/html-context-probe.tsx"),
      `import { useServerDocumentContext as useDocumentContext } from "expo-router/html";
export { ScrollViewStyleReset } from "expo-router/html";
export function useServerDocumentContext() {
  const context = useDocumentContext();
  const htmlAttributes = { ...context.htmlAttributes };
  htmlAttributes.lang = "fr";
  return { ...context, htmlAttributes };
}
`,
    );
  }
}

/** Open the exported modal directly and after a reload, then navigate to its drawer anchor. */
export async function verifyNativeNavigation(config: CreateInput, projectDir: string) {
  if (!canVerifyNavigation(config)) return;
  const root = path.join(projectDir, "apps/native/dist");
  const browser = await chromium.launch();
  const server = Bun.serve({
    hostname: "127.0.0.1",
    port: 0,
    /** Serve only files emitted by Expo's static export. */
    async fetch(request) {
      const file = path.resolve(root, `.${decodeURIComponent(new URL(request.url).pathname)}`);
      if (file !== root && !file.startsWith(`${root}${path.sep}`))
        return new Response(null, { status: 404 });
      for (const candidate of [file, `${file}.html`, path.join(file, "index.html")]) {
        if ((await fs.stat(candidate).catch(() => undefined))?.isFile())
          return new Response(Bun.file(candidate));
      }
      return new Response(null, { status: 404 });
    },
  });
  try {
    const page = await browser.newPage();
    await page.goto(`${server.url}modal`);
    const back = page.getByRole("button", { name: "Return home", exact: true });
    for (const reload of [false, true]) {
      if (reload) await page.reload();
      await expect(page.getByText("Direct-linked modal", { exact: true })).toBeVisible();
      await expect(back).toBeEnabled();
      if (config.frontend?.includes("native-unistyles"))
        await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    }
    await back.click();
    await expect(page).toHaveURL(server.url.href);
  } finally {
    server.stop(true);
    await browser.close();
  }
}
