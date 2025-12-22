import { log } from "@clack/prompts";
import { $ } from "bun";

export async function openUrl(url: string) {
  const platform = process.platform;

  try {
    if (platform === "darwin") {
      await $`open ${url}`.quiet();
    } else if (platform === "win32") {
      await $`cmd /c start "" ${url.replace(/&/g, "^&")}`.quiet();
    } else {
      await $`xdg-open ${url}`.quiet();
    }
  } catch {
    log.message(`Please open ${url} in your browser.`);
  }
}
