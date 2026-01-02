import { $ } from "execa";

export async function commandExists(command: string) {
  try {
    const isWindows = process.platform === "win32";
    if (isWindows) {
      const result = await $({ reject: false })`where ${command}`;
      return result.exitCode === 0;
    }

    const result = await $({ reject: false })`which ${command}`;
    return result.exitCode === 0;
  } catch {
    return false;
  }
}
