import { $ } from "bun";

export async function commandExists(command: string) {
  try {
    const isWindows = process.platform === "win32";
    if (isWindows) {
      const result = await $`where ${command}`.nothrow().quiet();
      return result.exitCode === 0;
    }

    const result = await $`which ${command}`.nothrow().quiet();
    return result.exitCode === 0;
  } catch {
    return false;
  }
}
