import { log } from "@clack/prompts";
import { Result } from "better-result";
import { $ } from "execa";

export async function openUrl(url: string): Promise<void> {
  const platform = process.platform;

  const result = await Result.tryPromise({
    try: async () => {
      if (platform === "darwin") {
        await $({ stdio: "ignore" })`open ${url}`;
      } else if (platform === "win32") {
        // Windows needs special handling for ampersands
        const escapedUrl = url.replace(/&/g, "^&");
        await $({ stdio: "ignore" })`cmd /c start "" ${escapedUrl}`;
      } else {
        await $({ stdio: "ignore" })`xdg-open ${url}`;
      }
    },
    catch: () => undefined,
  });

  if (result.isErr()) {
    log.message(`Please open ${url} in your browser.`);
  }
}
