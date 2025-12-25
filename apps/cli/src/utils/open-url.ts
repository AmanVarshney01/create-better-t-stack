import { log } from "@clack/prompts";
import { $ } from "execa";

export async function openUrl(url: string) {
  const platform = process.platform;

  try {
    if (platform === "darwin") {
      await $({ stdio: "ignore" })`open ${url}`;
    } else if (platform === "win32") {
      // Windows needs special handling for ampersands
      const escapedUrl = url.replace(/&/g, "^&");
      await $({ stdio: "ignore" })`cmd /c start "" ${escapedUrl}`;
    } else {
      await $({ stdio: "ignore" })`xdg-open ${url}`;
    }
  } catch {
    log.message(`Please open ${url} in your browser.`);
  }
}
