import { Result } from "better-result";
import { $ } from "execa";

export async function commandExists(command: string): Promise<boolean> {
  const result = await Result.tryPromise({
    try: async () => {
      const isWindows = process.platform === "win32";
      if (isWindows) {
        const execResult = await $({ reject: false })`where ${command}`;
        return execResult.exitCode === 0;
      }

      const execResult = await $({ reject: false })`which ${command}`;
      return execResult.exitCode === 0;
    },
    catch: () => false,
  });

  return result.isOk() ? result.value : false;
}
