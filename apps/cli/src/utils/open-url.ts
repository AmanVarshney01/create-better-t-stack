import { $ } from "execa";

export async function openUrl(url: string): Promise<void> {
  const platform = process.platform;

  if (platform === "darwin") {
    await $({ stdio: "ignore" })`open ${url}`;
    return;
  }

  if (platform === "win32") {
    // Windows needs special handling for ampersands
    const escapedUrl = url.replace(/&/g, "^&");
    await $({ stdio: "ignore" })`cmd /c start "" ${escapedUrl}`;
    return;
  }

  await $({ stdio: "ignore" })`xdg-open ${url}`;
}
